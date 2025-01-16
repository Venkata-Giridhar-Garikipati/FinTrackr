import axios from 'axios';

const API_URL = 'https://fintrackr-backend-l72z.onrender.com/api/users';

export const signup = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
};

export const login = async (userData) => {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data;
};
