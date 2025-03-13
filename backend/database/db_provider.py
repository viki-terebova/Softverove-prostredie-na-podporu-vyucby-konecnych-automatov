import psycopg2
from config.settings import settings 

class DBProvider:
    def __init__(self):
        self.db_type = settings.get_conf("database.type", "postgresql")
        self.host = settings.get_conf("database.host", "localhost")
        self.port = settings.get_conf("database.port", 5432)
        self.user = settings.get_conf("database.user", "fini_user")
        self.password = settings.get_conf("database.password")
        self.db_name = settings.get_conf("database.db_name", "postgres")

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
            print(f"❌ Database connection error: {e}")
            return None
    
    def execute_query(self, query):
        conn = self.connect()
        if conn is None:
            return None

        result = None
        # TODO: Implement the query execution logic
        return result
