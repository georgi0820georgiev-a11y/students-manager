import { useState, useCallback, useRef, useEffect } from 'react';
import {
    sendChatMessage,
    submitChatbotAnswers,
    getExaminationAnswers,
    buildChatPayload,
} from '../../services/chatbotService';
import { logEvent } from '../../services/eventsService';
import { useAuth } from '../../context/AuthContext';

const WELCOME_MESSAGE = {
    role: 'assistant',
    content:
        'Здравей! Аз съм #Robo 🤖 — твоят AI асистент. ' +
        'Мога да те насоча в обучението ти по хибридни мобилни приложения. ' +
        'Как мога да ти помогна днес?',
};

export function useChatbot() {
    const { userId } = useAuth();

    const [messages, setMessages] = useState([WELCOME_MESSAGE]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sessionSaved, setSessionSaved] = useState(false);
    const [examinationContext, setExaminationContext] = useState(null);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Load prior examination answers on mount
    useEffect(() => {
        if (!userId) return;
        getExaminationAnswers(userId)
            .then((data) => {
                if (data && data.length > 0) {
                    setExaminationContext(data);
                }
            })
            .catch(() => {
                // Non-critical
            });
    }, [userId]);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const sendMessage = useCallback(async (text) => {
        const trimmed = (text ?? inputValue).trim();
        if (!trimmed || isLoading) return;

        setInputValue('');
        setError(null);
        setSessionSaved(false);

        const userMsg = { role: 'user', content: trimmed };

        // FIX: use functional update to avoid stale state reference
        setMessages((prev) => {
            const updatedMessages = [...prev, userMsg];

            // Trigger async after state update
            (async () => {
                setIsLoading(true);
                try {
                    const payload = buildChatPayload(userId, updatedMessages, examinationContext);
                    const { reply, sessionId } = await sendChatMessage(payload);

                    const assistantMsg = { role: 'assistant', content: reply };
                    const finalMessages = [...updatedMessages, assistantMsg];

                    setMessages(finalMessages);

                    if (userId) {
                        try {
                            await submitChatbotAnswers({
                                userId,
                                sessionId: sessionId ?? `session_${Date.now()}`,
                                messages: finalMessages,
                                timestamp: new Date().toISOString(),
                            });
                            setSessionSaved(true);

                            await logEvent(userId, 'chatbot-message', {
                                userMessage: trimmed,
                                assistantReply: reply,
                                messageCount: finalMessages.length,
                            });
                        } catch (persistErr) {
                            console.warn('Failed to persist chat session:', persistErr);
                        }
                    }
                } catch (err) {
                    console.error('Chat error:', err);
                    setError(
                        err?.response?.data?.message ||
                        'Възникна грешка при свързването с AI асистента. Моля, опитай отново.'
                    );
                    // Rollback — remove the user message that failed
                    setMessages((current) => current.filter((m) => m !== userMsg));
                } finally {
                    setIsLoading(false);
                    inputRef.current?.focus();
                }
            })();

            return updatedMessages;
        });
    }, [inputValue, isLoading, userId, examinationContext]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }, [sendMessage]);

    const resetChat = useCallback(() => {
        setMessages([WELCOME_MESSAGE]);
        setInputValue('');
        setError(null);
        setSessionSaved(false);

        if (userId) {
            logEvent(userId, 'chatbot-reset', {
                timestamp: new Date().toISOString(),
            }).catch(() => {});
        }
    }, [userId]);

    return {
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
    };
}
