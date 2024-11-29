from bson import ObjectId
from resources import users, bcrypt
from flask_login import UserMixin
from datetime import datetime

class User(UserMixin):
    def __init__(self, username, email, password=None, items=None, _id=None):
        self._id = _id
        self.username = username
        self.email = email
        self.password = password
        self.items = [Item.from_dict(item) for item in items] if items else []
    
    def set_password(self, password):
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)
    
    def response_data(self):
        return {
            '_id': str(self._id) if self._id else None,
            'username': self.username,
            'email': self.email,
            'items': [item.to_dict() for item in self.items]
        }
    
    def add_item(self, item_name):
        if self.get_item_by_name(item_name):
            return self.items

        self.items.append(Item(name=item_name))
        self.save()

        return self.items

    def get_item_by_name(self, item_name):
        for item in self.items:
            if item.name == item_name:
                return item
            
        return None
    
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
    
    def save(self):
        user_data = {
            'username': self.username,
            'email': self.email,
            'password': self.password,
            'items': [item.to_dict() for item in self.items],
        }

        if not self._id:
            result = users.insert_one(user_data)

            self._id = result.inserted_id
        else:
            users.update_one({'_id': ObjectId(self._id)}, {"$set": user_data})

    def __repr__(self):
        return f"<User {self.username}>"

class Item:
    def __init__(self, name, temperature=None, water_level=None, humidity=None):
        self.name = name
        self.temperature = temperature or {}
        self.water_level = water_level or {}
        self.humidity = humidity or {}

    def _add_reading(self, data_map, reading):
        current_hour = int(datetime.now().timestamp())
        data_map[current_hour] = reading

        if len(data_map) > 24:
            oldest_key = min(data_map.keys())
            del data_map[oldest_key]

    def add_temperature(self, temperature):
        self._add_reading(self.temperature, temperature)

    def add_water_level(self, water_level):
        self._add_reading(self.water_level, water_level)

    def add_humidity(self, humidity):
        self._add_reading(self.humidity, humidity)

    def response_data(self):
        return {
            "name": self.name,
            "temperature": self.temperature,
            "water_level": self.water_level,
            "humidity": self.humidity
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            name=data["name"],
            temperature=data.get("temperature", {}),
            water_level=data.get("water_level", {}),
            humidity=data.get("humidity", {})
        )

    def __repr__(self):
        return f"<Item {self.name}>"