import paho.mqtt.client as paho
import adafruit_dht
import board
import time
import json
import serial
import math
from gpiozero import LED

leds = LED(17)

user_id = "675f464538e693a3634f0917" #Specific USER ID
device_id = "675f4723300991ac7394193b" #Specific DEVICE ID

dht_sensor = adafruit_dht.DHT11(board.D3)

light_toggle = True
valve_toggle = False

ser = serial.Serial("/dev/ttyACM0", 9600)

topic = f"users/{user_id}/{device_id}"

def on_connect(client, userdata, flags, rc):
    print("Connected with result code " + str(rc))
    client.subscribe(topic)

def toggle_valve(boolean=None):
    global valve_toggle

    valve_toggle = boolean if boolean is not None else not valve_toggle
    
    return valve_toggle

def toggle_lights(boolean=None):
    global light_toggle

    light_toggle = boolean    

    return light_toggle

def on_message(client, userdata, message):
    try:
        data = json.loads(message.payload)

        if data.get("command") == "valve_on":
            toggle_valve(boolean=True)
        elif data.get("command") == "valve_off":
            toggle_valve(boolean=False)
        elif data.get("command") == "lights_on":
            toggle_lights(boolean=True)
        elif data.get("command") == "lights_off":
            toggle_lights(boolean=False)     
    except json.JSONDecodeError:
        print("Received invalid JSON data")

client = paho.Client()

client.on_connect = on_connect
client.on_message = on_message

if client.connect("192.168.1.1", 1883, 60) != 0:
    print("Couldn't connect to the mqtt broker")
    sys.exit(1)

client.loop_start()

while True:
    try:
        temp = dht_sensor.temperature
        humidity = dht_sensor.humidity
        
        reading = ser.readline().decode("utf-8")

        moist = int(reading.split(";")[0])
        light = int(reading.split(";")[1])
        
        data = {
            "temperature": temp,
            "humidity": humidity,
            "light": 100 - math.floor((light / 1024) * 100),
            "moisture": (moist / 500) * 100,
            "light_toggle": light_toggle,
            "valve_toggle": valve_toggle
        }

        encoded = json.dumps(data)

        client.publish(topic, encoded, 0)

        if(light_toggle):
            leds.on()
        else:
            leds.off()
    except RuntimeError as error:
        print(f"Error reading DHT sensor: {error}")
    finally:
        time.sleep(0.5)

client.disconnect()