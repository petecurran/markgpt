class BaseConfig(object):
    DEBUG = True
    TESTING = False
    SECRET_KEY = 'fartyPants'

class DevelopmentConfig(BaseConfig):
    DEBUG = True
    TESTING = True
