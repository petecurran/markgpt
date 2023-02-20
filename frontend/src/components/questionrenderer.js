const QuestionRenderer = (props) => {

    // Split the question into an array of strings
    const questionArray = props.givenQuestion.question.split('\n');
    let writingList = false;


    return (
        <div className="question-display">
            {questionArray.map((question, index) => {
                // If the question begins with a -
                if (question.startsWith('-')){
                    return <li key={index}>{question.substring(1)}</li>
                } else {
                    return <p key={index}>{question}</p>
                }
            })}
            <p id="marks-display">[{props.givenQuestion.marks} marks]</p>
        </div>
    )
}

export default QuestionRenderer