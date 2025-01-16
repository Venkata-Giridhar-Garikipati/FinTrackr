import React, { useEffect, useState, useCallback } from 'react';
import { getLoans } from '../services/loanService';

// Function to calculate cumulative interest over time
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

const calculateNextDueDate = (loanDate, interestType) => {
    const date = new Date(loanDate);
    let nextDueDate;

    switch (interestType) {
        case 'monthly':
            nextDueDate = new Date(date.setMonth(date.getMonth() + 1));
            break;
        case 'weekly':
            nextDueDate = new Date(date.setDate(date.getDate() + 7));
            break;
        case 'daily':
            nextDueDate = new Date(date.setDate(date.getDate() + 1));
            break;
        case 'yearly':
            nextDueDate = new Date(date.setFullYear(date.getFullYear() + 1));
            break;
        default:
            nextDueDate = date;
    }

    return nextDueDate.toLocaleDateString();
};

const getLastPaymentDate = (payments) => {
    if (payments && payments.length > 0) {
        const sortedPayments = payments.sort((a, b) => new Date(b.date) - new Date(a.date));
        return sortedPayments[0].date ? new Date(sortedPayments[0].date).toLocaleDateString() : 'N/A';
    }
    return 'N/A';
};

const LoanList = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredLoans, setFilteredLoans] = useState([]);
    const [interestTypeFilter, setInterestTypeFilter] = useState('');
    const [minAmountFilter, setMinAmountFilter] = useState('');
    const [maxInterestRateFilter, setMaxInterestRateFilter] = useState('');
    const [lastPaymentDateFilter, setLastPaymentDateFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchLoans = async () => {
            try {
                const data = await getLoans();
                setLoans(data);
                setFilteredLoans(data);
            } catch (error) {
                console.error('Error fetching loans:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLoans();
    }, []);

    const filterLoans = useCallback(() => {
        let filtered = loans;

        if (interestTypeFilter) {
            filtered = filtered.filter((loan) => loan.interestType === interestTypeFilter);
        }

        if (minAmountFilter) {
            filtered = filtered.filter((loan) => loan.amount >= minAmountFilter);
        }

        if (maxInterestRateFilter) {
            filtered = filtered.filter((loan) => loan.interestRate <= maxInterestRateFilter);
        }

        if (lastPaymentDateFilter) {
            filtered = filtered.filter((loan) => {
                const lastPaymentDate = getLastPaymentDate(loan.payments);
                return new Date(lastPaymentDate) >= new Date(lastPaymentDateFilter);
            });
        }

        if (searchTerm) {
            filtered = filtered.filter((loan) =>
                loan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                loan.phone.includes(searchTerm)
            );
        }

        setFilteredLoans(filtered);
    }, [loans, interestTypeFilter, minAmountFilter, maxInterestRateFilter, lastPaymentDateFilter, searchTerm]);

    useEffect(() => {
        filterLoans();
    }, [interestTypeFilter, minAmountFilter, maxInterestRateFilter, lastPaymentDateFilter, searchTerm, filterLoans]);

    if (loading) {
        return <div className="text-center text-xl">Loading loans...</div>;
    }

    return (
        <div className="container px-3 py-4 mt-10">
            <h2 className="text-2xl font-bold mb-6 mt-10 text-center">Loans</h2>

            {/* Filter and Search UI */}
            <div className="mb-6 flex flex-wrap justify-between items-center">
                <div className="flex flex-wrap space-x-4">
                    {/* Filter Inputs */}
                    <label className="flex items-center">
                        Interest Type:
                        <select
                            value={interestTypeFilter}
                            onChange={(e) => setInterestTypeFilter(e.target.value)}
                            className="ml-2 p-2 border border-gray-300 rounded-md"
                        >
                            <option value="">All</option>
                            <option value="monthly">Monthly</option>
                            <option value="weekly">Weekly</option>
                            <option value="daily">Daily</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </label>

                    <label className="flex items-center">
                        Min Amount:
                        <input
                            type="number"
                            value={minAmountFilter}
                            onChange={(e) => setMinAmountFilter(e.target.value)}
                            placeholder="Min Amount"
                            className="ml-2 p-2 border border-gray-300 rounded-md"
                        />
                    </label>

                    <label className="flex items-center">
                        Max Interest Rate:
                        <input
                            type="number"
                            value={maxInterestRateFilter}
                            onChange={(e) => setMaxInterestRateFilter(e.target.value)}
                            placeholder="Max Interest Rate"
                            className="ml-2 p-2 border border-gray-300 rounded-md"
                        />
                    </label>

                    <label className="flex items-center">
                        Last Payment Date:
                        <input
                            type="date"
                            value={lastPaymentDateFilter}
                            onChange={(e) => setLastPaymentDateFilter(e.target.value)}
                            className="ml-2 p-2 border border-gray-300 rounded-md"
                        />
                    </label>
                </div>

                <div className="mt-5 md:mt-2">
                    {/* Search Input */}
                    <label className="flex items-center">
                        Search:
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by name or phone"
                            className="ml-3 p-2 border border-gray-300 rounded-md"
                        />
                    </label>
                </div>
            </div>

            {/* Loan Table */}
            <table className="min-w-full table-auto border-collapse shadow-lg">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-3 text-left">Date</th>
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-left">Phone</th>
                        <th className="p-3 text-left">Amount</th>
                        <th className="p-3 text-left">Interest Type</th>
                        <th className="p-3 text-left">Interest Rate (%)</th>
                        <th className="p-3 text-left">Dues</th>
                        <th className="p-3 text-left">Calculated Interest</th>
                        <th className="p-3 text-left">Last Payment Date</th>
                        <th className="p-3 text-left">Next Due Date</th>
                        <th className="p-3 text-left">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredLoans.length > 0 ? (
                        filteredLoans.map((loan) => (
                            <tr key={loan.id} className="border-b hover:bg-gray-100">
                                <td className="p-3">{new Date(loan.date).toLocaleDateString()}</td>
                                <td className="p-3">{loan.name}</td>
                                <td className="p-3">{loan.phone}</td>
                                <td className="p-3">₹{loan.amount}</td>
                                <td className="p-3">{loan.interestType}</td>
                                <td className="p-3">{loan.interestRate}%</td>
                                <td className="p-3">₹{calculateRemainingDues(loan)}</td>
                                <td className="p-3">
                                    ₹{calculateCumulativeInterest(
                                        loan.amount,
                                        loan.interestRate,
                                        loan.interestType,
                                        loan.date
                                    )}
                                </td>
                                <td className="p-3">{getLastPaymentDate(loan.payments)}</td>
                                <td className="p-3">
                                    {loan.status.toLowerCase() === 'closed'
                                        ? ' '
                                        : calculateNextDueDate(loan.date, loan.interestType)}
                                </td>
                                <td className="p-3">{loan.status}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="11" className="text-center text-gray-500 py-4">
                                No loans found matching your criteria.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default LoanList;
