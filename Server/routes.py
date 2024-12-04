from flask import send_from_directory, request, redirect, url_for
from flask_login import login_user, logout_user, login_required, current_user

from models import User

from resources import app, login_manager
from response import Response

# Webpage Endpoints

@app.route('/', defaults={'path': ''})
def home_page(path):
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/error', defaults={'path': ''})
def error_page(path):
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/dashboard')
@login_required
def dashboard_page():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/register')
def register_page():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/login')
def login_page():
    return send_from_directory(app.static_folder, 'index.html')

# API Endpoints

@app.route('/api/register', methods=['POST'])
def register():
    if current_user.is_authenticated: 
        return Response(message="User already authenticated.", authorized=True)(), 400

    data = request.get_json()

    if not data:
        return Response(message='No data provided')(), 400

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

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

    username = data.get('username')
    password = data.get('password')

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
    if not current_user.is_authenticated:
        return Response(message='Unauthorized')(), 401

    return Response(message='User data fetched', data=current_user.response_data())(), 200

@app.route('/api/items', methods=['GET', 'POST', 'PUT', 'DELETE'])
@login_required
def manage_user_items():
    if not current_user.is_authenticated:
        return Response(message='Unauthorized')(), 401

    if request.method == 'GET':
        items = current_user.get_items()

        current_user.add_item("Smart Plant")

        return Response(message='User items fetched', data=items)(), 200

    elif request.method == 'POST':
        item_data = request.get_json()

        if not item_data:
            return Response(message='Bad request, no data provided')(), 400
        
        new_item = current_user.create_item(item_data)

        return Response(message='Item created', data=new_item)(), 201

    elif request.method == 'PUT':
        item_data = request.get_json()

        if not item_data or 'id' not in item_data:
            return Response(message='Bad request, missing item ID or data')(), 400
        
        item_id = item_data['id']
        user_item = current_user.get_item_by_id(item_id)

        if user_item is None:
            return Response(message="Item not found")(), 404

        user_item.update(item_data)
        current_user.save()

        return Response(message='Item updated', data=user_item)(), 200

    elif request.method == 'DELETE':
        item_data = request.get_json()
        
        if not item_data or 'id' not in item_data:
            return Response(message='Bad request, missing item ID')(), 400
        
        item_id = item_data['id']
        user_item = current_user.get_item_by_id(item_id)

        if user_item is None:
            return Response(message="Item not found")(), 404

        current_user.delete_item(item_id)

        return Response(message='Item deleted')(), 200

@app.route('/api/items/<int:id>', methods=['GET'])
@login_required
def get_user_item_by_id(id):
    if not current_user.is_authenticated:
        return Response(message='Unauthorized')(), 401

    user_item = current_user.get_item_by_id(id)

    if user_item == None:
        return Response(message="Item not found")(), 404

    return Response(message='User item fetched', data=user_item)(), 200

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