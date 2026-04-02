function ChatbotForm({ onConfirm, onCancel, isSubmitting, error }) {
    return (
        <>
            <div className="soge-btn-wrapper btn-2">
                <button
                    type="button"
                    className="soge-btn soge-btn--primary"
                    onClick={onConfirm}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Submitting…' : 'Submit answers'}
                </button>
                <button
                    type="button"
                    className="soge-btn"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    No thanks
                </button>
            </div>
            {error && (
                <p role="alert" className="soge-error">{error}</p>
            )}
        </>
    );
}

export default ChatbotForm;
