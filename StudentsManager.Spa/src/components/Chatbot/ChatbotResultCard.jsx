function ChatbotResultCard({ result, form, createdOn, wasSuccessfullyProcessed, errorMessage, isLatest }) {
    const formattedDate = createdOn
        ? new Date(createdOn).toLocaleString()
        : 'Unknown date';

    const cardClass = `soge-result-card${isLatest ? ' soge-result-card--latest' : ''}`;

    const content = (
        <>
            <div className="soge-result-meta">
                <span className="soge-result-meta-date">{formattedDate}</span>
                {!wasSuccessfullyProcessed && (
                    <span className="soge-result-processing">
                        {errorMessage
                            ? <span className="soge-error" role="alert">{errorMessage}</span>
                            : 'Your answers are being processed…'}
                    </span>
                )}
            </div>

            {wasSuccessfullyProcessed && (
                <>
                    {form ? (
                        <>
                            <div className="soge-result-grade">
                                Grade: <strong>{form.grade}</strong>
                            </div>
                            {form.overallFeedback && (
                                <div className="soge-result-feedback">
                                    <p>{form.overallFeedback}</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <p className="soge-result-fallback">Could not load details.</p>
                    )}

                    {result ? (
                        <ul className="soge-result-qa ul-reset">
                            {result.map((item, i) => (
                                <li key={i} className="soge-result-qa-item">
                                    <span className="soge-result-qa-q">{item.QuestionText}</span>
                                    <span className="soge-result-qa-a">{item.Answer}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="soge-result-fallback">Could not load Q&amp;A details.</p>
                    )}
                </>
            )}
        </>
    );

    if (isLatest) {
        return <div className={cardClass}>{content}</div>;
    }

    return (
        <details className={cardClass}>
            <summary className="soge-result-history-toggle">
                {formattedDate}
                {wasSuccessfullyProcessed && form ? ` — Grade: ${form.grade}` : ' — Processing…'}
            </summary>
            <div className="soge-result-history-body">{content}</div>
        </details>
    );
}

export default ChatbotResultCard;
