from flask import jsonify, send_from_directory
from app import app, database, login_manager  
import os
from flask import request, session
from flask_login import login_user, logout_user, login_required, current_user
from authentication.models import User
from authentication import auth
from database.exceptions import UserAlreadyExists, RegistrationFailed

from app.automat_nfa import AutomatNFA
from app.validator_nfa import ValidatorNFA

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
        return User(user.get("id"), user.get("username"), user.get("mail"), user.get("user_password"))
    return None


@app.route("/api/v1/get_categories", methods=["GET"])
@login_required
def get_categories():
    try:
        categories = database.get_categories_for_user()
        if categories is None:
            return jsonify({"error": "Database error"}), 500
        return jsonify(categories) 
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/v1/category/<category_uuid>", methods=["GET"])
@login_required
def get_category_levels(category_uuid):
    levels = database.get_levels_for_category(category_uuid=category_uuid)

    if levels is None:
        return jsonify({"error": "Database error"}), 500
    return jsonify(levels)

@app.route("/api/v1/level", methods=["GET"])
def get_level_by_uuid():
    level_id = request.args.get("level_id")

    if not level_id:
        return jsonify({"error": "Missing level_id"}), 400

    level_data = database.get_level_details(level_id)

    if level_data is None:
        return jsonify({"error": "Level not found"}), 404

    return jsonify(level_data)

@app.route("/api/v1/public_levels", methods=["GET"])
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
    old_pw = data.get("old_password")
    new_pw = data.get("new_password")

    if not database.verify_password(current_user.id, old_pw):
        return jsonify({"error": "Incorrect old password."}), 400

    database.update_password(current_user.id, new_pw)
    return jsonify({"message": "Password changed successfully."}), 200

@app.route("/api/v1/update_account", methods=["POST"])
@login_required
def update_account():
    data = request.get_json()
    username = data.get("username")
    if username:
        database.update_username(current_user.id, username)
        return jsonify({"message": "Username updated."}), 200
    return jsonify({"error": "Invalid data"}), 400

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
        # "accept_all": true,
        # "alphabet_count": {},
        # "forbidden_values": [],
        # "sequences": [],
        # "max_states": ,
        # }
# }

@app.route("/api/v1/test_automat", methods=["POST"])
@login_required
def test_automat():
    data = request.get_json()
    level_data = database.get_level_details(data.get("level_id", None))
    
    states = data.get("states")
    transitions_data = data.get("transitions")
    start_state = data.get("start_state")
    accept_states = data.get("accept_states")
    setup = level_data.get("setup")

    automat_nfa = AutomatNFA(states, transitions_data, start_state, accept_states, setup)

    validator = ValidatorNFA(automat_nfa, setup)
    result = validator.validate()
    print(result)
    return jsonify(result)




# @app.route("/api/v1/test-fa", methods=["GET"])
# def test_fa():
#     # Define a DFA that accepts strings ending in '1'
#     dfa = DFA(
#         states={'q0', 'q1'},
#         input_symbols={'0', '1'},
#         transitions={
#             'q0': {'0': 'q0', '1': 'q1'},
#             'q1': {'0': 'q0', '1': 'q1'}
#         },
#         initial_state='q0',
#         final_states={'q1'}
#     )

#     # Test a sample input
#     sample_input = "01001"
#     result = dfa.accepts_input(sample_input)

#     # Return structure + result
#     return jsonify({
#         "states": list(dfa.states),
#         "alphabet": list(dfa.input_symbols),
#         "transitions": dfa.transitions,
#         "start": dfa.initial_state,
#         "accept": list(dfa.final_states),
#         "test_string": sample_input,
#         "accepted": result
#     })


# Okay, I have a thought, I would like to do the validation in this way:
# the level will have stored, alphabet - money values,
# accepted_values = [], 
# sequences - sub-path of the automat,
# accept_all - boolean value - if the user needs to build automat for all combinations or just one is enough,
# alphabet_count = dict() - will have values count for how many of each coin the person has and can use,
# the validation process would begin with finding all of combinations for the alphabet money for the automat, if accept_all = true, 
# the user needs to build automat where all cases are accepted, if accept_all = false, he needs to build automat with at least one accepted combination, 
# if there are any sequences, the user needs to build automat whith this sequence, we need to find all combinations that are accepted which 
# is when the sum of the values is in accepted values
# can you make the structure better and then we would build the validator? would it be possible to use automata-lib for validation 
# when we would asign for each value in alphabet some character and then use them instead of the numbers in combinations in input?

