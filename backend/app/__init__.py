from flask import Flask
from flask_cors import CORS
from flask_login import LoginManager
from database.db_provider import DBProvider 
import os

app = Flask(__name__, static_folder="../../frontend/dist", static_url_path="")
app.secret_key = os.getenv("SECRET_KEY")
CORS(app, supports_credentials=True)

login_manager = LoginManager()
login_manager.init_app(app)

database = DBProvider()


from app.app import * 
