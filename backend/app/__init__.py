from flask import Flask
from flask_cors import CORS
from database.db_provider import DBProvider 

app = Flask(__name__)
CORS(app)

db = DBProvider()

from app.app import * 
