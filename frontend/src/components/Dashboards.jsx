import React, { useEffect, useState, useCallback } from 'react';
import { getLoans } from '../services/loanService'; // Import service for fetching loans
import { getReport } from '../services/reportService'; // Import service for fetching reports

const Dashboards = () => {
    const [loans, setLoans] = useState([]); // Loan data
    const [report, setReport] = useState(null); // Aggregated report data
    const [loading, setLoading] = useState(true); // Loading state

    const [totalIncome, setTotalIncome] = useState(0); // Total Interest Income
    const [totalPersonsPaying, setTotalPersonsPaying] = useState(0); // Total Persons Paying
    const [totalDues, setTotalDues] = useState(0); // Total Loans with Dues
    const [runningLoansCount, setRunningLoansCount] = useState(0); // Running Loans
    const [closedLoansCount, setClosedLoansCount] = useState(0); // Closed Loans
    const [totalLoanAmount, setTotalLoanAmount] = useState(0); // Total Loan Amount

    // Function to calculate interest based on the type
    const calculateInterest = (amount, interestRate, interestType) => {
        if (!amount || !interestRate || !interestType) {
            console.error('Invalid data for loan:', { amount, interestRate, interestType });
            return 0;
        }

        const sanitizedInterestRate = parseFloat(String(interestRate).replace('%', '').trim());
        if (isNaN(sanitizedInterestRate)) {
            console.error('Invalid interest rate:', interestRate);
            return 0;
        }

        const principal = amount;
        const rate = sanitizedInterestRate / 100; // Convert percentage to decimal
        const periods = {
            monthly: 12,
            weekly: 52,
            daily: 365,
            yearly: 1,
        };
        const n = periods[interestType] || 1;
        const t = 1; // Assume 1 year for calculation

        const interestAmount = principal * Math.pow(1 + rate / n, n * t) - principal;
        return interestAmount.toFixed(2);
    };

    // Fetch loan and report data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [loanData, reportData] = await Promise.all([getLoans(), getReport()]);
                setLoans(loanData);
                setReport(reportData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Calculate loan statistics
    const calculateLoanStatistics = useCallback(() => {
        let totalIncomeAmount = 0;
        let personsPaying = 0;
        let dues = 0;
        let runningCount = 0;
        let closedCount = 0;
        let totalAmount = 0;

        loans.forEach((loan) => {
            if (loan.amount && loan.interestRate && loan.interestType) {
                const interestAmount = parseFloat(calculateInterest(loan.amount, loan.interestRate, loan.interestType));
                if (!isNaN(interestAmount)) totalIncomeAmount += interestAmount;
            }

            totalAmount += loan.amount || 0;

            if (loan.status === 'Running') {
                runningCount++;
                personsPaying++;
                dues++;
            } else if (loan.status === 'Closed') {
                closedCount++;
            }
        });

        setTotalIncome(totalIncomeAmount.toFixed(2));
        setTotalPersonsPaying(personsPaying);
        setTotalDues(dues);
        setRunningLoansCount(runningCount);
        setClosedLoansCount(closedCount);
        setTotalLoanAmount(totalAmount.toFixed(2));
    }, [loans]);

    // Recalculate statistics whenever loans change
    useEffect(() => {
        if (loans.length > 0) calculateLoanStatistics();
    }, [loans, calculateLoanStatistics]);

    if (loading) return <div className="text-center text-xl">Loading data...</div>;

    if (!report) return <div className="text-center text-xl text-red-500">Failed to load report data.</div>;

    return (
        <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold mb-6">Loan Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card title="Total Loan Amount" value={`₹${totalLoanAmount}`} description="Sum of all loans" color="purple-500" />
                <Card title="Total Paid Amount" value={`₹${report.totalPaid}`} description="From Monthly, Weekly, Daily Loans" color="green-500" />
                <Card title="Total Loans" value={runningLoansCount+closedLoansCount} description="Active loan payers" color="blue-500" />
                <Card title="Number of Dues (Active Loans)" value={totalDues} description="Loans currently active" color="yellow-500" />
                <Card title="Number of Loans Running" value={runningLoansCount} description="Loans in progress" color="indigo-500" />
                <Card title="Number of Loans Closed" value={closedLoansCount} description="Loans fully paid" color="red-500" />
            </div>
        </div>
    );
};

const Card = ({ title, value, description, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
        <p className={`text-xl font-bold text-${color}`}>{value}</p>
        <p className="text-sm text-gray-500">{description}</p>
    </div>
);

export default Dashboards;
