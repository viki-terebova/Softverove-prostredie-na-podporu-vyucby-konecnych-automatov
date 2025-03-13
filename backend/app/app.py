from flask import jsonify
from app import app, db

@app.route("/")
def home():
    return jsonify({"message": "Welcome to FiniAutoma!"})

@app.route("/users", methods=["GET"])
def get_users():
    query = "SELECT id, username, email FROM users;"
    users = db.execute_query(query, fetchall=True)

    if users is None:
        return jsonify({"error": "Database error"}), 500

    return jsonify(users)
