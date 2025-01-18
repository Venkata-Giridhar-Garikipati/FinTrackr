import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [isLogoutConfirm, setIsLogoutConfirm] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleConfirmLogout = () => {
        setIsLogoutConfirm(true);
    };

    const handleCancelLogout = () => {
        setIsLogoutConfirm(false);
    };

    return (
        <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-md fixed top-0 left-0 w-full z-50">
            <div className="flex justify-between items-center">
                <Link to="/" className="text-lg font-bold">
                    FinTrackr
                </Link>
                <div className="space-x-4">
                    {token ? (
                        <>
                            <Link to="/loan-form" className="hover:underline">
                                Add Loan
                            </Link>

                            <Link to="/home" className="hover:underline">
                                Dashboards
                            </Link>

                            <Link to="/loan-edit" className="hover:underline">
                                Edit Loan
                            </Link>

                            <Link to="/loan-list" className="hover:underline">
                                Loan List
                            </Link>

                            <Link to="/report" className="hover:underline">
                                Report
                            </Link>

                            <Link to="/pay" className="hover:underline">
                                Payment
                            </Link>

                            <Link to="/notifications" className="hover:underline">
                                Notification
                            </Link>

                            <button
                                onClick={handleConfirmLogout}
                                className="bg-red-500 px-4 py-1 rounded hover:bg-red-600"
                            >
                                Logout
                            </button>

                            {isLogoutConfirm && (
                                <div className="absolute top-50 left-50 right-50 bottom-50 bg-black bg-opacity-50 flex justify-center items-center z-50">
                                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm mx-auto space-y-6">
                                        <h2 className="text-xl font-semibold text-center text-gray-800">
                                            Are you sure you want to logout?
                                        </h2>
                                        <div className="flex justify-evenly">
                                            <button
                                                onClick={handleLogout}
                                                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                                            >
                                                Yes
                                            </button>
                                            <button
                                                onClick={handleCancelLogout}
                                                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition duration-300"
                                            >
                                                No
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:underline">
                                Login
                            </Link>
                            <Link to="/signup" className="hover:underline">
                                Signup
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
