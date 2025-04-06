from flask import Flask
from flask_cors import CORS
from database.db_provider import DBProvider 

app = Flask(__name__, static_folder="../../frontend/dist", static_url_path="")
CORS(app)

db = DBProvider()

from app.app import * 
