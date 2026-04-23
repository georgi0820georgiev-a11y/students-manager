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
            <p className="soge-question">{question.question}</p>
            <div className="soge-answer">
                <div className={`quiz-options-grid${isAnimating ? ' quiz-options-grid--locked' : ''}`}>
                    {question.options.map((option) => (
                        <div
                            key={option.id}
                            className={getOptionClass(option.id, selectedAnswer, feedbackState, question.correctAnswer)}
                        >
                            <div
                                className="quiz-option__inner"
                                role="button"
                                tabIndex={isAnimating ? -1 : 0}
                                aria-label={option.text}
                                onClick={() => onAnswerClick(option.id)}
                                onKeyDown={(e) => {
                                    if (!isAnimating && (e.key === 'Enter' || e.key === ' ')) {
                                        e.preventDefault();
                                        onAnswerClick(option.id);
                                    }
                                }}
                            >
                                <div className="quiz-option__content">
                                    <div className="quiz-option__text">
                                        <span className="quiz-option__label">{option.text}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default QuizQuestion;
