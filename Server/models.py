from bson import ObjectId
from resources import users, bcrypt
from flask_login import UserMixin

class User(UserMixin):
    def __init__(self, username, email, password=None, _id=None):
        self._id = _id
        self.username = username
        self.email = email
        self.password = password
    
    def set_password(self, password):
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)
    
    def response_data(self):
        return {
            '_id': str(self._id) if self._id else None,
            'username': self.username,
            'email': self.email,
        }
    
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
            'password': self.password
        }

        if not self._id:
            result = users.insert_one(user_data)

            self._id = result.inserted_id
        else:
            users.update_one({'_id': self._id}, {"$set": user_data})

    def __repr__(self):
        return f"<User {self.username}>"
