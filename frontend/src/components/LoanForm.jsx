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
        nextDueDate: '',
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
        <div className="m-20 flex gap-8">
            {/* Form Section */}
            <div className="w-1/2">
                <h2 className="text-center font-serif text-black-400 text-4xl mb-6">Add Loan</h2>
                <form onSubmit={handleSubmit} className="space-y-4 p-4">
                    <div>
                        <label htmlFor="date" className="block mb-1 font-medium">Date</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            onChange={handleChange}
                            className="border p-2 w-full"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="name" className="block mb-1 font-medium">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Name"
                            onChange={handleChange}
                            className="border p-2 w-full"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block mb-1 font-medium">Phone</label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            placeholder="Phone"
                            onChange={handleChange}
                            className="border p-2 w-full"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block mb-1 font-medium">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                            onChange={handleChange}
                            className="border p-2 w-full"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="amount" className="block mb-1 font-medium">Amount</label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            placeholder="Amount"
                            onChange={handleChange}
                            className="border p-2 w-full"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="interestType" className="block mb-1 font-medium">Interest Type</label>
                        <select
                            id="interestType"
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
                    </div>

                    <div>
                        <label htmlFor="interestRate" className="block mb-1 font-medium">Interest Rate</label>
                        <input
                            type="number"
                            id="interestRate"
                            name="interestRate"
                            placeholder="Interest Rate"
                            onChange={handleChange}
                            className="border p-2 w-full"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="surety" className="block mb-1 font-medium">Surety</label>
                        <input
                            type="text"
                            id="surety"
                            name="surety"
                            placeholder="Surety"
                            onChange={handleChange}
                            className="border p-2 w-full"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="job" className="block mb-1 font-medium">Job</label>
                        <input
                            type="text"
                            id="job"
                            name="job"
                            placeholder="Job"
                            onChange={handleChange}
                            className="border p-2 w-full"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="dues" className="block mb-1 font-medium">Dues</label>
                        <input
                            type="number"
                            id="dues"
                            name="dues"
                            placeholder="Dues"
                            onChange={handleChange}
                            className="border p-2 w-full"
                            defaultValue={0}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="nextDueDate" className="block mb-1 font-medium">Next Due Date</label>
                        <input
                            type="date"
                            id="nextDueDate"
                            name="nextDueDate"
                            onChange={handleChange}
                            className="border p-2 w-full"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="status" className="block mb-1 font-medium">Status</label>
                        <select
                            id="status"
                            name="status"
                            onChange={handleChange}
                            className="border p-2 w-full"
                            required
                        >
                            <option value="">Select Status</option>
                            <option value="Running">Running</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded"
                    >
                        Add Loan
                    </button>
                </form>
            </div>

            {/* Image Section */}
            <div className="w-1/2 flex justify-center items-center">
                <img
                    src="ICONS-01.webp" // Replace with your image URL
                    alt="Loan Illustration"
                    className="max-w-full h-full  rounded shadow-md"
                />
            </div>
        </div>
    );
};

export default LoanForm;
