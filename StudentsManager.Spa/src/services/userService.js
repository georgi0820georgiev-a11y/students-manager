import axios from "axios"
import { baseUrl } from './apiConfig';

export const login = async (loginRequest) => {
    const response = await axios.post(`${baseUrl}/login`, loginRequest);
    return response.data;
};