import { useState, useRef, useEffect, useCallback } from 'react';

function ChatbotTextInput({ onSubmit }) {
    const [value, setValue] = useState('');
    const [shaking, setShaking] = useState(false);
    const submitted = useRef(false);
    const shakeTimer = useRef(null);

    useEffect(() => () => clearTimeout(shakeTimer.current), []);

    const handleSubmit = useCallback(() => {
        if (submitted.current) return;
        const trimmed = value.trim();
        if (!trimmed) {
            setShaking(true);
            shakeTimer.current = setTimeout(() => setShaking(false), 600);
            return;
        }
        submitted.current = true;
        onSubmit(trimmed);
    }, [value, onSubmit]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
        }
    }, [handleSubmit]);

    return (
        <div className={`soge-input-wrapper ${shaking ? 'soge-shake' : ''}`}>
            <div className="soge-input">
                <input
                    type="text"
                    id="soge-input"
                    className={value.trim() ? '' : 'empty'}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
                <label htmlFor="soge-input">Type your answer here</label>
                <div className="soge-input-line"></div>
            </div>
            <button type="button" className="soge-btn soge-btn--primary" onClick={handleSubmit}>Submit</button>
        </div>
    );
}

export default ChatbotTextInput;
