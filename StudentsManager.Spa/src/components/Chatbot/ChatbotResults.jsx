import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getExaminationAnswers } from '../../services/chatbotService';
import ChatbotResultCard from './ChatbotResultCard';

function parseJson(jsonString) {
    if (!jsonString) return null;
    try {
        return JSON.parse(jsonString);
    } catch {
        return null;
    }
}

function ChatbotResults() {
    const { userId } = useAuth();
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchResults = useCallback(async () => {
        if (!userId) return;
        setIsLoading(true);
        setError('');
        try {
            const data = await getExaminationAnswers(userId);
            const sorted = [...data].sort(
                (a, b) => new Date(b.createdOn) - new Date(a.createdOn)
            );
            setResults(sorted);
        } catch (err) {
            const message =
                err?.response?.data?.message ||
                err?.response?.data ||
                err?.message ||
                'Failed to load results.';
            setError(String(message));
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchResults();
    }, [fetchResults]);

    if (!userId) {
        return (
            <div className="soge-results center">
                <p>Please log in to view your results.</p>
            </div>
        );
    }

    return (
        <div className="soge-results">
            <div className="soge-results-header">
                <h2>Your Chatbot Results</h2>
                <button
                    type="button"
                    className="soge-btn"
                    onClick={fetchResults}
                    disabled={isLoading}
                >
                    {isLoading ? 'Loading…' : 'Refresh'}
                </button>
            </div>

            {isLoading && (
                <div className="soge-results-loading center" aria-live="polite">
                    Loading results…
                </div>
            )}

            {!isLoading && error && (
                <p className="soge-error" role="alert">{error}</p>
            )}

            {!isLoading && !error && results.length === 0 && (
                <p className="soge-results-empty">No results found.</p>
            )}

            {!isLoading && results.length > 0 && (
                <>
                    <section aria-label="Latest result">
                        <ChatbotResultCard
                            {...results[0]}
                            result={parseJson(results[0].result)}
                            form={parseJson(results[0].form)}
                            isLatest={true}
                        />
                    </section>

                    {results.length > 1 && (
                        <section className="soge-result-history" aria-label="Previous results">
                            <h3 className="soge-result-history-heading">History</h3>
                            {results.slice(1).map((item, i) => (
                                <ChatbotResultCard
                                    key={item.id ?? i}
                                    {...item}
                                    result={parseJson(item.result)}
                                    form={parseJson(item.form)}
                                    isLatest={false}
                                />
                            ))}
                        </section>
                    )}
                </>
            )}
        </div>
    );
}

export default ChatbotResults;
