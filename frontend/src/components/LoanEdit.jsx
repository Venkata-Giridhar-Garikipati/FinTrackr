import React, { useEffect, useState } from "react";
import { getLoans, updateLoan, deleteLoan } from "../services/loanService";

const LoanEdit = () => {
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [editLoan, setEditLoan] = useState(null);
  const [formData, setFormData] = useState({});
  const [filters, setFilters] = useState({
    status: "",
    interestType: "",
    startDate: "",
    endDate: "",
    search: "",
  });

  // Fetch loans from the service
  const fetchLoans = async () => {
    const data = await getLoans();
    setLoans(data);
    filterLoans(data);
  };

  // Filter loans based on user inputs
  const filterLoans = (loans) => {
    let result = loans;

    if (filters.status) {
      result = result.filter((loan) => loan.status === filters.status);
    }

    if (filters.interestType) {
      result = result.filter((loan) => loan.interestType === filters.interestType);
    }

    if (filters.startDate) {
      result = result.filter((loan) => new Date(loan.date) >= new Date(filters.startDate));
    }

    if (filters.endDate) {
      result = result.filter((loan) => new Date(loan.date) <= new Date(filters.endDate));
    }

    if (filters.search) {
      result = result.filter((loan) =>
        loan.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        loan.phone.includes(filters.search)
      );
    }

    setFilteredLoans(result);
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  useEffect(() => {
    filterLoans(loans);
  }, [filters]);

  // Handlers for CRUD operations and form changes
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
      setLoans(loans.filter((loan) => loan._id !== loanId));
    } catch (error) {
      console.error("Error deleting loan:", error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h2 className="text-3xl mt-20 font-bold text-center text-blue-700 my-6">Loan Management</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
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

        <div>
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

        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-600">Search</label>
          <input
            type="text"
            name="search"
            placeholder="Search by name or phone"
            value={filters.search}
            onChange={handleFilterChange}
            className="border p-3 w-full rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Loan List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredLoans.length > 0 ? (
          filteredLoans.map((loan) => (
            <div
              key={loan._id}
              className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md bg-gradient-to-tr from-gray-50 to-blue-50 transition"
            >
              <h3 className="font-bold text-lg text-gray-700 mb-2">{loan.name}</h3>
              <p className="text-sm text-gray-500">Phone: {loan.phone}</p>
              <p className="text-sm text-gray-500">Amount: ₹{loan.amount}</p>
              <p className="text-sm text-gray-500">Status: {loan.status}</p>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => handleEdit(loan)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(loan._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">No loans found</p>
        )}
      </div>

      {/* Modal for Editing Loan */}
      {editLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form
            onSubmit={handleUpdate}
            className="bg-white p-6 rounded-md shadow-lg w-full max-w-lg space-y-4"
          >
            <h2 className="text-2xl font-bold text-gray-700 text-center">Edit Loan</h2>
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
            <div className="flex justify-end mt-4 space-x-2">
              <button
                type="button"
                onClick={() => setEditLoan(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default LoanEdit;
