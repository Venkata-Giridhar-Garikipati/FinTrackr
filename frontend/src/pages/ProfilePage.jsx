import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile } from './services/authService'; // Import the service

const ProfilePage = () => {
    const [isLogoutConfirm, setIsLogoutConfirm] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            // Fetch user details from the backend using the service
            getUserProfile(token)
                .then((data) => {
                    setUser(data);
                    setIsLoading(false); // Set loading to false after data is fetched
                })
                .catch((error) => {
                    console.error('Error fetching profile:', error);
                    setIsLoading(false); // Set loading to false in case of an error
                    if (error.response) {
                        // Server responded with a status other than 2xx
                        setError(`Error: ${error.response.status} - ${error.response.data.message || error.response.statusText}`);
                    } else if (error.request) {
                        // No response from server
                        setError('No response from server.');
                    } else {
                        // Other errors
                        setError('An error occurred while fetching the profile.');
                    }
                    if (error.response && error.response.status === 401) {
                        navigate('/login'); // If token is invalid or expired, redirect to login
                    }
                });
        } else {
            navigate('/login'); // Redirect to login if no token
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
            <div className="min-h-screen bg-gray-100 flex justify-center items-center">
                <p className="text-gray-600">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl">
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">User Profile</h2>

                {error ? (
                    <p className="text-red-500 text-center">{error}</p>
                ) : (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-700">Name:</span>
                            <span className="text-gray-600">{user.name}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-700">Email:</span>
                            <span className="text-gray-600">{user.email}</span>
                        </div>

                        <div className="mt-6 flex justify-center">
                            <button
                                onClick={handleConfirmLogout}
                                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                )}

                {isLogoutConfirm && (
                    <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
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
            </div>
        </div>
    );
};

export default ProfilePage;
