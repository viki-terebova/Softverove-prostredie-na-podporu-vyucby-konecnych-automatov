from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
from database.db_provider import DBProvider 
import os

app = Flask(__name__, static_folder="../../frontend/build", static_url_path="/")
CORS(app)

db = DBProvider()

from app.app import *

# React static files
@app.route("/", defaults={"path": "index.html"})

@app.route("/<path:path>", methods=["GET"])
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")


# API endpoints
@app.route("/get_categories", methods=["GET"])
def get_categories():
    categories = db.get_categories_for_user()

    if categories is None:
        return jsonify({"error": "Database error"}), 500
    return categories
