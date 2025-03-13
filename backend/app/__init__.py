from flask import Flask
from flask_cors import CORS
from database.db_provider import DBProvider 

app = Flask(__name__)
CORS(app)

db = DBProvider()

conn = db.connect()
if conn:
    print("✅ Successfully connected to the database!")
    conn.close()
else:
    print("❌ Failed to connect to the database!")

from app.app import * 
