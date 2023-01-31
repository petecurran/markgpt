class BaseConfig(object):
    DEBUG = True
    TESTING = False
    SECRET_KEY = 'fartyPants'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///database.db'
    OPEN_AI_KEY = "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"

class DevelopmentConfig(BaseConfig):
    DEBUG = True
    TESTING = True
