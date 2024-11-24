from models import User
from resources import app,db,login_manager

login_manager.login_view = 'login'
login_manager.login_message_category = 'info'

from routes import *

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
