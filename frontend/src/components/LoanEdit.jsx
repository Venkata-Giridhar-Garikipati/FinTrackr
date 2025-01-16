import React, { useEffect, useState } from "react";
import { getLoans, updateLoan, deleteLoan } from "../services/loanService";

const LoanEdit = () => {
  const [loans, setLoans] = useState([]);
  const [editLoan, setEditLoan] = useState(null);
  const [formData, setFormData] = useState({});
  const [filters, setFilters] = useState({
    status: '',
    interestType: '',
    startDate: '',
    endDate: ''
  });

  const fetchLoans = async () => {
    const data = await getLoans();
    filterLoans(data);
  };

  const filterLoans = (loans) => {
    let filteredLoans = loans;

    if (filters.status) {
      filteredLoans = filteredLoans.filter(loan => loan.status === filters.status);
    }

    if (filters.interestType) {
      filteredLoans = filteredLoans.filter(loan => loan.interestType === filters.interestType);
    }

    if (filters.startDate) {
      filteredLoans = filteredLoans.filter(loan => new Date(loan.date) >= new Date(filters.startDate));
    }

    if (filters.endDate) {
      filteredLoans = filteredLoans.filter(loan => new Date(loan.date) <= new Date(filters.endDate));
    }

    setLoans(filteredLoans);
  };

  useEffect(() => {
    fetchLoans();
  }, [filters]);

  const handleEdit = (loan) => {
    setEditLoan(loan);
    setFormData(loan);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await updateLoan(editLoan._id, formData);
    setEditLoan(null);
    fetchLoans();
  };

  const handleDelete = async (loanId) => {
    try {
      await deleteLoan(loanId);
      setLoans(loans.filter(loan => loan._id !== loanId));
    } catch (error) {
      console.error("Error deleting loan:", error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h2 className="text-2xl mt-10 p-8 font-bold text-center text-gray-800">Loan Management</h2>

      <div className="flex flex-wrap space-x-4 mb-6 gap-4">
        <div className="w-full sm:w-1/4">
          <label htmlFor="status" className="block text-sm font-medium text-gray-600">Loan Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="border p-3 w-full rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Status</option>
            <option value="Running">Running</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div className="w-full sm:w-1/4">
          <label htmlFor="interestType" className="block text-sm font-medium text-gray-600">Interest Type</label>
          <select
            name="interestType"
            value={filters.interestType}
            onChange={handleFilterChange}
            className="border p-3 w-full rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Interest Type</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div className="w-full sm:w-1/4">
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-600">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
            className="border p-3 w-full rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="w-full sm:w-1/4">
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-600">End Date</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
            className="border p-3 w-full rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <ul className="space-y-6">
        {loans.map((loan) => (
          <li key={loan._id} className="bg-white border shadow-lg rounded-xl hover:shadow-2xl transition-all duration-300 p-6">
            <p className="text-lg font-semibold text-gray-800">Date: {new Date(loan.date).toLocaleDateString()}</p>
            <p className="text-md text-gray-600">Name: {loan.name}</p>
            <p className="text-md text-gray-600">Phone: {loan.phone}</p>
            <p className="text-md text-gray-600">Amount: ₹{loan.amount}</p>
            <p className="text-md text-gray-600">Interest Type: {loan.interestType}</p>
            <p className="text-md text-gray-600">Interest Rate: {loan.interestRate}%</p>
            <p className="text-md text-gray-600">Status: {loan.status}</p>

            <div className="flex space-x-4 mt-4">
              <button
                onClick={() => handleEdit(loan)}
                className="bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600 transition-all"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(loan._id)}
                className="bg-red-500 text-white px-5 py-2 rounded-md hover:bg-red-600 transition-all"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <form
            onSubmit={handleUpdate}
            className="bg-white p-8 rounded-lg shadow-xl space-y-6 w-full sm:w-3/4 md:w-1/2 xl:w-1/3"
          >
            <h2 className="text-3xl font-semibold text-center text-gray-800">Edit Loan Details</h2>

            <label htmlFor="name" className="block text-sm font-medium text-gray-600">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              className="border p-3 w-full rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />

            <label htmlFor="amount" className="block text-sm font-medium text-gray-600">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleFormChange}
              className="border p-3 w-full rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />

            <label htmlFor="status" className="block text-sm font-medium text-gray-600">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleFormChange}
              className="border p-3 w-full rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="Closed">Closed</option>
              <option value="Running">Running</option>
            </select>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => setEditLoan(null)}
                className="bg-gray-400 text-white px-6 py-3 rounded-md hover:bg-gray-500 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-all"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default LoanEdit;
