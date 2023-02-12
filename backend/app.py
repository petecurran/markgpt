import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from bcrypt import hashpw, gensalt, checkpw
from models import db, User, Question, Answer
import openai

api = Flask(__name__)
api.config.from_object('config.DevelopmentConfig')
jwt = JWTManager(api)
CORS(api)
db.init_app(api)

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

# Authenticated route to use fetch answers by user
@api.route('/getanswers', methods=['GET'])
@jwt_required()
def answer():
    #get username from token
    username = get_jwt_identity()

    #get userID from database
    with api.app_context():
        user = User.query.filter_by(username=username).first()
        userID = user.id

        #get answers from database
        answers = Answer.query.filter_by(user_id=userID).all()
        #gather answer data into list
        answerList = []
        for answer in answers:
            #get question text from id
            question = Question.query.filter_by(id=answer.question_id).first()
            answerList.append({"question": question.question, "answer": answer.answer, "feedback": answer.feedback, "date": answer.date})

    #return answer data
    return jsonify(answerList), 200

# Authenticated route to fetch a question to answer
@api.route('/getquestions', methods=['GET'])
@jwt_required()
def question():
    #get userID from database
    with api.app_context():
        #get questions from database
        questions = Question.query.all()
        #gather question data into list
        questionList = []
        #add the questions
        for question in questions:
            questionList.append({"question": question.question, "id": question.id, "marks": question.marks})      

    #return question data
    return jsonify(questionList), 200

# Authenticated route to submit an answer
@api.route('/submitanswer', methods=['POST'])
@jwt_required()
def submitanswer():
    #reject if not json
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    #get username from token
    username = get_jwt_identity()

    #get userID from database
    with api.app_context():
        user = User.query.filter_by(username=username).first()
        userID = user.id

    #take questionID and answer from json
    questionID = request.json.get('questionID', None)
    answer = request.json.get('answer', None)

    #reject if missing questionID, or answer
    if not questionID:
        return jsonify({"msg": "Missing questionID parameter"}), 400
    if not answer:
        return jsonify({"msg": "Missing answer parameter"}), 400

    #add answer to database
    with api.app_context():
        #create new answer
        new_answer = Answer(user_id=userID, question_id=questionID, answer=answer, feedback="TESTFEEDBACK")
        db.session.add(new_answer)
        db.session.commit()

    #return success
    return jsonify({"msg": "Success"}), 200

# Authenticated route to test api call
@api.route('/test', methods=['GET'])
def test():
    key = api.config['OPEN_AI_KEY']
    openai.api_key = key
    response = openai.Completion.create(
    model="text-davinci-002",
    prompt="""The following is an answer to a GCSE question. There are 4 marks available.

    The question is: What are the 4 registers in the CPU?

    The answer is: The ALU, the Control Unit, the Accumulator and the Program Counter.

    How many marks would you give this answer?

    """,

    max_tokens=2000,
    temperature=0.9
    )

    print(response)

    return jsonify(response), 200

#run server
if __name__ == '__main__':
    api.run()