import React, { useState, useEffect } from 'react';
import QuestionPicker from '../components/questionpicker';
import axios from 'axios';


const Answer = (props) => {
    
    const [questions, setQuestions] = useState([]);
    const [question, setQuestion] = useState('');
    const [questionIndex, setQuestionIndex] = useState(0);
    const [currentAnswer, setCurrentAnswer] = useState('');

    // Handle the arrow selector for questions
    const incrementQuestion = () => {
        if (questionIndex < questions.length - 1){
            setQuestionIndex(questionIndex + 1);
            setQuestion(questions[questionIndex + 1]);
        }
    }

    const decrementQuestion = () => {
        if (questionIndex > 0){
            setQuestionIndex(questionIndex - 1);
            setQuestion(questions[questionIndex - 1]);
        }
    }

    const selectQuestion = (e) => {
        console.log(e.target.value)
        //set the question index as int of value
        setQuestionIndex(parseInt(e.target.value));
        //set the question as the question at the index
        setQuestion(questions[parseInt(e.target.value)]);
    }

    //load the questions
    useEffect(() => {
        axios.get('http://127.0.0.1:5000/getquestions', {
            headers: {
                'Authorization': 'Bearer ' + props.authToken
        }})
        .then(res => {
            setQuestions(res.data);
            setQuestion(res.data[0]);
            console.log(res.data)
        })
    }, [props.authToken])


        return(
            <div className="container answer-page">
                <button onClick={props.handleLogout}>Logout</button>
                <QuestionPicker questions={questions} questionIndex={questionIndex} incrementQuestion={incrementQuestion} decrementQuestion={decrementQuestion} selectQuestion={selectQuestion}/>                
                <h1>Question 1</h1>
                <p>{question.question}</p>
                <form>
                <textarea className="form-control" id="answer" rows="3" placeholder="Enter your answer"  onChange={(e)=> setCurrentAnswer(e.target.value)}></textarea>
                <button type="submit" className="btn btn-primary mt-3 w-100 answer-button" onClick={props.handleAnswer}>Mark it!</button>
                </form>
            </div>
        )
    }

export default Answer