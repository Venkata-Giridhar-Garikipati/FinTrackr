import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile } from '../services/authService';
import { FiUser, FiMail, FiLogOut } from 'react-icons/fi';

const ProfilePage = () => {
    const [isLogoutConfirm, setIsLogoutConfirm] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            getUserProfile(token)
                .then((data) => {
                    setUser(data);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching profile:', error);
                    setIsLoading(false);
                    if (error.response) {
                        setError(`Error: ${error.response.status} - ${error.response.data.message || error.response.statusText}`);
                    } else if (error.request) {
                        setError('No response from server.');
                    } else {
                        setError('An error occurred while fetching the profile.');
                    }
                    if (error.response && error.response.status === 401) {
                        navigate('/login');
                    }
                });
        } else {
            navigate('/login');
        }
    }, [token, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleConfirmLogout = () => {
        setIsLogoutConfirm(true);
    };

    const handleCancelLogout = () => {
        setIsLogoutConfirm(false);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-xl">
                <h2 className="text-2xl sm:text-3xl font-semibold text-center text-gray-800 mb-6">
                    <FiUser className="inline-block mr-2" /> User Profile
                </h2>

                {error ? (
                    <p className="text-red-500 text-center">{error}</p>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <FiUser className="text-blue-500 text-xl" />
                            <div>
                                <span className="block font-bold text-gray-700">Name:</span>
                                <span className="text-gray-600">{user.name}</span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <FiMail className="text-blue-500 text-xl" />
                            <div>
                                <span className="block font-bold text-gray-700">Email:</span>
                                <span className="text-gray-600">{user.email}</span>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-center">
                            <button
                                onClick={handleConfirmLogout}
                                className="bg-red-500 text-white flex items-center px-6 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                            >
                                <FiLogOut className="mr-2" /> Logout
                            </button>
                        </div>
                    </div>
                )}

                {isLogoutConfirm && (
                    <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm mx-auto space-y-6 text-center">
                            <h2 className="text-xl font-semibold text-gray-800">
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
            </div>
        </div>
    );
};

export default ProfilePage;
