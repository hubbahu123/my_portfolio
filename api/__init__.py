from flask import Flask

app = Flask(__name__)
app.config["SECRET_KEY"] = "01e172be9750bad2ea28908d50d8a337"

from api import routes