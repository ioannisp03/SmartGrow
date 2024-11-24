from flask import render_template, send_from_directory, redirect, url_for, flash, request, jsonify
from flask_login import login_user, logout_user, login_required
from models import User
from resources import db,app

import os

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    print(f"Requested path: {path}")
    print(f"Static folder exists: {os.path.exists(app.static_folder)}")

    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

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

@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html')

@app.route('/api/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'}), 200
