import PropTypes from 'prop-types';

function ChatInput({ value, onChange, onSend, onKeyDown, isLoading, inputRef }) {
    return (
        <div className="chatbot-input-area">
            <div className="soge-input chatbot-input-wrap">
                <textarea
                    ref={inputRef}
                    className="chatbot-input__textarea"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={onKeyDown}
                    placeholder="Напиши съобщение… (Enter за изпращане)"
                    rows={1}
                    aria-label="Въведи съобщение"
                    disabled={isLoading}
                    maxLength={2000}
                />
                <div className="soge-input-line" aria-hidden="true" />
            </div>

            <button
                type="button"
                className={`soge-btn soge-btn--primary chatbot-send-btn${isLoading ? ' soge-btn--disabled' : ''}`}
                onClick={() => onSend()}
                disabled={isLoading || !value.trim()}
                aria-label="Изпрати съобщение"
            >
                {isLoading ? (
                    <span className="chatbot-send-btn__spinner" aria-hidden="true" />
                ) : (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                )}
            </button>
        </div>
    );
}

ChatInput.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onSend: PropTypes.func.isRequired,
    onKeyDown: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    inputRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
    ]),
};

ChatInput.defaultProps = {
    inputRef: null,
};

export default ChatInput;
