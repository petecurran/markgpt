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
                {questions && questions.length > 0 ? 
                <div>
                    <button onClick={props.handleLogout}>Logout</button>
                    {!showResponsePage ?
                    <QuestionPicker questions={questions} questionIndex={questionIndex} incrementQuestion={incrementQuestion} decrementQuestion={decrementQuestion} selectQuestion={selectQuestion}/>                
                    : <div></div>}
                    
                    
                    <h1>Question 1</h1>
                    <QuestionRenderer givenQuestion={question}/>
                    {showResponsePage ?
                        <div>
                            <AnswerRenderer givenAnswer={currentAnswer}/>
                            <h4>Feedback</h4>
                            {props.response}
                            <br />
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