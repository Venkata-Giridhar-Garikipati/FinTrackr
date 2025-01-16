import React, { useState } from 'react';
import { addLoan } from '../services/loanService';

const LoanForm = () => {
    const [formData, setFormData] = useState({
        date: '',
        name: '',
        phone: '',
        email: '',
        amount: '',
        interestType: '', // daily, weekly, monthly, yearly
        interestRate: '',
        surety: '',
        job: '',
        dues: '',
        nextDueDate:'',
        status: '', // Default to 'Running'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addLoan(formData);
        alert('Loan added successfully');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
        <input
            type="date"
            name="date"
            onChange={handleChange}
            className="border p-2 w-full"
            required
        />
        <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            className="border p-2 w-full"
            required
        />
        <input
            type="text"
            name="phone"
            placeholder="Phone"
            onChange={handleChange}
            className="border p-2 w-full"
            required
        />
        <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="border p-2 w-full"
            required
        />
        <input
            type="number"
            name="amount"
            placeholder="Amount"
            onChange={handleChange}
            className="border p-2 w-full"
            required
        />
       
        <select
            name="interestType"
            onChange={handleChange}
            className="border p-2 w-full"
            required
        >
            <option value="">Select Interest Type</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
        </select>
        <input
            type="number"
            name="interestRate"
            placeholder="Interest Rate"
            onChange={handleChange}
            className="border p-2 w-full"
            required
        />
      
        <input
            type="text"
            name="surety"
            placeholder="surety"
            onChange={handleChange}
            className="border p-2 w-full"
            required
        />
        <input
            type="text"
            name="job"
            placeholder="Job"
            onChange={handleChange}
            className="border p-2 w-full"
            required
        />
        <input
            type="number"
            name="dues"
            placeholder="Dues"
            onChange={handleChange}
            className="border p-2 w-full"
            defaultValue={0}
            required
        />
        <input
            type="date"
            name="nextDueDate"
            onChange={handleChange}
            className="border p-2 w-full"
            required
        />
        <select
            name="status"
            onChange={handleChange}
            className="border p-2 w-full"
            required
        >

            <option value="">Select Status</option>
            <option value="Running">Running</option>
            <option value="Closed">Closed</option>
        </select>
        <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded"
        >
            Add Loan
        </button>
    </form>
    
    );
};

export default LoanForm;
