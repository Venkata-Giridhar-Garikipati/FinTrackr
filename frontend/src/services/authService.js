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
export const getUserProfile = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; // Return user profile data
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error.response ? error.response.data : 'An error occurred while fetching profile';
    }
};

// Example for logging out user (clearing the token)
export const logout = () => {
    localStorage.removeItem('token');
};
