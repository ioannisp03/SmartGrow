from datetime import datetime

from resources import db, bcrypt
from flask_login import UserMixin

from sqlalchemy import Column, Integer, String, ForeignKey, Float, DateTime
from sqlalchemy.orm import relationship

class User(db.Model, UserMixin):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String(150), nullable=False, unique=True)
    email = Column(String(150), nullable=False, unique=True)
    password = Column(String(256), nullable=False)
    items = relationship('Item', back_populates='user', cascade='all, delete-orphan')

    @staticmethod
    def hash_password(password):
        return bcrypt.generate_password_hash(password).decode('utf-8')
    
    def set_password(self, password):
        self.password = self.hash_password(password)

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)

    def __repr__(self):
        return f'<User {self.username}>'
    
class Item(db.Model):
    __tablename__ = 'items'

    id = Column(Integer, primary_key=True)
    sensor_readings = relationship('SensorReading', back_populates='item', cascade='all, delete-orphan')

    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    user = relationship('User', back_populates='items')

    def __repr__(self):
        return f'<Item {self.id} linked to User {self.userid}>'
    
class SensorReading(db.Model):
    __tablename__ = 'sensor_readings'

    id = Column(Integer, primary_key=True)
    temperature = Column(Float, nullable=False)
    humidity = Column(Float, nullable=False)
    water_level = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    item_id = Column(Integer, ForeignKey('items.id'), nullable=False)
    item = relationship('Item', back_populates='sensor_readings')

    def __repr__(self):
        return f'<SensorReading {self.id} for Item {self.item_id} at {self.timestamp}>'