class BaseConfig(object):
    DEBUG = True
    TESTING = False
    SECRET_KEY = 'fartyPants'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///database.db'

class DevelopmentConfig(BaseConfig):
    DEBUG = True
    TESTING = True
