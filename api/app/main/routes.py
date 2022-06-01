from flask_login import login_required

from app import create_app
from flask import request, jsonify
from app.main import bp


app = create_app()


# @bp.route('/index')
# @bp.route('/')
# # @login_required
# def index():
# 	return app.send_static_file('index.html')



















