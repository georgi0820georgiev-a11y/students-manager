import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../../context/AuthContext';
import { getExaminationAnswers, getChatSessions } from '../../services/chatbotService';

function ChatbotResults() {
    const { userId, isLoggedIn } = useAuth();

    const [sessions, setSessions] = useState([]);
    const [examinationAnswers, setExaminationAnswers] = useState([]);
    const [loadingSessions, setLoadingSessions] = useState(true);
    const [loadingExam, setLoadingExam] = useState(true);
    const [errorSessions, setErrorSessions] = useState(null);
    const [errorExam, setErrorExam] = useState(null);

    useEffect(() => {
        if (!userId) return;
        getChatSessions(userId)
            .then((data) => setSessions(Array.isArray(data) ? data : []))
            .catch((err) => setErrorSessions(err?.response?.data?.message || 'Грешка при зареждане на сесиите.'))
            .finally(() => setLoadingSessions(false));
    }, [userId]);

    useEffect(() => {
        if (!userId) return;
        getExaminationAnswers(userId)
            .then((data) => setExaminationAnswers(Array.isArray(data) ? data : []))
            .catch((err) => setErrorExam(err?.response?.data?.message || 'Грешка при зареждане на изпитните отговори.'))
            .finally(() => setLoadingExam(false));
    }, [userId]);

    if (!isLoggedIn) {
        return (
            <div className="soge-results-empty">
                <p>Трябва да си влязъл в профила си, за да видиш резултатите.</p>
                <Link to="/login" className="soge-btn soge-btn--primary" style={{ display: 'inline-block', marginTop: 16 }}>
                    Вход
                </Link>
            </div>
        );
    }

    return (
        <div className="soge-results">

            {/* ══ EXAMINATION ANSWERS ══ */}
            <section className="soge-results-section">
                <div className="soge-results-header">
                    <h2>📋 Отговори от изпита</h2>
                    <Link to="/chatbot" className="soge-btn" style={{ fontSize: 13, padding: '8px 18px' }}>
                        ← Обратно към чата
                    </Link>
                </div>

                {loadingExam && <p className="soge-results-loading">Зареждане…</p>}
                {errorExam && <p className="chatbot-error" role="alert">{errorExam}</p>}
                {!loadingExam && !errorExam && examinationAnswers.length === 0 && (
                    <p className="soge-results-empty">Все още нямаш записани изпитни отговори.</p>
                )}
                {!loadingExam && examinationAnswers.map((session, idx) => (
                    <ExaminationCard
                        key={session.sessionId || `exam-${idx}`}
                        session={session}
                        index={idx}
                    />
                ))}
            </section>

            {/* ══ CHAT SESSIONS ══ */}
            <section className="soge-results-section" style={{ marginTop: 40 }}>
                <div className="soge-results-header">
                    <h2>💬 История на разговорите с AI</h2>
                </div>

                {loadingSessions && <p className="soge-results-loading">Зареждане…</p>}
                {errorSessions && <p className="chatbot-error" role="alert">{errorSessions}</p>}
                {!loadingSessions && !errorSessions && sessions.length === 0 && (
                    <p className="soge-results-empty">Все още нямаш записани разговори.</p>
                )}
                {!loadingSessions && sessions.map((session, idx) => (
                    <ChatSessionCard
                        key={session.sessionId || `session-${idx}`}
                        session={session}
                        index={idx}
                        isLatest={idx === sessions.length - 1}
                    />
                ))}
            </section>
        </div>
    );
}

// ── ExaminationCard ────────────────────────────────────────────────────────
function ExaminationCard({ session, index }) {
    const date = session.timestamp
        ? new Date(session.timestamp).toLocaleString('bg-BG')
        : `Сесия ${index + 1}`;

    const answers = Array.isArray(session.answers)
        ? session.answers
        : Array.isArray(session.messages)
            ? session.messages
            : [];

    return (
        <details className="soge-result-card" open={index === 0}>
            <summary className="soge-result-history-toggle">
                📄 Изпитна сесия — {date}
            </summary>
            <div className="soge-result-history-body">
                {answers.length === 0 && (
                    <p className="soge-result-fallback">Няма записани отговори за тази сесия.</p>
                )}
                <div className="soge-result-qa">
                    {answers.map((item) => (
                        <div key={item.id || item.question || item.content} className="soge-result-qa-item">
                            {item.question && (
                                <span className="soge-result-qa-q">❓ {item.question}</span>
                            )}
                            {item.answer && (
                                <span className="soge-result-qa-a">✏️ {item.answer}</span>
                            )}
                            {!item.question && item.role && (
                                <span className={`soge-result-qa-${item.role === 'user' ? 'q' : 'a'}`}>
                                    {item.role === 'user' ? '👤' : '🤖'} {item.content}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </details>
    );
}

ExaminationCard.propTypes = {
    session: PropTypes.shape({
        sessionId: PropTypes.string,
        timestamp: PropTypes.string,
        answers: PropTypes.array,
        messages: PropTypes.array,
    }).isRequired,
    index: PropTypes.number.isRequired,
};

// ── ChatSessionCard ────────────────────────────────────────────────────────
function ChatSessionCard({ session, index, isLatest }) {
    const date = session.timestamp
        ? new Date(session.timestamp).toLocaleString('bg-BG')
        : `Сесия ${index + 1}`;

    const messages = Array.isArray(session.messages) ? session.messages : [];
    const userMessages = messages.filter((m) => m.role === 'user');
    const assistantMessages = messages.filter((m) => m.role === 'assistant');

    return (
        <details
            className={`soge-result-card${isLatest ? ' soge-result-card--latest' : ''}`}
            open={isLatest}
        >
            <summary className="soge-result-history-toggle">
                💬 Разговор — {date}
                <span className="chatbot-session-meta">
                    {userMessages.length} въпроса · {assistantMessages.length} отговора
                </span>
            </summary>
            <div className="soge-result-history-body">
                {messages.length === 0 && (
                    <p className="soge-result-fallback">Празна сесия.</p>
                )}
                <div className="chatbot-session-messages">
                    {messages
                        .filter((m) => m.role !== 'system')
                        .map((m) => (
                            <div
                                key={m.id || `${m.role}-${m.content.slice(0, 12)}`}
                                className={`chatbot-session-msg chatbot-session-msg--${m.role}`}
                            >
                                <span className="chatbot-session-msg__icon" aria-hidden="true">
                                    {m.role === 'user' ? '👤' : '🤖'}
                                </span>
                                <p className="chatbot-session-msg__text">{m.content}</p>
                            </div>
                        ))}
                </div>
            </div>
        </details>
    );
}

ChatSessionCard.propTypes = {
    session: PropTypes.shape({
        sessionId: PropTypes.string,
        timestamp: PropTypes.string,
        messages: PropTypes.array,
    }).isRequired,
    index: PropTypes.number.isRequired,
    isLatest: PropTypes.bool.isRequired,
};

export default ChatbotResults;
