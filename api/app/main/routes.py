from app import create_app
from flask import request, jsonify
from app.main import bp


app = create_app()


@bp.route('/')
def index():
	return app.send_static_file('index.html')



















