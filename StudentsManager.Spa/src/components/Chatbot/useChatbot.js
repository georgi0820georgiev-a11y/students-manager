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

    useEffect(() => {
        if (!userId) return;
        getExaminationAnswers(userId)
            .then((data) => {
                if (data && data.length > 0) {
                    setExaminationContext(data);
                }
            })
            .catch(() => {});
    }, [userId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const persistSession = useCallback(async (finalMessages, reply, trimmed) => {
        if (!userId) return;
        try {
            await submitChatbotAnswers({
                userId,
                sessionId: `session_${Date.now()}`,
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
    }, [userId]);

    const callAI = useCallback(async (updatedMessages, trimmed) => {
        const payload = buildChatPayload(userId, updatedMessages, examinationContext);
        const { reply } = await sendChatMessage(payload);
        const assistantMsg = { role: 'assistant', content: reply };
        const finalMessages = [...updatedMessages, assistantMsg];
        setMessages(finalMessages);
        await persistSession(finalMessages, reply, trimmed);
    }, [userId, examinationContext, persistSession]);

    const handleSendError = useCallback((err, prevMessages) => {
        console.error('Chat error:', err);
        const errMsg =
            err?.response?.data?.message ||
            'Възникна грешка при свързването с AI асистента. Моля, опитай отново.';
        setError(errMsg);
        setMessages(prevMessages);
    }, []);

    const sendMessage = useCallback(async (text) => {
        const trimmed = (text ?? inputValue).trim();
        if (!trimmed || isLoading) return;

        const prevMessages = messages;
        setInputValue('');
        setError(null);
        setSessionSaved(false);

        const userMsg = { role: 'user', content: trimmed };
        const updatedMessages = [...prevMessages, userMsg];
        setMessages(updatedMessages);
        setIsLoading(true);

        try {
            await callAI(updatedMessages, trimmed);
        } catch (err) {
            handleSendError(err, prevMessages);
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    }, [inputValue, isLoading, messages, callAI, handleSendError]);

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
