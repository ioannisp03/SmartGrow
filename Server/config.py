from dotenv import load_dotenv
import os

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'smartgrow')
    SESSION_COOKIE_NAME = os.getenv('SESSION_COOKIE_NAME', 'smartgrow')
    SESSION_TYPE = os.getenv('SESSION_TYPE', 'filesystem')
    MQTT_BROKER_URL = os.getenv('MQTT_BROKER_URL', 'localhost')
    MQTT_BROKER_PORT = int(os.getenv('MQTT_BROKER_PORT', 1883))
    MQTT_USERNAME = os.getenv('MQTT_USERNAME', '')
    MQTT_PASSWORD = os.getenv('MQTT_PASSWORD', '')
    MQTT_KEEPALIVE = int(os.getenv('MQTT_KEEPALIVE', 5))
    MQTT_TLS_ENABLED = os.getenv('MQTT_TLS_ENABLED', 'False') == 'True'
    MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/smartgrow')