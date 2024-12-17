from resources import mqtt
from config import Config
from models import Device, User

import json

def on_connect(client, userdata, flags, rc):
    print(f"Connected with result code {rc}")
    mqtt.subscribe(f"{Config.MQTT_TOPIC_PREFIX}#")

def on_message(client, userdata, message):
    topic = message.topic
    payload = message.payload.decode()

    if topic.startswith(Config.MQTT_TOPIC_PREFIX):
        parts = topic.split("/")
        user_id = parts[1]
        device_id = parts[2] if len(parts) > 2 else None

        if user_id and device_id and User.get_by_id(user_id=user_id) and Device.get_by_id(device_id=device_id):
            device = Device.get_by_id(device_id=device_id)

            data = json.loads(payload)

            if data and data.get('command'):
                device.live['light_toggle'] = data['command'] == 'lights_on'
            else:
                device.update_live(data)
            

mqtt.on_connect = on_connect
mqtt.on_message = on_message

mqtt.connect(Config.MQTT_BROKER_URL, Config.MQTT_BROKER_PORT, Config.MQTT_KEEPALIVE)
mqtt.loop_start()