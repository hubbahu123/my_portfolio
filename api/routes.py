from flask import render_template, url_for
from api import app

@app.route('/')
@app.route('/<name>')
def hello_world(name=None):
    return render_template("index.html", name=name)

@app.errorhandler(404)
def page_not_found(error):
    return render_template('pageNotFound.html'), 404