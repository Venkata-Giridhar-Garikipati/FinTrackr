import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
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
                                Pay
                            </Link>

                            <Link to="/notifications" className="hover:underline">
                                Notification
                            </Link>
                            
                           
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 px-4 py-1 rounded hover:bg-red-600"
                            >
                                Logout
                            </button>
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
