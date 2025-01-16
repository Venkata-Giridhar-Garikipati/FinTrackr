import React, { useEffect, useState } from 'react';
import { getReport } from '../services/reportService';
import { exportToCSV } from '../utils/export';
import { getLoans } from '../services/loanService';

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


const Report = () => {
    const [report, setReport] = useState(null);

    useEffect(() => {
        fetchReport();
    }, []);

    const fetchReport = async () => {
        const data = await getReport();
        setReport(data);
    };

    const handleExportCSV = () => {
        if (report) {
            const headers = ['Name', 'Phone', 'Amount', 'Interest','Due', 'Status', 'Payments'];
            const rows = report.loans.map((loan) => [
                loan.name,
                loan.phone,
                loan.amount,
                loan.interestRate,
                calculateRemainingDues(loan),
                loan.status,
                loan.payments
                    .map((p) => `${new Date(p.date).toLocaleDateString()} - $${p.amount}`)
                    .join('; '),
            ]);
            exportToCSV(headers, rows, 'loan_report.csv');
        }
    };

    if (!report) {
        return <p>Loading report...</p>;
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Loan Report</h1>
            <div className="border p-4 rounded mb-8">
                <p>Total Loans: {report.totalLoans}</p>
                <p>Total Loaned: ${report.totalLoaned}</p>
                <p>Total Paid: ${report.totalPaid}</p>
            </div>
            <button
                onClick={handleExportCSV}
                className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
            >
                Export to CSV
            </button>
            <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead>
                    <tr>
                        <th className="border border-gray-300 p-2">Name</th>
                        <th className="border border-gray-300 p-2">Phone</th>
                        <th className="border border-gray-300 p-2">Amount</th>
                        <th className="border border-gray-300 p-2">Interest</th>
                        <th className="border border-gray-300 p-2">Due</th>
                        <th className="border border-gray-300 p-2">Status</th>
                        <th className="border border-gray-300 p-2">Payments</th>
                    </tr>
                </thead>
                <tbody>
                    {report.loans.map((loan, index) => (
                        <tr key={index}>
                            <td className="border border-gray-300 p-2">{loan.name}</td>
                            <td className="border border-gray-300 p-2">{loan.phone}</td>
                            <td className="border border-gray-300 p-2">₹{loan.amount}</td>
                            <td className="border border-gray-300 p-2">{loan.interestRate}%</td>
                            <td className="border border-gray-300 p-2">₹{calculateRemainingDues(loan)}</td>
                            <td className="border border-gray-300 p-2">{loan.status}</td>
                            <td className="border border-gray-300 p-2">
                                {loan.payments.map(
                                    (p, i) =>
                                        `${new Date(p.date).toLocaleDateString()} - ₹${p.amount}`
                                ).join('; ')}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Report;
