from flask import Flask, render_template, jsonify
import paho.mqtt.client as paho

def on_connect(client, userdata, flags, rc):
    client.subscribe("sensor/tempdata")

# def on_message(client, userdata, msg):
    # The data we'll need to disect

client = paho.Client()

client.on_connect = on_connect
#client.on_message = on_message

client.connect("192.168.1.2", 1883, 60)

client.loop_start()

# Web Service

app = Flask(__name__)

@app.route('/')
def index():
    return jsonify({})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')