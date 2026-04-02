import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { SCORE_ANIM_DURATION } from './quizConstants';

function QuizResults({ score, totalQuestions, onRestart }) {
    const scoreDisplayRef = useRef(null);

    useEffect(() => {
        if (!scoreDisplayRef.current) return;
        const obj = { val: 0 };
        const tween = gsap.to(obj, {
            val: score,
            duration: SCORE_ANIM_DURATION,
            ease: 'power2.out',
            onUpdate: () => {
                if (scoreDisplayRef.current) {
                    scoreDisplayRef.current.textContent = `${Math.round(obj.val)}%`;
                }
            },
        });
        return () => tween.kill();
    }, [score]);

    const scoreModifier =
        score >= 70 ? 'quiz-results__score--high' :
        score >= 50 ? 'quiz-results__score--mid' :
        'quiz-results__score--low';

    const resultMessage =
        score >= 70 ? 'Отлично представяне!' :
        score >= 50 ? 'Добро представяне!' :
        'Продължавайте да учите!';

    const correctCount = Math.round((score / 100) * totalQuestions);

    return (
        <section className="quiz-results">
            <div className="quiz-results__card">
                <h2>Вашият резултат</h2>
                <p
                    ref={scoreDisplayRef}
                    className={`quiz-results__score ${scoreModifier}`}
                    aria-live="polite"
                >
                    0%
                </p>
                <p>{resultMessage}</p>
                <p>{correctCount} от {totalQuestions} верни отговора</p>
                <button
                    type="button"
                    className="soge-btn soge-btn--primary"
                    onClick={onRestart}
                >
                    Започни отначало
                </button>
            </div>
        </section>
    );
}

export default QuizResults;
