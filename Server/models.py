from bson import ObjectId
from resources import users, bcrypt
from flask_login import UserMixin
from datetime import datetime

class User(UserMixin):
    def __init__(self, username, email, password=None, devices=None, _id=None):
        self._id = _id
        self.username = username
        self.email = email
        self.password = password
        self.devices = [Device(**device, user=self) if isinstance(device, dict) else device for device in devices] if devices else []

    def save(self):
        user_data = {
            'username': self.username,
            'email': self.email,
            'password': self.password,
            'devices': self.get_devices()
        }

        if not self._id:
            result = users.insert_one(user_data)
            self._id = result.inserted_id
        else:
            users.update_one({'_id': ObjectId(self._id)}, {"$set": user_data})
    
    def set_password(self, password):
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)
    
    def response_data(self):
        return {
            '_id': str(self._id) if self._id else None,
            'username': self.username,
            'email': self.email,
            'devices': self.get_devices()
        }
    
    def add_device(self, name):
        existing_device = self.get_device_by_name(name)

        if existing_device:
            return existing_device

        new_device = Device(name=name, user=self)

        self.devices.append(new_device)
        self.save()

        return new_device

    def get_device_by_id(self, id):
        if 0 <= id < len(self.devices):
            if self.devices[id] is not None:
                return self.devices[id].response_data()

        return None

    def get_device_by_name(self, device_name):
        for device in self.devices:
            if device.name == device_name:
                return device
            
        return None
    
    def get_devices(self):
        return [device.response_data() for device in self.devices]

    def get_id(self):
        return str(self._id)
    
    @staticmethod
    def get_by_id(user_id):
        user_data = users.find_one({"_id": ObjectId(user_id)})

        if user_data:
            return User(**user_data)

    @staticmethod
    def get_by_username(username):
        user_data = users.find_one({"username": username})

        if user_data:
            return User(**user_data)

    @staticmethod
    def get_by_email(email):
        user_data = users.find_one({"email": email})

        if user_data:
            return User(**user_data)

    def __repr__(self):
        return f"<User {self.username}>"

class Device:
    def __init__(self, name, user, readings=None):
        self.name = name
        self.user = user
        self.readings = readings or []

    def response_data(self):
        return {
            "name": self.name,
            "readings": self.readings
        }

    def add_reading(self, temperature=None, humidity=None, light=None, moisture=None):
        reading = {
            "time": int(datetime.now().timestamp()),
            "temperature": temperature,
            "humidity": humidity,
            "light": light,
            "moisture": moisture
        }

        reading = {k: v for k, v in reading.items() if v is not None}

        self.readings.append(reading)

        if len(self.readings) > 24:
            self.readings.pop(0)

        if self.user:
            self.user.save()

    def __repr__(self):
        return f"<Device {self.name}>"

    def __str__(self):
        return f"<Device {self.name}>"