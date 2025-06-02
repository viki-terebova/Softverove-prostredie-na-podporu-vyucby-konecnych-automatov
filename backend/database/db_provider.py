import psycopg2
from config.settings import settings 
import json
from app.additional_functions import rows_to_json_list
from werkzeug.security import check_password_hash, generate_password_hash
from authentication.models import User 
from database.exceptions import UserAlreadyExists, RegistrationFailed

class DBProvider:
    def __init__(self):
        self.db_type = settings.get_conf("database.type", "postgresql")
        self.host = settings.get_conf("database.host", "localhost")
        self.port = settings.get_conf("database.port", 5432)
        self.user = settings.get_conf("database.user", "postgres")
        self.password = settings.get_conf("database.password")
        self.db_name = settings.get_conf("database.db_name", "finiautoma_dev")
        self.connection = self.connect()
        if self.connection is None:
            raise ValueError("❌ Failed to connect to the database!")

        if not self.password:
            raise ValueError("❌ Could not authentificate to the database")

    def connect(self):
        try:
            conn = psycopg2.connect(
                dbname=self.db_name,
                user=self.user,
                password=self.password,
                host=self.host,
                port=self.port
            )
            return conn
        except Exception as e:
            raise ValueError(f"❌ Database connection error: {e}")

    def get_user_by_id(self, user_id):
        try:
            with self.connection.cursor() as cursor:
                cursor.execute(
                    """SELECT * FROM data.users WHERE id = %s;""", 
                    (user_id, ))
                row = cursor.fetchone()
                colnames = [desc[0] for desc in cursor.description]
            return rows_to_json_list([row], colnames)[0] if row else None
        except Exception as e:
            self.connection.rollback()
            raise ValueError(f"❌ SQL error in get_user_by_id: {e}")

    def authenticate_user(self, username_or_mail, password):
        try:
            with self.connection.cursor() as cursor:
                cursor.execute("""
                    SELECT id, username, mail, user_password, user_role FROM data.users
                    WHERE username = %s OR mail = %s;
                """, (username_or_mail, username_or_mail))
                result = cursor.fetchone()
                if result:
                    user_id, username, mail, hashed_pw, user_role = result
                    if check_password_hash(hashed_pw, password):
                        return User(id=user_id, username=username, mail=mail, password_hash=hashed_pw, user_role=user_role)
                    else:
                        return "wrong_password"
                else:
                    return "user_not_found"

        except Exception as e:
            self.connection.rollback()
            raise ValueError(f"❌ SQL error in authenticate_user: {e}")
        
    def register_user(self, username, mail, password):
        try:
            hashed_pw = generate_password_hash(password)
            with self.connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO data.users (username, mail, user_password)
                    VALUES (%s, %s, %s)
                    RETURNING id;
                """, (username, mail, hashed_pw))
                user_id = cursor.fetchone()[0]
            self.connection.commit()
            return user_id

        except psycopg2.IntegrityError:
            self.connection.rollback()
            raise UserAlreadyExists("Username or mail already exists.")
        
        except Exception as e:
            self.connection.rollback()
            raise RegistrationFailed(f"General registration error: {str(e)}")
        
    def update_username(self, user_id, new_username):
        try:
            with self.connection.cursor() as cursor:
                cursor.execute("""
                    UPDATE data.users SET username = %s WHERE id = %s;
                """, (new_username, user_id))
            self.connection.commit()
            return True
        except psycopg2.errors.UniqueViolation:
            self.connection.rollback()
            return {"error": "The username already exists."}
        except Exception as e:
            self.connection.rollback()
            raise ValueError(f"❌ SQL error in update_username: {e}")
        
    def update_password(self, user_id, new_password):
        try:
            hashed_pw = generate_password_hash(new_password)
            with self.connection.cursor() as cursor:
                cursor.execute("""
                    UPDATE data.users SET user_password = %s WHERE id = %s;
                """, (hashed_pw, user_id))
            self.connection.commit()
            return True
        except Exception as e:
            self.connection.rollback()
            raise ValueError(f"❌ SQL error in update_password: {e}")
        
    def verify_password(self, user_id, password):
        try:
            with self.connection.cursor() as cursor:
                cursor.execute("""
                    SELECT user_password FROM data.users WHERE id = %s;
                """, (user_id,))
                hashed_pw = cursor.fetchone()[0]
            return check_password_hash(hashed_pw, password)
        except Exception as e:
            self.connection.rollback()
            raise ValueError(f"❌ SQL error in verify_password: {e}")

    def get_categories(self):
        try:
            with self.connection.cursor() as cursor:
                cursor.execute(
                        """SELECT * FROM data.categories ORDER BY category_order;""")
                rows = cursor.fetchall()
                colnames = [desc[0] for desc in cursor.description]
            return rows_to_json_list(rows, colnames)
        except Exception as e:
            self.connection.rollback()
            raise ValueError(f"❌ SQL error in get_categories: {e}")
        
    def get_category_by_id(self, category_id):
        try:
            with self.connection.cursor() as cursor:
                cursor.execute("""SELECT * FROM data.categories WHERE id = %s;""", (category_id,))
                row = cursor.fetchone()
                colnames = [desc[0] for desc in cursor.description]
            return rows_to_json_list([row], colnames)[0] if row else None
        except Exception as e:
            self.connection.rollback()
            raise ValueError(f"❌ SQL error in get_category_by_id: {e}")

    def get_levels_for_category(self, category_uuid=None, user_id=None):
        try:
            with self.connection.cursor() as cursor:
                if category_uuid is None:
                    return {}
                if user_id is None:
                    cursor.execute(
                        """SELECT * FROM data.levels WHERE owner_id IS NULL AND category_id = %s ORDER BY level_number;""", 
                        (category_uuid,))
                else:
                    cursor.execute(
                        """SELECT * FROM data.levels WHERE owner_id = %s AND category_id = %s ORDER BY level_number;""", 
                        (user_id, category_uuid,))
                rows = cursor.fetchall()
                colnames = [desc[0] for desc in cursor.description]
            return rows_to_json_list(rows, colnames)
        except Exception as e:
            self.connection.rollback()
            raise ValueError(f"❌ SQL error in get_levels_for_categories: {e}")

    def get_level_details(self, level_id):
        try:
            with self.connection.cursor() as cursor:
                cursor.execute(
                    """SELECT * FROM data.levels WHERE id = %s;""", 
                    (level_id, ))
                row = cursor.fetchone()
                colnames = [desc[0] for desc in cursor.description]
            return  rows_to_json_list([row], colnames)[0] if row else None
        except Exception as e:
            self.connection.rollback()
            raise ValueError(f"❌ SQL error in get_level_details: {e}")

    def get_public_levels(self):
        try:
            with self.connection.cursor() as cursor:
                cursor.execute(
                    """SELECT du.username, dl.id as level_id, dl.level_name as level_name, dl.created_at 
                        FROM (data.levels dl LEFT JOIN data.users du 
                        ON dl.owner_id = du.id)
                        WHERE dl.public = true AND dl.owner_id IS NOT Null;""")
                row = cursor.fetchall()
                colnames = [desc[0] for desc in cursor.description]
            return rows_to_json_list(row, colnames)
        except Exception as e:
            self.connection.rollback()
            raise ValueError(f"❌ SQL error in get_public_levels: {e}")
        
    def save_achieved_level(self, user_id, level_id, score, level_setup):
        try:
            with self.connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO data.achieved_levels (user_id, level_id, score, level_setup)
                    VALUES (%s, %s, %s, %s)
                    ON CONFLICT (user_id, level_id)
                    DO UPDATE SET
                        score = EXCLUDED.score,
                        level_setup = EXCLUDED.level_setup;
                """, (user_id, level_id, score, json.dumps(level_setup)))
            self.connection.commit()
            return True
        except Exception as e:
            self.connection.rollback()
            raise ValueError(f"❌ SQL error in save_achieved_level: {e}")

        
    def get_achieved_level(self, user_id, level_id):
        try:
            with self.connection.cursor() as cursor:
                cursor.execute("""
                    SELECT * FROM data.achieved_levels WHERE user_id = %s AND level_id = %s;
                """, (user_id, level_id))
                row = cursor.fetchone()
                colnames = [desc[0] for desc in cursor.description]
            return rows_to_json_list([row], colnames)[0] if row else None
        except Exception as e:
            self.connection.rollback()
            raise ValueError(f"❌ SQL error in get_achieved_level: {e}")
        

    def get_achieved_levels_for_user_by_category(self, user_id, category_id):
        try:
            with self.connection.cursor() as cursor:
                cursor.execute("""
                    SELECT level_id
                    FROM data.achieved_levels
                    JOIN data.levels ON achieved_levels.level_id = levels.id
                    WHERE achieved_levels.user_id = %s AND levels.category_id = %s;
                """, (user_id, category_id))
                rows = cursor.fetchall()
                colnames = [desc[0] for desc in cursor.description]
            return rows_to_json_list(rows, colnames)
        except Exception as e:
            self.connection.rollback()
            raise ValueError(f"❌ SQL error in get_achieved_levels_for_user: {e}")
        
    def create_user_score(self, user_id, starting_score=0):
        try:
            with self.connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO data.score (user_id, user_score)
                    VALUES (%s, %s)
                    ON CONFLICT (user_id) DO NOTHING;
                """, (user_id, starting_score))
            self.connection.commit()
            return True
        except Exception as e:
            self.connection.rollback()
            raise ValueError(f"❌ SQL error in create_user_score: {e}")
        
    def get_user_score(self, user_id):
        try:
            with self.connection.cursor() as cursor:
                cursor.execute("""
                    SELECT user_score FROM data.score WHERE user_id = %s;
                """, (user_id,))
                row = cursor.fetchone()
                colnames = [desc[0] for desc in cursor.description]
            return rows_to_json_list([row], colnames)[0] if row else None
        except Exception as e:
            self.connection.rollback()
            raise ValueError(f"❌ SQL error in get_user_score: {e}")
        
    def increment_user_score(self, user_id, value):
        try:
            with self.connection.cursor() as cursor:
                cursor.execute("""
                    UPDATE data.score SET user_score = user_score + %s WHERE user_id = %s;
                """, (value, user_id))
            self.connection.commit()
            return True
        except Exception as e:
            self.connection.rollback()
            raise ValueError(f"❌ SQL error in increment_user_score: {e}")

    def get_user_levels(self, user_id):
        try:
            with self.connection.cursor() as cursor:
                cursor.execute("""
                    SELECT * FROM data.levels WHERE owner_id = %s;
                """, (user_id,))
                rows = cursor.fetchall()
                colnames = [desc[0] for desc in cursor.description]
            return rows_to_json_list(rows, colnames)
        except Exception as e:
            self.connection.rollback()
            raise ValueError(f"❌ SQL error in get_user_levels: {e}")

    def create_user_level(self, owner_id, extracted_data):
        try:
            with self.connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO data.levels (id, owner_id, level_number, level_name, task, public, setup)
                    SELECT
                        gen_random_uuid(), %s,
                        COALESCE(MAX(level_number), -1) + 1,
                        %s, %s, %s, %s
                    FROM data.levels
                    WHERE owner_id = %s
                    RETURNING id;
                """, 
                (owner_id, 
                extracted_data.get("level_name"), 
                extracted_data.get("task"), 
                extracted_data.get("public"), 
                json.dumps(extracted_data.get("setup")),
                owner_id))

                level_id = cursor.fetchone()[0]  

            self.connection.commit()
            return level_id
        except Exception as e:
            self.connection.rollback()
            raise ValueError(f"❌ SQL error in create_user_level: {e}")
        
    def update_user_level(self, level_id, owner_id, extracted_data):
        try:
            with self.connection.cursor() as cursor:
                cursor.execute("""
                    UPDATE data.levels SET
                        level_name = %s,
                        task = %s,
                        public = %s,
                        setup = %s,
                        person_image = %s,
                        automat_image = %s,
                        owner_id = %s
                    WHERE id = %s;
                """, (
                    extracted_data.get("level_name"),
                    extracted_data.get("task"),
                    extracted_data.get("public"),
                    json.dumps(extracted_data.get("setup")),
                    extracted_data.get("person_image", "person1.png"),
                    extracted_data.get("automat_image", "automat1.png"),
                    owner_id,
                    level_id
                ))
            self.connection.commit()
            return True
        except Exception as e:
            self.connection.rollback()
            raise ValueError(f"❌ SQL error in update_user_level: {e}")
        
    def delete_user_level(self, level_id, user_id):
        try:
            with self.connection.cursor() as cursor:
                cursor.execute("""
                    DELETE FROM data.levels
                    WHERE id = %s AND owner_id = %s
                """, (level_id, user_id))
            self.connection.commit()
            return cursor.rowcount > 0
        except Exception as e:
            self.connection.rollback()
            raise ValueError(f"❌ SQL error in delete_user_level: {e}")