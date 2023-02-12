const QuestionPicker = ({questions, questionIndex, incrementQuestion, decrementQuestion, selectQuestion}) => {
   
    // The button for each question returns undefined if you click on the icon, as it intercepts the signal.
    // This is fixed in the selectQuestion function in answer.js by using e.currentTarget.value instead of e.target.value


    return (
        <div className="questions-array">
            <button className="question-change-button" onClick={decrementQuestion}><i className="bi bi-caret-left-fill"></i></button>
            {questions.map((question, index) => {
                if (index === questionIndex){
                    return <button className="question-selector-button" key={index} value={index} onClick={selectQuestion}><i className="bi bi-circle-fill selected-true"></i></button>
                } else {
                    return <button className="question-selector-button" key={index} value={index} onClick={selectQuestion}><i className="bi bi-circle-fill selected-false"></i></button>
                }
            })
            }

        <button className="question-change-button" onClick={incrementQuestion}><i className="bi bi-caret-right-fill"></i></button>
            
        </div>
    )
}

export default QuestionPicker