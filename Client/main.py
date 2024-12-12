from paho.mqtt.client import Client
from config import Config

import json

valve_toggle = False
lights_toggle = False

def toggle_valve(boolean=None):
    global valve_toggle

    valve_toggle = boolean if boolean is not None else not valve_toggle
    
    return valve_toggle

def toggle_lights(boolean=None):
    global lights_toggle

    lights_toggle = boolean if boolean is not None else not lights_toggle
    
    return lights_toggle

def on_message(client, userdata, message):
    try:
        data = json.loads(message.payload)
        if data.get("command") == "toggle_lights":
            toggle_lights()
        elif data.get("command") == "toggle_valve":
            toggle_valve()
        elif data.get("command") == "valve_on":
            toggle_valve(boolean=True)
        elif data.get("command") == "valve_off":
            toggle_valve(boolean=False)
        elif data.get("command") == "lights_on":
            toggle_lights(boolean=True)
        elif data.get("command") == "lights_off":
            toggle_lights(boolean=False)     
    except json.JSONDecodeError:
        print("Received invalid JSON data")

def on_connect(client, userdata, flags, rc):
    print(f'Connected to MQTT broker with result code {rc}')

mqtt = Client()
mqtt.connect(Config.MQTT_BROKER_URL, Config.MQTT_BROKER_PORT, Config.MQTT_KEEPALIVE)

mqtt.on_connect = on_connect
mqtt.on_message = on_message

def publish_data():
    mqtt.publish(Config.MQTT_TOPIC_PREFIX, "Test")

publish_data()

mqtt.loop_forever()
