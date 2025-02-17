import axios from 'axios';

const API_URL = 'https://fintrackr-backend-l72z.onrender.com/api/notifications';


export const getNotifications = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const markNotificationAsRead = async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.patch(`${API_URL}/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};
