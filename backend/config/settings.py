import os
import yaml
from dotenv import load_dotenv

class Settings:
    def __init__(self):
        load_dotenv()
        self.config = self.load_config()

    def load_config(self):
        config_path = os.path.join(os.path.dirname(__file__), "../../config.yml")
        if os.path.exists(config_path):
            with open(config_path, "r") as config_file:
                return yaml.safe_load(config_file)
        else:
            raise FileNotFoundError("❌ config.yml not found!")

    def get_conf(self, key_path, default=None):
        keys = key_path.split(".")
        value = self.config

        for key in keys:
            value = value.get(key, None) if isinstance(value, dict) else None

        if isinstance(value, str) and value.startswith("${") and value.endswith("}"):
            env_value = value.strip("${}")
            return os.getenv(env_value, default)

        return value if value is not None else default

settings = Settings()