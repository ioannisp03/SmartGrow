from paho.mqtt.client import Client

from flask import Flask
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_cors import CORS
from config import Config

app = Flask(__name__, static_folder='../App/dist', static_url_path='')
app.config.from_object(Config)

CORS(app)

mqtt = Client()

mongo = PyMongo(app)
users = mongo.db['users']
devices = mongo.db['devices']

bcrypt = Bcrypt(app)

login_manager = LoginManager(app)
