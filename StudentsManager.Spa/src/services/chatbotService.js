import axios from "axios"
import { baseUrl } from './apiConfig';

export const submitChatbotAnswers = async (payload) => {
    const response = await axios.post(`${baseUrl}/chatbot/examination-answers`, payload);
    return response.data;
};

export const getExaminationAnswers = async (userId) => {
    const response = await axios.get(`${baseUrl}/chatbot/examination-answers/${userId}`);
    return response.data;
};
