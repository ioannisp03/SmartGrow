from flask import Flask
from flask_mqtt import Mqtt
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_bcrypt import Bcrypt
from models import User
from resources import db,bcrypt,login_manager

app = Flask(__name__)
app.config.from_object(Config)

# Broker

#mqtt = Mqtt(app)

#@mqtt.on_connect()
#def handle_connect(client, userdata, flags, rc):
#    print('Connected to MQTT broker!')
#    mqtt.subscribe('your/topic')

#@mqtt.on_message()
#def handle_mqtt_message(client, userdata, message):
#    print(f"Received message: {message.payload.decode()} on topic {message.topic}")

# Database

login_manager.login_view = 'login'
login_manager.login_message_category = 'info'
login_manager.init_app(app)

db.init_app(app)

from routes import *

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
