import axios from 'axios';

const API_URL = 'http://localhost:5000/api/loans';


export const getReport = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/report`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};
