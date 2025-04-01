from flask import jsonify
from app import app, db

# for recognizing the db package
from database.db_provider import DBProvider
db: DBProvider

@app.route("/")
def home():
    return jsonify({"message": "Welcome to FiniAutoma!"})

@app.route("/get_categories", methods=["GET"])
def get_categories():
    categories = db.get_categories_for_user()

    if categories is None:
        return jsonify({"error": "Database error"}), 500
    return categories

@app.route("/get_level", methods=["GET"])
def get_levels():
    levels = db.get_levels_for_category()

    if levels is None:
        return jsonify({"error": "Database error"}), 500
    return levels