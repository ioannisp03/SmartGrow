from bson import ObjectId
from resources import users, bcrypt
from flask_login import UserMixin
from datetime import datetime

import json

class User(UserMixin):
    def __init__(self, username, email, password=None, devices=None, _id=None):
        self._id = _id
        self.username = username
        self.email = email
        self.password = password
        self.devices = [Device(**device) if isinstance(device, dict) else device for device in devices] if devices else []

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
    
    def add_device(self, device_name):
        if self.get_device_by_name(device_name):
            return self.devices

        self.devices.append(Device(name=device_name))
        self.save()

        return self.devices

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
    def __init__(self, name, temperature=None, water_level=None, humidity=None):
        self.name = name
        self.temperature = temperature or []
        self.water_level = water_level or []
        self.humidity = humidity or []

    def response_data(self):
        return {
            "name": self.name,
            "temperature": self.temperature,
            "water_level": self.water_level,
            "humidity": self.humidity
        }

    @classmethod
    def to_dict(cls, data):
        return {
            "name": data["name"],
            "temperature": data.get("temperature", []),
            "water_level": data.get("water_level", []),
            "humidity": data.get("humidity", [])
        }

    def add_reading(self, data_map, reading):
        current_time = int(datetime.now().timestamp())
        data_map.append({"time": current_time, "value": reading})

        if len(data_map) > 24:
            data_map.pop(0)

    def add_temperature(self, temperature):
        self.add_reading(self.temperature, temperature)

    def add_water_level(self, water_level):
        self.add_reading(self.water_level, water_level)

    def add_humidity(self, humidity):
        self.add_reading(self.humidity, humidity)

    def __repr__(self):
        return f"<Device {self.name}>"

    def __str__(self):
        return f"<Device {self.name}>"