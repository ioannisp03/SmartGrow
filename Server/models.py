from bson import ObjectId
from resources import users, devices, bcrypt
from flask_login import UserMixin
from datetime import datetime

import random

class User(UserMixin):
    def __init__(self, username, email, password=None, devices=None, _id=None):
        self._id = _id
        self.username = username
        self.email = email
        self.password = password
        self.devices = devices or []

    def save(self):
        user_data = {
            'username': self.username,
            'email': self.email,
            'password': self.password,
            'devices': self.devices
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
            'devices': [Device.get_by_id(device_id).response_data() for device_id in self.devices]
        }
    
    def get_device(self, device_id):
        if device_id in self.devices:
            return Device.get_by_id(device_id=device_id)

    def get_devices(self):
        return [Device.get_by_id(device_id).response_data() for device_id in self.devices]

    def add_device(self, device_id):
        if device_id not in self.devices:
            self.devices.append(device_id)
            self.save()

    def remove_device(self, device_id):
        if device_id in self.devices:
            self.devices.remove(device_id)
            self.save()

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
        return f"<User  {self.username}>"

    def __repr__(self):
        return f"<User {self.username}>"

device_dictionary = {}

class Device:
    def __init__(self, name, user_id, history=None, live=None, _id=None):
        self._id = _id
        self.name = name
        self.user_id = user_id
        self.history = history or []
        self.live = live or {
            'temperature': None,
            'humidity': None,
            'moisture': None,
            'light': None,
            'light_toggle': False,
            'light_user_override': False,
            'valve_toggle': False,
        }

    def save(self):
        data_saved = {
            'name': self.name,
            'user_id': self.user_id,
            'history': self.history,
        }

        if not self._id:
            result = devices.insert_one(data_saved)
            self._id = result.inserted_id
        else:
            devices.update_one({'_id': ObjectId(self._id)}, {"$set": data_saved})

    def get_id(self):
        return str(self._id)

    def response_data(self):
        self.update_live()

        return {
            "_id": str(self._id) if self._id else None,
            "name": self.name,
            "history": self.history,
            "live": self.live,
        }

    def add_reading(self):
        print(self.live)

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

        self.save()

    def update_live(self, data=None):
        if data is not None:
            self.live = data

    @staticmethod
    def get_by_id(device_id):
        if device_dictionary.get(device_id):
            return device_dictionary[device_id]

        device_data = devices.find_one({"_id": ObjectId(device_id)})

        if device_data:
            device_dictionary[device_id] = Device(**device_data)

            return device_dictionary[device_id]

    @staticmethod
    def create(name, user_id):
        device = Device(name=name, user_id=user_id)
        device.save()

        return device

    def __repr__(self):
        return f"<Device {self.name}>"

    def __str__(self):
        return f"<Device {self.name}>"