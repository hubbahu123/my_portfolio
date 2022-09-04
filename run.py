import os
from api import app

if __name__ == "__main__":
    app.run(debug=(os.environ.get("environment") != "PROD"))
