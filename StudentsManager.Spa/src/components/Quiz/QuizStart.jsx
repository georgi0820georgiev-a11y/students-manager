import { QUIZ_HALF_POINT_CORRECT_COUNT, QUIZ_PASS_CORRECT_COUNT } from './quizConstants';

function formatHistoryDate(date) {
    if (!date) return 'последен опит';

    return new Intl.DateTimeFormat('bg-BG', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date));
}

function QuizStart({ totalQuestions, onStart, history, historyLoading, historyError }) {
    return (
        <section className="quiz-start section-init-test">
            <div className="bg-image quiz-start__bg" aria-hidden="true" />
            <div className="section-box center">
                <div className="section-init-test-txt quiz-start__panel">
                    <h1 className="title-big white">
                        Готов ли си за <strong>теста?</strong>
                    </h1>
                    <p className="p-mid white regular quiz-start__copy">
                        Тестът включва {totalQuestions} произволни въпроса.
                        За 1 точка са необходими {QUIZ_PASS_CORRECT_COUNT} верни отговора,
                        а {QUIZ_HALF_POINT_CORRECT_COUNT} верни отговора дават 0.5 точки.
                    </p>
                    <div className="quiz-start__stats" aria-label="Правила за оценяване">
                        <span><strong>{QUIZ_PASS_CORRECT_COUNT}</strong> верни = 1 точка</span>
                        <span><strong>{QUIZ_HALF_POINT_CORRECT_COUNT}</strong> верни = 0.5 точки</span>
                        <span><strong>{totalQuestions}</strong> въпроса</span>
                    </div>
                    <div className="btn-box quiz-start__actions">
                        <button type="button" className="btn-mid btn-red quiz-start__button" onClick={onStart}>
                            Започни теста
                        </button>
                    </div>
                    <div className="quiz-history" aria-live="polite">
                        <h2 className="quiz-history__title">Последни резултати</h2>
                        {historyLoading && <p className="quiz-history__status">Зареждане...</p>}
                        {!historyLoading && historyError && (
                            <p className="quiz-history__status">{historyError}</p>
                        )}
                        {!historyLoading && !historyError && history.length === 0 && (
                            <p className="quiz-history__status">Все още няма записани опити.</p>
                        )}
                        {!historyLoading && !historyError && history.length > 0 && (
                            <ul className="quiz-history__list">
                                {history.map((attempt) => (
                                    <li key={attempt.id} className="quiz-history__item">
                                        <span>{formatHistoryDate(attempt.date)}</span>
                                        <strong>{attempt.points} точки</strong>
                                        <small>
                                            {attempt.correctCount} / {attempt.totalQuestions} верни
                                        </small>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default QuizStart;
