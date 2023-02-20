from datetime import timedelta

class BaseConfig(object):
    DEBUG = True
    TESTING = False
    SECRET_KEY = 'fartyPants'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///database.db'
    OPEN_AI_KEY = "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"
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=30)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    

class DevelopmentConfig(BaseConfig):
    DEBUG = True
    TESTING = True
