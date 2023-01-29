import json
from flask import Flask, request, jsonify
from flask_cors import CORS

from flask_jwt_extended import JWTManager, create_access_token

api = Flask(__name__)
api.config.from_object('config.DevelopmentConfig')
jwt = JWTManager(api)
CORS(api)

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

    #reject if username or password is wrong
    if username != 'test' or password != 'test':
        return jsonify({"msg": "Bad username or password"}), 401

    #create token
    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token), 200

#run server
if __name__ == '__main__':
    api.run()