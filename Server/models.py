from bson import ObjectId
from resources import users, bcrypt
from flask_login import UserMixin
from datetime import datetime

import random

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
            'devices': self.get_devices(exclude_live=True)
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
                return self.devices[id]

        return None

    def get_device_by_name(self, device_name):
        for device in self.devices:
            if device.name == device_name:
                return device
            
        return None
    
    def get_devices(self, exclude_live=False):
        devices_data = []

        for device in self.devices:
            device_data = device.response_data()

            if exclude_live:
                device_data.pop('live', None)

            devices_data.append(device_data)

        return devices_data

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
    def __init__(self, name, user, history=None, live=None):
        self.name = name
        self.user = user
        self.history = history or []
        self.live = live or {
            'temperature': None,
            'humidity': None,
            'moisture': None,
            'light': None,
            'light_toggle': False,
            'valve_toggle': False,
        }

    def response_data(self):
        self.update_live()

        return {
            "name": self.name,
            "history": self.history,
            "live": self.live,
        }

    def add_reading(self):
        reading = {
            "time": int(datetime.now().timestamp()),
            "temperature": self.live['temperature'],
            "humidity": self.live['humidity'],
            "light": self.live['light'],
            "moisture": self.live['moisture']
        }

        reading = {k: v for k, v in reading.items() if v is not None}

        self.history.append(reading)

        if len(self.history) > 24:
            self.history.pop(0)

        if self.user:
            self.user.save()
    
    def update_live(self):
        """This method will be communicating with MQTT to actually pull real data"""
        temp_data = {
            'temperature': random.randint(1, 100),
            'humidity': random.randint(1, 100),
            'light': random.randint(1, 100),
            'moisture': random.randint(1, 100),
            'light_toggle': True,
            'valve_toggle': False
        }

        updates = {
            'temperature': temp_data['temperature'],
            'humidity': temp_data['humidity'],
            'light': temp_data['light'],
            'moisture': temp_data['moisture'],
            'light_toggle': temp_data['light_toggle'],
            'valve_toggle': temp_data['valve_toggle']
        }

        for key, value in updates.items():
            if value is not None:
                self.live[key] = value

    def __repr__(self):
        return f"<Device {self.name}>"

    def __str__(self):
        return f"<Device {self.name}>"