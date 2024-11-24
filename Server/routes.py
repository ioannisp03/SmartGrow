from flask import send_from_directory, request, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from models import User
from resources import db,app

# Webpage Endpoints

@app.route('/', defaults={'path': ''})
def home_page(path):
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/login', defaults={'path': ''})
def login_page(path):
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/register', defaults={'path': ''})
def register_page(path):
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/dashboard')
@login_required
def dashboard():
    return send_from_directory(app.static_folder, 'index.html')

# API Endpoints

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    if not data:
        return jsonify({'message': 'No data provided'}), 400

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'message': 'Missing required fields'}), 400
    
    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Email already exists'}), 400
    
    user = User(username=username, email=email)
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if user and user.check_password(password):
        login_user(user)
        return jsonify({'message': 'Login successful'}), 200
    
    return jsonify({'message': 'Invalid email or password'}), 401

@app.route('/api/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'}), 200