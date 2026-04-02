function QuizProgress({ currentIndex, totalQuestions, answers }) {
    return (
        <div className="quiz-progress">
            <p className="quiz-progress__label">
                Въпрос {currentIndex + 1} от {totalQuestions}
            </p>
            <div
                className="quiz-progress__dots"
                role="progressbar"
                aria-valuenow={currentIndex + 1}
                aria-valuemin={1}
                aria-valuemax={totalQuestions}
                aria-label={`Въпрос ${currentIndex + 1} от ${totalQuestions}`}
            >
                {Array.from({ length: totalQuestions }, (_, i) => {
                    let modifier = 'quiz-progress__dot--upcoming';
                    if (i < answers.length) {
                        modifier = answers[i].isCorrect
                            ? 'quiz-progress__dot--correct'
                            : 'quiz-progress__dot--incorrect';
                    } else if (i === currentIndex) {
                        modifier = 'quiz-progress__dot--current';
                    }
                    return (
                        <span
                            key={i}
                            className={`quiz-progress__dot ${modifier}`}
                            aria-hidden="true"
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default QuizProgress;
