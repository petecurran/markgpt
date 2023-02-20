import React, { useState, useEffect } from 'react';
import QuestionPicker from '../components/questionpicker';
import QuestionRenderer from '../components/questionrenderer';
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


        return(
            <div className="container answer-page">
                {questions && questions.length > 0 ? 
                <div>
                    <button onClick={props.handleLogout}>Logout</button>
                    <QuestionPicker questions={questions} questionIndex={questionIndex} incrementQuestion={incrementQuestion} decrementQuestion={decrementQuestion} selectQuestion={selectQuestion}/>                
                    <h1>Question 1</h1>
                    <QuestionRenderer givenQuestion={question}/>
                    <form>
                    <textarea className="form-control" id="answer" rows="3" placeholder="Enter your answer"  onChange={(e)=> setCurrentAnswer(e.target.value)}></textarea>
                    <button type="submit" className="btn btn-primary mt-3 w-100 answer-button" onClick={props.handleAnswer}>Mark it!</button>
                    </form>
                </div> : 
                <div></div>}
            </div>
        )
    }


export default Answer