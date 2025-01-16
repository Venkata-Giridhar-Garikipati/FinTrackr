import React, { useEffect, useState } from 'react';
import {
    Bar,
    Pie,
    Line,
    Doughnut,
    Radar,
    PolarArea,
} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    RadialLinearScale,
} from 'chart.js';
import { getReport } from '../services/reportService';

// Register chart.js components
ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    RadialLinearScale
);

const Visualization = () => {
    const [report, setReport] = useState(null);

    useEffect(() => {
        fetchReport();
    }, []);

    const fetchReport = async () => {
        try {
            const data = await getReport();
            setReport(data);
        } catch (error) {
            console.error('Error fetching report:', error);
        }
    };

    if (!report || !report.loans) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <p className="text-lg font-semibold text-gray-600">Loading report...</p>
            </div>
        );
    }

    const loans = report.loans || [];

    // Function to extract month names from dates
    const extractMonths = (loans) => {
        const monthCounts = {};
        loans.forEach((loan) => {
            const month = new Date(loan.date).toLocaleString('default', { month: 'short' });
            monthCounts[month] = (monthCounts[month] || 0) + loan.amount;
        });
        return Object.entries(monthCounts).map(([month, amount]) => ({ month, amount }));
    };

    // Calculate monthly income
    const monthlyIncome = extractMonths(loans);

    // Calculate people status
    const calculatePeopleStatus = (loans) => {
        const statusCounts = { Running: 0, Closed: 0 };
        loans.forEach((loan) => {
            if (loan.status in statusCounts) {
                statusCounts[loan.status]++;
            }
        });
        return statusCounts;
    };

    const peopleStatus = calculatePeopleStatus(loans);

    // Process data for visualizations
    const loanNames = loans.map((loan) => loan.name || 'N/A');
    const loanAmounts = loans.map((loan) => loan.amount || 0);
    const interestRates = loans.map((loan) => loan.interestRate || 0);
    const paymentsMade = loans.map((loan) =>
        (loan.payments || []).reduce((sum, payment) => sum + payment.amount, 0)
    );

    const monthlyIncomeLabels = monthlyIncome.map((income) => income.month);
    const monthlyIncomeAmounts = monthlyIncome.map((income) => income.amount);

    const peopleStatusLabels = Object.keys(peopleStatus);
    const peopleStatusValues = Object.values(peopleStatus);

    // Chart data
    const barData = {
        labels: loanNames,
        datasets: [
            {
                label: 'Loan Amounts',
                data: loanAmounts,
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    const pieData = {
        labels: loanNames,
        datasets: [
            {
                data: interestRates,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const lineData = {
        labels: loanNames,
        datasets: [
            {
                label: 'Total Payments Made',
                data: paymentsMade,
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                tension: 0.1,
            },
        ],
    };

    const doughnutData = {
        labels: loanNames,
        datasets: [
            {
                data: loanAmounts,
                backgroundColor: [
                    'rgba(255, 159, 64, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(255, 99, 132, 0.7)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const radarData = {
        labels: loanNames,
        datasets: [
            {
                label: 'Interest Rates',
                data: interestRates,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const polarAreaData = {
        labels: loanNames,
        datasets: [
            {
                data: paymentsMade,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const monthlyIncomeData = {
        labels: monthlyIncomeLabels,
        datasets: [
            {
                label: 'Monthly Income',
                data: monthlyIncomeAmounts,
                backgroundColor: 'rgba(75, 192, 192, 0.7)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const peopleStatusData = {
        labels: peopleStatusLabels,
        datasets: [
            {
                data: peopleStatusValues,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="p-4 lg:p-8 bg-gray-50 min-h-screen">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Loan Visualizations</h1>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Loan Amounts</h2>
                        <Bar data={barData} />
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Interest Distribution</h2>
                        <Pie data={pieData} />
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Payments Made</h2>
                        <Line data={lineData} />
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">People's Status</h2>
                        <Pie data={peopleStatusData} />
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Loan Amounts (Doughnut)</h2>
                        <Doughnut data={doughnutData} />
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Interest Rates (Radar)</h2>
                        <Radar data={radarData} />
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Payments Made (Polar Area)</h2>
                        <PolarArea data={polarAreaData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Visualization;
