import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, ".env"))

class Config(object):
	database_uri =  os.environ.get("DATABASE_URL")
	SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
	SQLALCHEMY_DATABASE_URI = database_uri or \
		'sqlite:///' + os.path.join(basedir, 'app.db')
	SQLALCHEMY_TRACK_MODIFICATIONS = False