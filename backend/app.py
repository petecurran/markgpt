import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from bcrypt import hashpw, gensalt, checkpw

api = Flask(__name__)
api.config.from_object('config.DevelopmentConfig')
jwt = JWTManager(api)
CORS(api)
db = SQLAlchemy(api)

# Create a user model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), unique=True, nullable=False)
    password = db.Column(db.String(30), nullable=False)

    def __repr__(self):
        return '<User %r>' % self.username

# Create database
#with api.app_context():
#    db.create_all()

# Create a user to test with
#with api.app_context():
#    new_user = User(username='test', password='test')
#    db.session.add(new_user)
#    db.session.commit()

#Issue token for login
@api.route('/token', methods=['POST'])
def create_token():
    #reject if not json
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    #take username and password from json
    username = request.json.get('username', None)
    password = request.json.get('password', None)

    #reject if missing username or password
    if not username:
        return jsonify({"msg": "Missing username parameter"}), 400
    if not password:
        return jsonify({"msg": "Missing password parameter"}), 400

    #search for user in database
    with api.app_context():
        user = User.query.filter_by(username=username).first()

        #reject if user not found
        if user is None:
            return jsonify({"msg": "Bad username or password"}), 401

        #reject if password is wrong
        if checkpw(password.encode('utf-8'), user.password.encode('utf-8')) == False:
            return jsonify({"msg": "Bad username or password"}), 401    

    #create token
    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token), 200

# Route to sign up
@api.route('/signup', methods=['POST'])
def signup():
    #reject if not json
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    #take username and password from json
    username = request.json.get('username', None)
    password = request.json.get('password', None)

    #reject if missing username or password
    if not username:
        return jsonify({"msg": "Missing username parameter"}), 400
    if not password:
        return jsonify({"msg": "Missing password parameter"}), 400

    #search for user in database
    with api.app_context():
        user = User.query.filter_by(username=username).first()

        #reject if user already exists
        if user is not None:
            return jsonify({"msg": "User already exists"}), 401

        #hash password
        password = hashpw(password.encode('utf-8'), gensalt()).decode('utf-8')

        #create new user
        new_user = User(username=username, password=password)
        db.session.add(new_user)
        db.session.commit()

    #create token
    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token), 200

# Authenticated route to use api
@api.route('/answer', methods=['GET'])
@jwt_required()
def answer():
    return jsonify({"answer": 42}), 200

#run server
if __name__ == '__main__':
    api.run()