from dotenv import load_dotenv
import os

load_dotenv()

class Config:
    MQTT_BROKER_URL = os.getenv('MQTT_BROKER_URL', 'localhost')
    MQTT_TOPIC_PREFIX = "users/"
    MQTT_BROKER_PORT = int(os.getenv('MQTT_BROKER_PORT', 1883))
    MQTT_KEEPALIVE = int(os.getenv('MQTT_KEEPALIVE', 5))
    MQTT_TLS_ENABLED = os.getenv('MQTT_TLS_ENABLED', 'False') == 'True'