from app import app
from config.settings import settings

if __name__ == "__main__":
    app.run(debug=settings.get_conf("app.debug", False), port=5000)
