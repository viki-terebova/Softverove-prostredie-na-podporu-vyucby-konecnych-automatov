import psycopg2
from config.settings import settings 
import logging
import json
from app.additional_functions import to_json

class DBProvider:
    def __init__(self):
        self.db_type = settings.get_conf("database.type", "postgresql")
        self.host = settings.get_conf("database.host", "localhost")
        self.port = settings.get_conf("database.port", 5432)
        self.user = settings.get_conf("database.user", "postgres")
        self.password = settings.get_conf("database.password")
        self.db_name = settings.get_conf("database.db_name", "finiautoma_dev")
        self.connection = self.connect()

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

    def get_categories_for_user(self, user_id=None):
        if self.connection is None:
            raise ValueError("❌ Failed to connect to the database!")

        result = None
        try:
            with self.connection.cursor() as cursor:
                if user_id is None:
                    cursor.execute(
                        """SELECT * FROM data.categories WHERE owner_id IS NULL;""")
                    result = cursor.fetchall()
                else:
                    cursor.execute(
                        """SELECT * FROM data.categories WHERE owner_id = %s;""", 
                        (user_id,))
                    result = cursor.fetchall()
            return json.dumps(result, default=to_json)
        except Exception as e:
            self.connection.rollback()
            raise ValueError(f"❌ SQL error in get_categories_for_user: {e}")

    def get_levels_for_category(self):
        # TODO: Implement this method
        return None

    def get_levels_for_user(self):
        # TODO: Implement this method
        return None