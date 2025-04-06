from flask import jsonify, send_from_directory
from app import app, db
import os

# for recognizing the db package
from database.db_provider import DBProvider
db: DBProvider

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")

@app.route("/api/v1/get_categories", methods=["GET"])
def get_categories():
    try:
        categories = db.get_categories_for_user()
        if categories is None:
            return jsonify({"error": "Database error"}), 500
        return jsonify(categories) 
    except Exception as e:
        print("❌ Exception occurred:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/api/v1/get_level", methods=["GET"])
def get_levels():
    levels = db.get_levels_for_category()

    if levels is None:
        return jsonify({"error": "Database error"}), 500
    return levels