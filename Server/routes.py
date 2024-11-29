from flask import send_from_directory, request, jsonify, redirect, url_for
from flask_login import login_user, logout_user, login_required, current_user
from models import User, Item
from resources import db,app, login_manager, Response

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

# API Endpoints

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        if current_user.is_authenticated: 
            return Response(message="User already authenticated.", authorized=True)()

        data = request.json

        if not data:
            return Response(message='No data provided')(), 400

        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not username or not email or not password:
            return Response(message='Missing required fields')(), 400
        
        if User.query.filter_by(email=email).first():
            return Response(message='Email already exists')(), 400
        
        user = User(username=username, email=email)
        user.set_password(password)

        db.session.add(user)
        db.session.commit()

        return Response(message='User registered successfully')(), 201
    
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.json
        email = data.get('email')
        password = data.get('password')

        user = User.query.filter_by(email=email).first()

        if user and user.check_password(password):
            login_user(user)

            user_data = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'items': user.items,
            }

            return Response(message='Login successful', data=user_data, authorized=True)(), 200
        
        return Response(message='Invalid email or password')(), 401
    
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/logout', methods=['POST'])
def logout():
    logout_user()
    return Response(message='Logged out successfully')(), 200

@app.route('/api/user', methods=['GET'])
@login_required
def get_user_info():
    user_data = {
        'id': current_user.id,
        'username': current_user.username,
        'email': current_user.email,
        'items': [item.id for item in current_user.items],
    }

    return Response(message='Authorized',authorized=True,data=user_data)(), 200

@login_manager.unauthorized_handler
def unauthorized():
    if request.path.startswith('/api/'):
        return Response(message='not authorized for this action. Permission denied.')(), 401

    return redirect(url_for('login'))

@app.errorhandler(404)
def notfound(error):
    if request.path.startswith('/api/'):
        return Response(message='api endpoint not found.')(), 404
    
    return redirect(url_for('error_page'))