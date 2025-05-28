from flask import jsonify, send_from_directory
from app import app, database, login_manager  
import os
from flask import request, session
from flask_login import login_user, logout_user, login_required, current_user
from authentication.models import User
from authentication import auth
from database.exceptions import UserAlreadyExists, RegistrationFailed
from app.additional_functions import extract_level_data

from app.automat_nfa import AutomatNFA
from app.automat_dfa import AutomatDFA
from app.base_validator import BaseValidator

# for recognizing the db package
from database.db_provider import DBProvider
database: DBProvider

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")

@app.route('/api/v1/login', methods=['POST'])
def login_route():
    data = request.get_json()
    username_or_mail = data.get('username_or_mail')
    password = data.get('password')

    user = database.authenticate_user(username_or_mail, password)

    if user == "user_not_found":
        return jsonify({"error": "User not found. Please check your login information or register."}), 404
    elif user == "wrong_password":
        return jsonify({"error": "Incorrect password. Try again or reset your password."}), 401
    elif user:
        login_user(user)
        return jsonify({"message": "Login successful!"}), 200
    else:
        return jsonify({"error": "Something went wrong. Please try again later."}), 500
    
@app.route("/api/v1/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    mail = data.get("mail")
    password = data.get("password")

    if not all([username, mail, password]):
        return jsonify({"error": "All fields are required."}), 400

    try:
        user_id = database.register_user(username, mail, password)
        database.create_user_score(user_id)
        session["user_id"] = user_id
        return jsonify({"message": "User registered", "user_id": user_id}), 200

    except UserAlreadyExists as e:
        return jsonify({"error": str(e)}), 409

    except RegistrationFailed as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/v1/current_user", methods=["GET"])
def get_current_user():
    if current_user.is_authenticated:
        return jsonify({
            "authenticated": True,
            "id": current_user.id,
            "username": current_user.username,
            "mail": current_user.mail,
        })
    else:
        return jsonify({"authenticated": False}), 401
    
@app.route("/api/v1/session_status")
def session_status():
    print(f"Session status: {current_user.is_authenticated}")
    if current_user.is_authenticated:
        return jsonify({"authenticated": True}), 200
    else:
        return jsonify({"authenticated": False}), 401

@app.route('/api/v1/logout')
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logout successful'}), 200

@app.route('/api/v1/protected')
@login_required
def protected():
    return jsonify({'message': f'Hi, {current_user.username}!'})

@login_manager.user_loader
def load_user(user_id):
    user = database.get_user_by_id(user_id)
    if user:
        return User(user.get("id"), user.get("username"), user.get("mail"), user.get("user_password"), user.get("user_role"))
    return None


@app.route("/api/v1/get_categories", methods=["GET"])
@login_required
def get_categories():
    categories = database.get_categories()

    if categories is None:
        return jsonify({"error": "Database error"}), 500

    status_categories = []
    passed_found = 0

    for category in sorted(categories, key=lambda c: c["category_order"]):
        category_id = category["id"]

        levels = database.get_levels_for_category(category_id)
        level_ids = [level["id"] for level in levels]

        achieved_levels = database.get_achieved_levels_for_user_by_category(
            user_id=current_user.id,
            category_id=category_id
        )
        achieved_ids = {level["level_id"] for level in achieved_levels}

        if all(lid in achieved_ids for lid in level_ids):
            status = "passed"
            passed_found += 1
        elif passed_found == category["category_order"]:
            status = "in_progress"
        else:
            if current_user.user_role in ["admin", "lector"]:
                status = "in_progress"
            else:
                status = "locked"

        category_with_status = {**category, "status": status}
        status_categories.append(category_with_status)

    return jsonify(status_categories)

@app.route("/api/v1/category/<category_uuid>", methods=["GET"])
@login_required
def get_category_levels(category_uuid):
    levels = database.get_levels_for_category(category_uuid=category_uuid)
    achieved_levels = database.get_achieved_levels_for_user_by_category(
        user_id=current_user.id,
        category_id=category_uuid
    )
    achieved_dict = {level["level_id"]: level for level in achieved_levels}

    status_levels = []
    passed_found = 1
    for level in sorted(levels, key=lambda l: l["level_number"]):
        level_id = level["id"]
        if level_id in achieved_dict:
            status = "passed"
            passed_found += 1
        elif passed_found == level["level_number"]:
            status = "in_progress"
        else:
            if current_user.user_role in ["admin", "lector"]:
                status = "in_progress"
            else:
                status = "locked"

        level_with_status = {**level, "status": status}
        status_levels.append(level_with_status)

    return jsonify(status_levels)

@app.route("/api/v1/level", methods=["GET"])
def get_level_by_uuid():
    level_id = request.args.get("level_id")

    if not level_id:
        return jsonify({"error": "Missing level_id"}), 400

    level_data = database.get_level_details(level_id)

    if level_data is None:
        return jsonify({"error": "Level not found"}), 404

    return jsonify(level_data)

@app.route("/api/v1/get_public_levels", methods=["GET"])
@login_required
def get_public_levels_from_db():
    levels = database.get_public_levels()

    if levels is None:
        return jsonify({"error": "Database error"}), 500
    return jsonify(levels)

@app.route("/api/v1/change_password", methods=["POST"])
@login_required
def change_password():
    data = request.get_json()
    old_password = data.get("old_password")
    new_password = data.get("new_password")

    if not old_password or not new_password:
        return jsonify({"error": "You need to fill both windows."}), 400

    if not database.verify_password(current_user.id, old_password):
        return jsonify({"error": "Incorrect old password."}), 400

    database.update_password(current_user.id, new_password)
    return jsonify({"message": "Password changed successfully."}), 200

@app.route("/api/v1/update_account", methods=["POST"])
@login_required
def update_account():
    data = request.get_json()
    username = data.get("username")
    if username:
        result = database.update_username(current_user.id, username)
        if result.get("error"):
            return jsonify({"error": result["error"]}), 400
        return jsonify({"message": "Username updated."}), 200
    return jsonify({"error": "Invalid data"}), 400

@app.route("/api/v1/get_user_score")
@login_required
def get_user_score():
    score_row = database.get_user_score(current_user.id)
    if score_row:
        return jsonify({"score": score_row["user_score"]})
    else:
        return jsonify({"score": 0})

@app.route("/api/v1/test_automat", methods=["POST"])
@login_required
def test_automat():
    data = request.get_json()
    level_id = data.get("level_id", None)
    if not level_id:
        return jsonify({"error": "Missing level_id"}), 400

    level_data = database.get_level_details(level_id)
    
    states = data.get("states")
    transitions_data = data.get("transitions", [])
    start_state = data.get("start_state")
    accept_states = data.get("accept_states")
    setup = level_data.get("setup")
    automat_type = setup.get("type", "NFA").upper()


    if not states:
        return jsonify({"error": "Missing states data"}), 400
    if not start_state:
        return jsonify({"error": "Missing start state"}), 400
    if not accept_states:
        return jsonify({"error": "Missing accept states"}), 400
    if not setup:
        return jsonify({"error": "Missing setup data"}), 400
    try:
        if automat_type == "DFA":
            automat = AutomatDFA(states, transitions_data, start_state, accept_states, setup)
        elif automat_type == "NFA":
            automat = AutomatNFA(states, transitions_data, start_state, accept_states, setup)
        else:
            return jsonify({"error": f"Unsupported automat type: {automat_type}"}), 400

        validator = BaseValidator(automat, setup)

        result = validator.run()
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    if result.get("accepted"):
        score = 5 
        if not database.get_achieved_level(current_user.id, level_id):
            database.increment_user_score(user_id=current_user.id, value=score)
        database.save_achieved_level(
            user_id=current_user.id,
            level_id=level_id,
            score=score,
            level_setup={
                "states": states, 
                "transitions": transitions_data
            }
        )

    return jsonify(result)

@app.route("/api/v1/achieved_level", methods=["GET"])
@login_required
def get_achieved_level():
    level_id = request.args.get("level_id")
    user_id = current_user.id

    result = database.get_achieved_level(user_id, level_id)
    if result is None:
        return jsonify({"exists": False})

    print(result["level_setup"])
    return jsonify({
        "exists": True,
        "states": result["level_setup"]["states"],
        "transitions": result["level_setup"]["transitions"],
        "score": result["score"]
    })

@app.route("/api/v1/get_user_levels", methods=["GET"])
def get_user_levels():
    user_id = current_user.id
    levels = database.get_user_levels(user_id)

    if levels is None:
        return jsonify({"error": "Database error"}), 500

    return jsonify(levels)



@app.route("/api/v1/save_level", methods=["POST"])
@login_required
def save_level():
    data = request.get_json()
    extracted_data = extract_level_data(data)
    if "error" in extracted_data:
        return jsonify({"error": extracted_data["error"]}), 400

    level_id = database.create_user_level(owner_id=current_user.id, extracted_data=extracted_data)

    return jsonify({"message": "Level created successfully!", "level_id": level_id}), 200


@app.route("/api/v1/update_level", methods=["POST"])
@login_required
def update_level():
    level_id = request.args.get("level_id")
    data = request.get_json()
    extracted_data = extract_level_data(data)
    if "error" in extracted_data:
        return jsonify({"error": extracted_data["error"]}), 400
    print(extracted_data)

    success = database.update_user_level(
        level_id=level_id,
        owner_id=current_user.id,
        extracted_data=extracted_data,
    )

    if not success:
        return jsonify({"error": "Level not found or you do not have permission."}), 404

    return jsonify({"message": "Level updated successfully!"}), 200

@app.route("/api/v1/delete_level", methods=["DELETE"])
@login_required
def delete_level():
    level_id = request.args.get("level_id")

    if not level_id:
        return jsonify({"error": "Missing level_id"}), 400

    success = database.delete_user_level(level_id=level_id, user_id=current_user.id)

    if success:
        return jsonify({"message": "Level deleted successfully."}), 200
    else:
        return jsonify({"error": "Level not found or permission denied."}), 404


# {'states': ['Start', 'Accept', 'q3', 'q4', 'q5', 'q7', 'q8'], 
#  'start_state': 'Start', 
#  'accept_states': ['Accept'], 
#  'transitions': [{'from': 'Start', 'to': 'q7', 'value': '10'}, {'from': 'q7', 'to': 'q4', 'value': '20'}], 
#  'level_id': 'cdb22555-7268-4911-9ef6-6a11fbb7bd9d'}

# {'id': 'cdb22555-7268-4911-9ef6-6a11fbb7bd9d', 
#  'created_at': datetime.datetime(2025, 4, 1, 16, 1, 41, 812280), 
#  'owner_id': None, 
#  'level_number': 0, 
#  'task': 'I would like to buy some water for **10 cents**. I have them, but the automat seems to be not working. Would you be able to repair it?', 
#  'category_id': '432407a0-1760-4f7e-940f-49f60ddb7fbd', 
#  'public': False, 
#  'level_name': None,
#   'setup': {
        # "alphabet": [0.1],
        # "accepted_values": [0.1],
        # "accept_all_values": true,
        # "alphabet_count": {},
        # "forbidden_values": [],
        # "sequences": [],
        # "accept_all_sequences": false,
        # "max_input_length": ,
        # "type": "NFA"
        # },
#  'person_image': 'person1.png',
#  'automat_image': 'automat1.png',
# }
