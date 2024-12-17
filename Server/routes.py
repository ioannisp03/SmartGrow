from flask import send_from_directory, request, redirect, url_for
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug import exceptions

from models import User, Device

from resources import app, login_manager, mqtt
from response import Response

from config import Config

import json

# Webpage Endpoints

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_index(path):
    if path.startswith("assets") or path == "favicon.ico":
        return send_from_directory(app.static_folder, path)
    
    return send_from_directory(app.static_folder, "index.html")

@app.route('/error', defaults={'path': ''})
def error_page(path):
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/register')
def register_page():
    if current_user.is_authenticated:
        return redirect(url_for('devices_page'))
    
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/login')
def login_page():
    if current_user.is_authenticated:
        return redirect(url_for('devices_page'))
    
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/devices')
@login_required
def devices_page():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/devices/<string:device_id>')
@login_required
def device_dashboard_page(device_id):
    return send_from_directory(app.static_folder, 'index.html')

@app.route("/static/<path:filename>")
def serve_static(filename):
    return send_from_directory(app.static_folder, filename)

# API Endpoints

@app.route('/api/register', methods=['POST'])
def register():
    if current_user.is_authenticated: 
        return Response(message="User already authenticated.", authorized=True)(), 400

    data = request.get_json()

    if not data:
        return Response(message='No data provided')(), 400

    username, email, password = data.get('username'), data.get('email'), data.get('password')

    if not username or not email or not password:
        return Response(message='Missing required fields')(), 400
    
    if User.get_by_username(username) or User.get_by_email(email):
        return Response(message='Username or Email already exists')(), 400
    
    user = User(username=username, email=email)
    user.set_password(password)

    user.save()

    return Response(message='User registered successfully')(), 201

@app.route('/api/login', methods=['POST'])
def login():
    if current_user.is_authenticated: 
        return Response(message="User already authenticated.")(), 400
    
    data = request.get_json()
    if not data:
        return Response(message='No data provided')(), 400

    username, password = data.get('username'), data.get('password')

    if not username or not password:
        return Response(message='Missing required fields')(), 400

    user = User.get_by_username(username)

    if not user or not user.check_password(password):
        return Response(message='Invalid username or password')(), 401

    login_user(user)

    return Response(message='Logged in successfully', data=user.response_data())(), 200

@app.route('/api/logout', methods=['POST'])
def logout():
    logout_user()
    return Response(message='Logged out successfully')(), 200

@app.route('/api/user', methods=['GET'])
@login_required
def get_user_info():
    device = Device.get_by_id("675f4723300991ac7394193b")
    device.add_reading()
    device.save()

    return Response(message='User data fetched', data=current_user.response_data())(), 200

@app.route('/api/user/devices', methods=['GET'])
@login_required
def get_user_devices():
    # device = Device.create("Smart Plant", current_user.get_id())
    # current_user.add_device(device.get_id())

    return Response(message='User devices fetched', data=current_user.get_devices())(), 200

@app.route('/api/user/devices/<string:id>', methods=['GET'])
@login_required
def handle_device_by_id(id):
    device = Device.get_by_id(id)

    if device is None:
        return Response(message="Device not found")(), 404

    return Response(message='Device fetched successfully', data=device.response_data())(), 200

@app.route('/api/user/devices/<string:id>', methods=['POST'])
@login_required
def Post_device_by_id(id):
    device = Device.get_by_id(id)
    if device is None:
        return Response(message="Device not found")(), 404
    
    data = request.get_json()

    if not data:
        return Response(message='No data provided')(), 400

    #if data.get('override') is not None or data.get('toggle') is not None:
    #    return Response(message='Missing required fields')(), 400

    device.live['light_user_override'] = data['override']
    device.live['light_toggle'] = data['toggle']

    print(device.live)

    mqtt.publish(f"{Config.MQTT_TOPIC_PREFIX}{current_user.get_id()}/{device.get_id()}", json.dumps({
        "command": (device.live['light_user_override'] and (device.live['light_toggle'] and "lights_on" or "lights_off")) or (int(device.live['light']) < 50 and "lights_on" or "light_off")
    }));

    return Response(message='Successfully updated device state')(), 200

@login_manager.unauthorized_handler
def unauthorized():
    if request.path.startswith('/api/'):
        return Response(message='not authorized for this action. Permission denied.')(), 401

    return redirect(url_for('login_page'))

@app.errorhandler(exceptions.NotFound)
def notfound(error):
    if request.path.startswith('/api/'):
        return Response(message='api endpoint not found.')(), 404
    
    return redirect(url_for('error_page'))