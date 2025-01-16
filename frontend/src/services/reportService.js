import axios from 'axios';

const API_URL = 'https://fintrackr-backend-l72z.onrender.com/api/loans';


export const getReport = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/report`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};
