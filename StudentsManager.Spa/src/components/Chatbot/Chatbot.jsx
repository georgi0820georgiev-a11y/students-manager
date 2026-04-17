import { useChatbot } from './useChatbot';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

function Chatbot() {
    const { isLoggedIn } = useAuth();
    const {
        messages,
        inputValue,
        setInputValue,
        isLoading,
        error,
        sessionSaved,
        examinationContext,
        messagesEndRef,
        inputRef,
        sendMessage,
        handleKeyDown,
        resetChat,
    } = useChatbot();

    return (
        <div className="soge-young-chatbot chatbot-container">

            {examinationContext && (
                <output className="chatbot-context-banner">
                    <span className="chatbot-context-icon" aria-hidden="true">📋</span>
                    <span>
                        Заредени са твоите предишни отговори от изпита —
                        AI асистентът може да ги използва като контекст.
                    </span>
                </output>
            )}

            {!isLoggedIn && (
                <div className="chatbot-guest-notice" role="alert">
                    <span>
                        Влез в профила си, за да се съхраняват разговорите ти.{' '}
                        <Link to="/login" className="chatbot-guest-link">Вход</Link>
                    </span>
                </div>
            )}

            <div
                className="chatbot-messages"
                role="log"
                aria-label="Разговор с AI асистент"
                aria-live="polite"
            >
                {messages.map((msg, idx) => (
                    <ChatMessage
                        key={`${msg.role}-${idx}`}
                        role={msg.role}
                        content={msg.content}
                        isLatest={idx === messages.length - 1}
                    />
                ))}

                {isLoading && (
                    <div className="chatbot-typing" aria-label="Асистентът пише...">
                        <span className="chatbot-typing__dot" />
                        <span className="chatbot-typing__dot" />
                        <span className="chatbot-typing__dot" />
                    </div>
                )}

                {error && (
                    <div className="chatbot-error" role="alert">
                        <span className="chatbot-error__icon" aria-hidden="true">⚠️</span>
                        {error}
                    </div>
                )}

                {sessionSaved && !isLoading && (
                    <output className="chatbot-saved" aria-live="polite">
                        ✓ Разговорът е записан
                    </output>
                )}

                <div ref={messagesEndRef} />
            </div>

            <ChatInput
                value={inputValue}
                onChange={setInputValue}
                onSend={sendMessage}
                onKeyDown={handleKeyDown}
                isLoading={isLoading}
                inputRef={inputRef}
            />

            <div className="chatbot-footer">
                <button
                    type="button"
                    className="chatbot-footer__reset"
                    onClick={resetChat}
                    aria-label="Започни нов разговор"
                >
                    ↺ Нов разговор
                </button>

                {isLoggedIn && (
                    <Link to="/chatbot/results" className="chatbot-footer__results-link">
                        Виж резултатите →
                    </Link>
                )}
            </div>
        </div>
    );
}

export default Chatbot;
