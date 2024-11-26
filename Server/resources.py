from flask import Flask, jsonify
from flask_mqtt import Mqtt
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager

import json

class Response:
    def __init__(self, message: str = "Default message", authorized: bool = False, data: object = None):
        self.response = {
            "message": message,
            "authorized": authorized,
            "data": data if data is not None else {}
        }

    def message(self, message):
        self.response["message"] = message

    def authorize(self):
        self.response["authorized"] = True
        return self

    def data(self, new_data):
        self.response["data"] = new_data
        return self

    def to_json(self):
        return self.response

    def __call__(self):
        return jsonify(self.to_json())

    def __str__(self):
        return jsonify(self.to_json())

class Config:
    SECRET_KEY = 'smartgrow'
    MQTT_BROKER_URL = '192.168.1.2'
    MQTT_BROKER_PORT = 1883
    MQTT_USERNAME = 'username'
    MQTT_PASSWORD = 'password'
    MQTT_KEEPALIVE = 5
    MQTT_TLS_ENABLED = False
    SQLALCHEMY_DATABASE_URI = 'sqlite:///smartgrow.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

app = Flask(__name__, static_folder='../App/dist', static_url_path='')
app.config.from_object(Config)

# mqtt = Mqtt(app)

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
