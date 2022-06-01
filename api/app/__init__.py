from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
# from flask_login import LoginManager


db = SQLAlchemy()
migrate = Migrate()
# login = LoginManager()
# login.login_view = "auth.login" #requires a login, use @login_required route decorator

# create_app function is the application factory
# the argument passed to create_app is the name of a configuration to use for the application
def create_app(config_class=Config):
	app = Flask(__name__, static_folder="../../build", static_url_path="/")

	# configuration settings are stored in the class defined in the config.py file
	# config class can then be imported into the application with from_object method
	app.config.from_object(config_class)

	# once the app is created & configured, extensions can be initialized by calling init_app
	db.init_app(app)
	migrate.init_app(app, db)
	# login.init_app(app)


	from app.errors import bp as errors_bp

	app.register_blueprint(errors_bp)


	from app.main import bp as main_bp

	app.register_blueprint(main_bp)


	from app.api import bp as api_bp

	app.register_blueprint(api_bp, url_prefix='/api')

	# factory function returns the application instance
	return app


from app import models
