import axios from 'axios';
import { baseUrl } from './apiConfig';

/**
 * POST /chatbot/examination-answers
 * Submits the user's chatbot Q&A answers for persistence.
 */
export const submitChatbotAnswers = async (payload) => {
    const response = await axios.post(`${baseUrl}/chatbot/examination-answers`, payload);
    return response.data;
};

/**
 * GET /chatbot/examination-answers/{userId}
 * Retrieves all saved chatbot sessions for a user.
 */
export const getExaminationAnswers = async (userId) => {
    const response = await axios.get(`${baseUrl}/chatbot/examination-answers/${userId}`);
    return response.data;
};


/**
 * POST /chatbot/chat
 * Sends the conversation history + user context to the backend,
 * which forwards it to Azure OpenAI and returns the assistant reply.
 *
 * @param {object} payload
 * @param {string}   payload.userId          - Authenticated user id
 * @param {Array}    payload.messages         - Full conversation history
 *                                             [{ role: 'user'|'assistant', content: string }]
 * @param {object}   [payload.examinationContext] - Optional: prior answers from the DB
 * @returns {Promise<{ reply: string, sessionId: string }>}
 */
export const sendChatMessage = async (payload) => {
    const response = await axios.post(`${baseUrl}/chatbot/chat`, payload);
    return response.data;
};

/**
 * GET /chatbot/sessions/{userId}
 * Retrieves all chat sessions (conversation history) for a user.
 */
export const getChatSessions = async (userId) => {
    const response = await axios.get(`${baseUrl}/chatbot/sessions/${userId}`);
    return response.data;
};


/**
 * Builds the request body for /chatbot/chat.
 * Optionally injects the user's prior examination answers as system context.
 *
 * @param {string} userId
 * @param {Array}  messages          - Conversation so far
 * @param {Array}  [examinationData] - From GET /chatbot/examination-answers/{userId}
 */
export const buildChatPayload = (userId, messages, examinationData = null) => {
    const payload = { userId, messages };

    if (examinationData && examinationData.length > 0) {
        // Attach the most recent examination session as context
        const latest = examinationData[examinationData.length - 1];
        payload.examinationContext = latest;
    }

    return payload;
};
