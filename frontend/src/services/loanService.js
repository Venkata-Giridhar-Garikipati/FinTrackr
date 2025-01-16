import axios from 'axios';

const API_URL = 'http://localhost:5000/api/loans';

export const getLoans = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const addLoan = async (loanData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(API_URL, loanData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const markAsPaid = async (id) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/${id}`, null, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Update Loan
export const updateLoan = async (id, loanData) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_URL}/${id}`, loanData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};


//delete 
export const deleteLoan = async (id) => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;  // You can adjust the return value based on what your backend returns
    } catch (error) {
        console.error("Error deleting loan:", error);
        throw error;
    }
};

// Add Payment
export const addPayment = async (loanId, paymentData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/${loanId}/payments`, paymentData,{
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};
