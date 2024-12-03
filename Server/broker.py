from resources import mqtt

@mqtt.on_connect()
def handle_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected successfully to MQTT broker")
        mqtt.subscribe("smartgrow/sensor_data")
    else:
        print(f"Failed to connect with error code {rc}")

@mqtt.on_message()
def handle_mqtt_message(client, userdata, message):
    topic = message.topic
    payload = message.payload.decode('utf-8')
    print(f"Received message on topic '{topic}': {payload}")

@mqtt.on_subscribe()
def handle_subscribe(client, userdata, mid, granted_qos):
    print(f"Subscribed to topic with QoS: {granted_qos}")