import os
from flask import Flask

OS_VERSION = "1.0.0"
app = Flask(__name__)
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")

from api import routes