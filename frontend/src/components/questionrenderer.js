const QuestionRenderer = (props) => {

    // Split the question into an array of strings
    const questionArray = props.givenQuestion.question.split('\n');
    return (
        <div style={{width: "100%", display:"inline-block", backgroundColor:"red"}}>
            {questionArray.map((question, index) => {
                return <p key={index}>{question}</p>
            })}
            <p className="text-right">[{props.givenQuestion.marks} marks]</p>
        </div>
    )
}

export default QuestionRenderer