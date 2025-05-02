from flask_login import UserMixin

class User(UserMixin):
    def __init__(self, id, username, mail, password_hash):
        self.id = id
        self.username = username
        self.mail = mail
        self.password_hash = password_hash
