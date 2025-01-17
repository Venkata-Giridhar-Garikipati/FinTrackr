import React, { useState } from 'react';
import { addLoan } from '../services/loanService';

const LoanForm = () => {
    const [formData, setFormData] = useState({
        date: '',
        name: '',
        phone: '',
        email: '',
        amount: '',
        interestType: '',
        interestRate: '',
        surety: '',
        job: '',
        dues: '',
        nextDueDate: '',
        status: '',
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
            <div className="w-1/2 bg-white p-6 rounded shadow-md">
                <h2 className="text-center font-serif text-black-400 text-4xl mb-6">Add Loan</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {[
                        { label: 'Date', type: 'date', id: 'date', required: true },
                        { label: 'Name', type: 'text', id: 'name', placeholder: 'Name', required: true },
                        { label: 'Phone', type: 'text', id: 'phone', placeholder: 'Phone', required: true },
                        { label: 'Email', type: 'email', id: 'email', placeholder: 'Email', required: true },
                        { label: 'Amount', type: 'number', id: 'amount', placeholder: 'Amount', required: true },
                        { label: 'Interest Rate', type: 'number', id: 'interestRate', placeholder: 'Interest Rate', required: true },
                        { label: 'Surety', type: 'text', id: 'surety', placeholder: 'Surety', required: true },
                        { label: 'Job', type: 'text', id: 'job', placeholder: 'Job', required: true },
                        { label: 'Dues', type: 'number', id: 'dues', placeholder: 'Dues', required: true, defaultValue: 0 },
                        { label: 'Next Due Date', type: 'date', id: 'nextDueDate', required: true },
                    ].map((input) => (
                        <div key={input.id} className="flex items-center gap-4">
                            <label
                                htmlFor={input.id}
                                className="w-1/3 text-right font-medium h-10 flex items-center"
                            >
                                {input.label}
                            </label>
                            <input
                                type={input.type}
                                id={input.id}
                                name={input.id}
                                placeholder={input.placeholder || ''}
                                onChange={handleChange}
                                className="border p-2 w-2/3 rounded h-10"
                                required={input.required}
                                defaultValue={input.defaultValue || ''}
                            />
                        </div>
                    ))}

                    {/* Dropdowns */}
                    <div className="flex items-center gap-4">
                        <label
                            htmlFor="interestType"
                            className="w-1/3 text-right font-medium h-10 flex items-center"
                        >
                            Interest Type
                        </label>
                        <select
                            id="interestType"
                            name="interestType"
                            onChange={handleChange}
                            className="border p-2 w-2/3 rounded h-10"
                            required
                        >
                            <option value="">Select Interest Type</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-4">
                        <label
                            htmlFor="status"
                            className="w-1/3 text-right font-medium h-10 flex items-center"
                        >
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            onChange={handleChange}
                            className="border p-2 w-2/3 rounded h-10"
                            required
                        >
                            <option value="">Select Status</option>
                            <option value="Running">Running</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                        >
                            Add Loan
                        </button>
                    </div>
                </form>
            </div>

            {/* Image Section */}
            <div className="w-1/2 flex justify-center items-center bg-gray-50 p-6 rounded shadow-md">
                <img
                    src="ICONS-01.webp" // Replace with your image URL
                    alt="Loan Illustration"
                    className="max-w-full h-auto rounded"
                />
            </div>
        </div>
    );
};

export default LoanForm;
