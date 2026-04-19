import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { SCORE_ANIM_DURATION } from './quizConstants';

function QuizResults({ scoreDetails, totalQuestions, answers, onReview, onRestart }) {
    const scoreDisplayRef = useRef(null);
    const { correctCount, percentage, points, passed } = scoreDetails;

    useEffect(() => {
        if (!scoreDisplayRef.current) return undefined;

        const obj = { val: 0 };
        const tween = gsap.to(obj, {
            val: percentage,
            duration: SCORE_ANIM_DURATION,
            ease: 'power2.out',
            onUpdate: () => {
                if (scoreDisplayRef.current) {
                    scoreDisplayRef.current.textContent = `${Math.round(obj.val)}%`;
                }
            },
        });

        return () => tween.kill();
    }, [percentage]);

    const scoreModifier =
        percentage >= 75 ? 'quiz-results__score--high' :
        percentage >= 50 ? 'quiz-results__score--mid' :
        'quiz-results__score--low';

    const resultMessage = passed
        ? 'Машина!'
        : points === 0.5
            ? 'Има напредък, продължавай.'
            : 'Нищо, другият път по-добре!';

    return (
        <section className="quiz-results">
            <div className="quiz-results__card">
                <span className="quiz-results__eyebrow">Резултат</span>
                <h2>JavaScript & React тест</h2>
                <p
                    ref={scoreDisplayRef}
                    className={`quiz-results__score ${scoreModifier}`}
                    aria-live="polite"
                >
                    0%
                </p>
                <div className="quiz-results__points">
                    <strong>{points}</strong>
                    <span>точки</span>
                </div>
                <p className="quiz-results__message">{resultMessage}</p>
                <p className="quiz-results__meta">
                    {correctCount} от {totalQuestions} верни отговора
                </p>
                <div className="quiz-results__summary">
                    {answers.map((answer, index) => (
                        <span
                            key={answer.questionId}
                            className={`quiz-results__summary-dot quiz-results__summary-dot--${answer.isCorrect ? 'correct' : 'incorrect'}`}
                            title={`Въпрос ${index + 1}`}
                            aria-label={`Въпрос ${index + 1}: ${answer.isCorrect ? 'верен' : 'грешен'}`}
                        />
                    ))}
                </div>
                <div className="quiz-results__actions">
                    <button type="button" className="soge-btn" onClick={onReview}>
                        Прегледай отговорите
                    </button>
                    <button
                        type="button"
                        className="soge-btn soge-btn--primary"
                        onClick={onRestart}
                    >
                        Нов опит
                    </button>
                </div>
            </div>
        </section>
    );
}

export default QuizResults;
