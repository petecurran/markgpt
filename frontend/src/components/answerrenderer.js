const AnswerRenderer = (props) => {

    // Split the question into an array of strings
    const answerArray = props.givenAnswer.split('\n');
    
    return (
        <div className="answer-display">
            {answerArray.map((answer, index) => {
                if (answer === ""){
                    return <br key={index}/>
                } else {
                return <p key={index}>{answer}</p>
                }
            })}
        </div>
    )
}

export default AnswerRenderer