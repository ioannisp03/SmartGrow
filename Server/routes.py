from flask import send_from_directory, request, redirect, url_for
from flask_login import login_user, logout_user, login_required, current_user

from models import User

from resources import app, login_manager
from response import Response

import random

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

@app.route('/devices/<int:device_id>')
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
    return Response(message='User data fetched', data=current_user.response_data())(), 200

@app.route('/api/devices', methods=['GET', 'POST', 'PUT', 'DELETE'])
@login_required
def manage_user_devices():
    if request.method == 'GET':
        devices = current_user.get_devices()

        user_item = current_user.add_device("Smart Plant")

        user_item.add_reading(temperature=random.randint(1, 100), humidity=random.randint(1, 100), light=random.randint(1, 100), moisture=random.randint(1, 100))

        return Response(message='User devices fetched', data=devices)(), 200

    elif request.method == 'POST':
        device_data = request.get_json()

        if not device_data:
            return Response(message='Bad request, no data provided')(), 400
        
        new_device = current_user.create_device(device_data)

        return Response(message='Device created', data=new_device)(), 201

    elif request.method == 'PUT':
        device_data = request.get_json()

        if not device_data or 'id' not in device_data:
            return Response(message='Bad request, missing device ID or data')(), 400
        
        device_id = device_data['id']
        user_device = current_user.get_device_by_id(device_id)

        if user_device is None:
            return Response(message="Device not found")(), 404

        user_device.update(device_data)
        current_user.save()

        return Response(message='Device updated', data=user_device)(), 200

    elif request.method == 'DELETE':
        device_data = request.get_json()
        
        if not device_data or 'id' not in device_data:
            return Response(message='Bad request, missing device ID')(), 400
        
        device_id = device_data['id']
        user_device = current_user.get_device_by_id(device_id)

        if user_device is None:
            return Response(message="Device not found")(), 404

        current_user.delete_device(device_id)

        return Response(message='Device deleted')(), 200

@app.route('/api/devices/<int:id>', methods=['GET'])
@login_required
def get_user_device_by_id(id):
    user_device = current_user.get_device_by_id(id)

    if user_device == None:
        return Response(message="Device not found")(), 404

    return Response(message='User device fetched', data=user_device)(), 200

@app.route('/api/devices/<int:id>/live', methods=['GET'])
@login_required
def get_live_user_device_by_id(id):
    user_device = current_user.get_device_by_id(id)

    if user_device == None:
        return Response(message="Device not found")(), 404
    
    mqtt_data = {
        'name': user_device['name'],
        'readings': [{
            'temperature': 10,
            'humidity': 50,
            'moisture': 20,
            'light': 20,
        }],
        'light_toggle': True,
        'valve_toggle': False,
    }

    return Response(message='User device fetched', data=mqtt_data)(), 200

@login_manager.unauthorized_handler
def unauthorized():
    if request.path.startswith('/api/'):
        return Response(message='not authorized for this action. Permission denied.')(), 401

    return redirect(url_for('login_page'))

@app.errorhandler(404)
def notfound(error):
    if request.path.startswith('/api/'):
        return Response(message='api endpoint not found.')(), 404
    
    return redirect(url_for('error_page'))