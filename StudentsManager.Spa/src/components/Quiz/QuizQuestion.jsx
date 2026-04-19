function getOptionClass(optionId, selectedAnswer, feedbackState, correctAnswerId) {
    const isSelected = selectedAnswer === optionId;
    const isCorrect = optionId === correctAnswerId;
    if (isSelected && feedbackState === 'correct') return 'quiz-option quiz-option--correct';
    if (isSelected && feedbackState === 'incorrect') return 'quiz-option quiz-option--incorrect';
    if (!isSelected && feedbackState === 'incorrect' && isCorrect) return 'quiz-option quiz-option--correct-reveal';
    return 'quiz-option';
}

function QuizQuestion({ question, selectedAnswer, onAnswerClick, feedbackState, isAnimating }) {
    return (
        <div>
            <p className="soge-question quiz-question__title">{question.question}</p>
            <div className="soge-answer">
                <div className={`quiz-options-grid${isAnimating ? ' quiz-options-grid--locked' : ''}`}>
                    {question.options.map((option, index) => (
                        <div
                            key={option.id}
                            className={getOptionClass(option.id, selectedAnswer, feedbackState, question.correctAnswer)}
                        >
                            <button
                                type="button"
                                className="quiz-option__inner"
                                disabled={isAnimating}
                                aria-pressed={selectedAnswer === option.id}
                                onClick={() => onAnswerClick(option.id)}
                            >
                                <div className="quiz-option__content">
                                    <span className="quiz-option__marker">
                                        {String.fromCharCode(65 + index)}
                                    </span>
                                    <div className="quiz-option__text">
                                        <span className="quiz-option__label">{option.text}</span>
                                    </div>
                                </div>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default QuizQuestion;
