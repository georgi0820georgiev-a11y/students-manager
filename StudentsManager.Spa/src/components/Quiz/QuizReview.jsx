function QuizReview({ answers, onShowResults }) {
    return (
        <div className="quiz-review">
            <h2 className="quiz-review__title">Преглед на отговорите</h2>
            <ol className="quiz-review__list">
                {answers.map((answer, index) => (
                    <li
                        key={answer.questionId}
                        className={`quiz-review__item quiz-review__item--${answer.isCorrect ? 'correct' : 'incorrect'}`}
                    >
                        <p className="quiz-review__question">
                            <span className="quiz-review__num">{index + 1}.</span> {answer.question}
                        </p>
                        <ul className="quiz-review__options">
                            {answer.options.map((opt) => {
                                const isSelected = opt.id === answer.selectedId;
                                const isCorrect = opt.id === answer.correctId;
                                let modifier = '';
                                if (isCorrect) modifier = 'quiz-review__option--correct';
                                else if (isSelected && !isCorrect) modifier = 'quiz-review__option--incorrect';
                                return (
                                    <li key={opt.id} className={`quiz-review__option ${modifier}`}>
                                        {opt.text}
                                        {isSelected && !isCorrect && (
                                            <span className="quiz-review__badge quiz-review__badge--wrong" aria-label="Грешен отговор"> ✗</span>
                                        )}
                                        {isCorrect && (
                                            <span className="quiz-review__badge quiz-review__badge--right" aria-label="Верен отговор"> ✓</span>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </li>
                ))}
            </ol>
            <div className="quiz-review__footer">
                <button
                    type="button"
                    className="soge-btn soge-btn--primary"
                    onClick={onShowResults}
                >
                    Виж резултата
                </button>
            </div>
        </div>
    );
}

export default QuizReview;
