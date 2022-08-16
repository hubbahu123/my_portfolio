from flask import render_template, redirect, url_for, request
from api import app, OS_VERSION
from api.windows import *


@app.route("/")
def index():
    return render_template("index.html", version=OS_VERSION)


# Example url: http://redaOS.com/windows?p=-10,1,70,79&w=75,20,20,100&u=5,5,50,50,custom_title,custom_text
@app.route("/windows")
def add_windows():
    # Searches for one of each type of built-in windows (Portfolio.pdf, MyWorks, etc.) and adds it to list
    windows = {type.value: window for type in WindowType if type != WindowType.CUSTOM and (
        window := request.args.get(type.value, type=Window)) is not None}
    custom_windows = request.args.getlist("u", type=CustomWindow)
    return render_template("index.html", version=OS_VERSION, windows=windows, custom_windows=custom_windows)


@app.errorhandler(404)
def error_404():
    return redirect(url_for("index"), 301)


@app.errorhandler(500)
def error_500():
    return render_template("500.html", version=OS_VERSION, title="Error 505"), 500
