import axios from 'axios';
import { baseUrl } from './apiConfig';
 
export const submitChatbotAnswers = async (payload) => {
    const response = await axios.post(`${baseUrl}/chatbot/examination-answers`, payload);
    return response.data;
};
 
export const getExaminationAnswers = async (userId) => {
    const response = await axios.get(`${baseUrl}/chatbot/examination-answers/${userId}`);
    return response.data;
};
 
export const sendChatMessage = async (payload) => {
    const response = await axios.post(`${baseUrl}/chatbot/chat`, payload);
    return response.data;
};
 
export const getChatSessions = async (userId) => {
    const response = await axios.get(`${baseUrl}/chatbot/sessions/${userId}`);
    return response.data;
};
 
export const buildChatPayload = (userId, messages, examinationContext) => {
    const payload = {
        userId,
        messages,
    };
 
    if (examinationContext && examinationContext.length > 0) {
        payload.examinationContext = examinationContext;
    }
 
    return payload;
};
