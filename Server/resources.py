from flask import Flask, jsonify
from flask_mqtt import Mqtt
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_login import LoginManager

class Response:
    def __init__(self, message: str = "Default message", authorized: bool = False, data: object = None):
        self.response = {
            "message": message,
            "authorized": authorized,
            "data": data if data is not None else {}
        }

    def addfield(self, name, data):
        self.response[name] = data
        return self

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
    SESSION_COOKIE_NAME = 'smartgrow'
    SESSION_TYPE = 'filesystem'
    MQTT_BROKER_URL = 'localhost'
    MQTT_BROKER_PORT = 1883
    MQTT_USERNAME = 'smartgrow'
    MQTT_PASSWORD = 'supersecretsmartgrowpassword'
    MQTT_KEEPALIVE = 5
    MQTT_TLS_ENABLED = False
    MONGO_URI  = 'mongodb://localhost:27017/smartgrow'

app = Flask(__name__, static_folder='../App/dist', static_url_path='')
app.config.from_object(Config)

mqtt = Mqtt(app)

mongo = PyMongo(app)
users = mongo.db['users']
items = mongo.db['items']

bcrypt = Bcrypt(app)

login_manager = LoginManager(app)
