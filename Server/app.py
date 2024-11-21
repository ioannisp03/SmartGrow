from flask import Flask, render_template, send_from_directory, jsonify
from flask_cors import CORS

import paho.mqtt.client as paho

def on_connect(client, userdata, flags, rc):
    client.subscribe("sensor/tempdata")

# def on_message(client, userdata, msg):
    # The data we'll need to disect

client = paho.Client()

client.on_connect = on_connect
#client.on_message = on_message

# client.connect("192.168.1.2", 1883, 60)

# client.loop_start()


# Web Service


app = Flask(__name__, static_folder='../App/dist', static_url_path='/')
CORS(app)

@app.route('/')
def index():
    print("Test")
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify({
        "John": True
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')