from flask import jsonify
from app import app, db

# for recognizing the db package
from database.db_provider import DBProvider
db: DBProvider

@app.route("/")
def home():
    return jsonify({"message": "Welcome to FiniAutoma!"})

@app.route("/users", methods=["GET"])
def get_users():
    print("get_users")
    categories = db.get_categories_for_user()

    if categories is None:
        return jsonify({"error": "Database error"}), 500

    return jsonify(categories)
