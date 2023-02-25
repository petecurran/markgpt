import React, { useState, useEffect } from 'react';
import QuestionPicker from '../components/questionpicker';
import QuestionRenderer from '../components/questionrenderer';
import AnswerRenderer from '../components/answerrenderer';
import axios from 'axios';
import { Popover, ArrowContainer } from 'react-tiny-popover'


const Answer = (props) => {
    
    const [questions, setQuestions] = useState([]);
    const [question, setQuestion] = useState('');
    const [questionIndex, setQuestionIndex] = useState(0);
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [showResponsePage, setShowResponsePage] = useState(false);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

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

    // Handle the logout button
    const handleLogoutClick = () => {
        // Call the parent component's logout function
        props.handleLogout();
        setIsPopoverOpen(false);
    }


        return(
            <div className="container answer-page">
                
                {/* Username & logout popover. Uses library imported above.
                    The popover itself is impervious to CSS, so has to use inline styles.
                    The arrow container adds the arrow. */}
                <div className="username-popover">
                    <Popover
                        isOpen={isPopoverOpen}
                        positions={['bottom']}
                        onClickOutside={() => setIsPopoverOpen(false)}
                        content={({ position, childRect, popoverRect }) => (
                        <ArrowContainer 
                            position={position}
                            childRect={childRect}
                            popoverRect={popoverRect}
                            arrowColor={'white'}
                            arrowSize={10}
                            arrowStyle={{opacity: 1}}
                            className="popover-arrow-container"
                            arrowClassName="popover-arrow"
                        >
                        <div style={{backgroundColor:"white", padding:"10px", borderRadius:"3px"}}>
                            <button 
                                style={{backgroundColor:"transparent", color:"black", textDecoration:"underline", border:"none"}}
                                onClick={() => handleLogoutClick()}
                            >
                                Log out
                            </button>
                        </div>
                        </ArrowContainer>
                        )}
                        >
                        <button className={"btn btn-primary"}onClick={() => setIsPopoverOpen(!isPopoverOpen)}>
                            {props.username}
                        </button>
                    </Popover>
                </div>



                {questions && questions.length > 0 ? 
                <div>
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