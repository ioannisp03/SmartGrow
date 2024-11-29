from models import User
from resources import app,login_manager

login_manager.login_view = 'login'
login_manager.login_message_category = 'info'

from routes import *

@login_manager.user_loader
def load_user(_id):
    if _id is None:
        return None
    
    return User.get_by_id(_id)

if __name__ == '__main__':
    app.run(debug=True)
