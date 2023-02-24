import React, { useState, useEffect } from 'react';
import QuestionPicker from '../components/questionpicker';
import QuestionRenderer from '../components/questionrenderer';
import AnswerRenderer from '../components/answerrenderer';
import axios from 'axios';


const Answer = (props) => {
    
    const [questions, setQuestions] = useState([]);
    const [question, setQuestion] = useState('');
    const [questionIndex, setQuestionIndex] = useState(0);
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [showResponsePage, setShowResponsePage] = useState(false);

    // Handle the arrow selector for questions
    const incrementQuestion = () => {
        if (questionIndex < questions.length - 1){
            setQuestionIndex(questionIndex + 1);
            setQuestion(questions[questionIndex + 1]);
        }
    }

    // Handle the arrow selector for questions
    const decrementQuestion = () => {
        if (questionIndex > 0){
            setQuestionIndex(questionIndex - 1);
            setQuestion(questions[questionIndex - 1]);
        }
    }

    // Select question from button press on menu
    const selectQuestion = (e) => {
        //set the question index as int of value
        setQuestionIndex(parseInt(e.currentTarget.value));
        //set the question as the question at the index
        setQuestion(questions[parseInt(e.currentTarget.value)]);
    }

    //load the questions when the page loads
    useEffect(() => {
        axios.get('http://127.0.0.1:5000/getquestions', {
            headers: {
                'Authorization': 'Bearer ' + props.authToken
        }})
        .then(res => {
            setQuestions(res.data);
            setQuestion(res.data[0]);
        })
        .catch (error => {
            console.log(error.response.data.msg);
        })
    }, [])

    //Handle the answer submission
    const passToHandleAnswer = (event) => {
        // Prevent the page from refreshing
        event.preventDefault();
        // Pass the answer to the parent component
        props.handleAnswer(question, currentAnswer)
    }

    // Reformat the page once the question is submitted
    useEffect(() => {
        if (props.questionSubmitted){
            // Set the flag to show we're showing responses
            setShowResponsePage(true);
        } else {
            // Set the flag to show we're taking inputs
            setShowResponsePage(false);
        }
    }, [props.questionSubmitted])


        return(
            <div className="container answer-page">
                
                <nav className="navbar navbar-dark">
                    <div className="container-fluid">
                        <button className="navbar-toggler bg-primary" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="#">Home</a>
                            </li>
                            <li className="nav-item">
                            <a className="nav-link" href="#">Link</a>
                            </li>
                            <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Dropdown
                            </a>
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item" href="#">Action</a></li>
                                <li><a className="dropdown-item" href="#">Another action</a></li>
                                <li><a className="dropdown-item" href="#">Something else here</a></li>
                            </ul>
                            </li>
                            <li className="nav-item">
                            <a className="nav-link disabled">Disabled</a>
                            </li>
                        </ul>
                        </div>
                    </div>
                </nav>


                {questions && questions.length > 0 ? 
                <div>
                    <button onClick={props.handleLogout} className="btn btn-primary">Logout</button>
                    {!showResponsePage ?
                    <QuestionPicker questions={questions} questionIndex={questionIndex} incrementQuestion={incrementQuestion} decrementQuestion={decrementQuestion} selectQuestion={selectQuestion}/>                
                    : <div></div>}
                    
                    <div className="question-box">
                        <h4>Question {questionIndex + 1}</h4>
                        <QuestionRenderer givenQuestion={question}/>
                    </div>
                    {showResponsePage ?
                        <div>
                            <div className="submitted-answer">
                                <h4>Your answer:</h4>
                                <AnswerRenderer givenAnswer={currentAnswer}/>
                            </div>
                            <div className="feedback-box">
                                <h4>Feedback</h4>
                                {props.response}
                            </div>
                            <button onClick={props.clearAnswer}>Try again</button>
                        </div>
                    :
                        <div>
                            <form>
                            <textarea className="form-control" id="answer" rows="3" placeholder="Enter your answer"  onChange={(e)=> setCurrentAnswer(e.target.value)}></textarea>
                            <button type="submit" className="btn btn-primary mt-3 w-100 answer-button" onClick={passToHandleAnswer}>Mark it!</button>
                            </form>

                        </div>
                    }
                </div> : 
                <div></div>}
            </div>
        )
    }


export default Answer