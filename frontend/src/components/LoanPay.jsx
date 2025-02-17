import React, { useEffect, useState } from 'react';
import { getLoans, updateLoan, addPayment } from '../services/loanService';


const calculateCumulativeInterest = (amount, interestRate, interestType, loanDate) => {
    const principal = amount;
    const rate = interestRate / 100;
    const startDate = new Date(loanDate);
    const currentDate = new Date();

    const periods = {
        monthly: 12,
        weekly: 52,
        daily: 365,
        yearly: 1,
    };

    const interval = periods[interestType] || 12;
    let cumulativeInterest = 0;

    let tempDate = new Date(startDate);
    while (tempDate <= currentDate) {
        const interestForPeriod = (principal + cumulativeInterest) * (rate / interval);
        cumulativeInterest += interestForPeriod;

        // Increment the tempDate based on the interest type
        switch (interestType) {
            case 'monthly':
                tempDate.setMonth(tempDate.getMonth() + 1);
                break;
            case 'weekly':
                tempDate.setDate(tempDate.getDate() + 7);
                break;
            case 'daily':
                tempDate.setDate(tempDate.getDate() + 1);
                break;
            case 'yearly':
                tempDate.setFullYear(tempDate.getFullYear() + 1);
                break;
            default:
                tempDate.setMonth(tempDate.getMonth() + 1);
        }
    }

    return parseFloat(cumulativeInterest.toFixed(2));
};

const calculateRemainingDues = (loan) => {
    const totalPaid = loan.payments.reduce((sum, payment) => sum + payment.amount, 0);
    const calculatedInterest = calculateCumulativeInterest(loan.amount, loan.interestRate, loan.interestType, loan.date);
    return Math.max(loan.amount + calculatedInterest - totalPaid, 0);
};


const LoanPay = () => {
    const [loans, setLoans] = useState([]);
    const [selectedLoanForPayment, setSelectedLoanForPayment] = useState(null);
    const [selectedLoanForView, setSelectedLoanForView] = useState(null);
    const [paymentData, setPaymentData] = useState({ date: '', amount: '' });
    const [feedback, setFeedback] = useState({ message: '', type: '' });

    useEffect(() => {
        fetchLoans();
    }, []);

    const fetchLoans = async () => {
        try {
            const data = await getLoans();
            setLoans(data);
        } catch (error) {
            console.error('Error fetching loans:', error);
            setFeedback({ message: 'Failed to fetch loans. Try again later.', type: 'error' });
        }
    };

    const handlePaymentChange = (e) => {
        setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
    };

    const handleAddPayment = async (e) => {
        e.preventDefault();
        if (!selectedLoanForPayment) return;

        try {
            await addPayment(selectedLoanForPayment._id, paymentData);
            const totalPaid =
                selectedLoanForPayment.payments.reduce((sum, payment) => sum + payment.amount, 0) +
                parseFloat(paymentData.amount);
            const remainingDues = calculateRemainingDues(selectedLoanForPayment);

            const updatedLoan = {
                ...selectedLoanForPayment,
                dues: remainingDues,
                totalAmount: totalPaid,
                status: remainingDues <= 0 ? 'Closed' : selectedLoanForPayment.status,
                closedDate: remainingDues <= 0 ? paymentData.date : null,
            };

            await updateLoan(selectedLoanForPayment._id, updatedLoan);
            setFeedback({ message: 'Payment added successfully!', type: 'success' });
            setSelectedLoanForPayment(null);
            fetchLoans();
        } catch (error) {
            console.error('Error adding payment:', error);
            setFeedback({ message: 'Failed to add payment. Try again later.', type: 'error' });
        }
    };

    return (
        <div className="m-20">
            {feedback.message && (
                <div className={`p-4 text-white rounded ${feedback.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {feedback.message}
                </div>
            )}

            <div className="m-20">
                <table className="w-full table-auto border-collapse border border-gray-300 mt-4">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-2">Date</th>
                            <th className="border border-gray-300 p-2">Name</th>
                            <th className="border border-gray-300 p-2">Phone</th>
                            <th className="border border-gray-300 p-2">Amount</th>
                            <th className="border border-gray-300 p-2">Interest Type</th>
                            <th className="border border-gray-300 p-2">Interest Rate</th>
                            <th className="border border-gray-300 p-2">Due</th>
                            <th className="border border-gray-300 p-2">Status</th>
                            <th className="border border-gray-300 p-2">Payments</th>
                            <th className="border border-gray-300 p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loans.map((loan) => (
                            <tr key={loan._id} className="text-center">
                                <td className="border border-gray-300 p-2">{new Date(loan.date).toLocaleDateString()}</td>
                                <td className="border border-gray-300 p-2">{loan.name}</td>
                                <td className="border border-gray-300 p-2">{loan.phone}</td>
                                <td className="border border-gray-300 p-2">₹{loan.amount}</td>
                                <td className="border border-gray-300 p-2">{loan.interestType}</td>
                                <td className="border border-gray-300 p-2">{loan.interestRate}%</td>
                                <td className="border border-gray-300 p-2">₹{calculateRemainingDues(loan)}</td>
                                <td className="border border-gray-300 p-2">{loan.status}</td>
                                <td className="border border-gray-300 p-2">
                                    <button
                                        onClick={() => {
                                            setSelectedLoanForView(loan);
                                        }}
                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                    >
                                        View Payments
                                    </button>
                                </td>
                                <td className="border border-gray-300 p-2">
                                    <button
                                        onClick={() => setSelectedLoanForPayment(loan)}
                                        disabled={loan.status === 'Closed'}
                                        className={`px-4 py-2 rounded ${
                                            loan.status === 'Closed'
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-green-500 text-white'
                                        }`}
                                    >
                                        Add Payment
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedLoanForPayment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <form onSubmit={handleAddPayment} className="bg-white p-8 rounded shadow-md space-y-4">
                        <h2 className="text-xl font-bold">Add Payment</h2>
                        <input
                            type="date"
                            name="date"
                            value={paymentData.date}
                            onChange={handlePaymentChange}
                            className="border p-2 w-full"
                            required
                        />
                        <input
                            type="number"
                            name="amount"
                            value={paymentData.amount}
                            onChange={handlePaymentChange}
                            placeholder="Payment Amount"
                            className="border p-2 w-full"
                            required
                        />
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => setSelectedLoanForPayment(null)}
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                                Add Payment
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {selectedLoanForView && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded shadow-md space-y-4">
                        <h2 className="text-xl font-bold">Payment History</h2>
                        {selectedLoanForView.payments.length > 0 ? (
                            <ul>
                                {selectedLoanForView.payments.map((payment, index) => (
                                    <li key={index}>
                                        {new Date(payment.date).toLocaleDateString()} - ₹{payment.amount}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No payments available.</p>
                        )}
                        <button
                            onClick={() => setSelectedLoanForView(null)}
                            className="bg-gray-500 text-white px-4 py-2 rounded"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoanPay;
