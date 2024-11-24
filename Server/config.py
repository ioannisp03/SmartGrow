class Config:
    SECRET_KEY = 'testingsecretkey'
    MQTT_BROKER_URL = '192.168.1.2'
    MQTT_BROKER_PORT = 1883
    MQTT_USERNAME = 'username'
    MQTT_PASSWORD = 'password'
    MQTT_KEEPALIVE = 5
    MQTT_TLS_ENABLED = False
    SQLALCHEMY_DATABASE_URI = 'sqlite:///smartgrow.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False