import React, { useEffect, useState } from 'react';
import { getNotifications, markNotificationAsRead } from '../services/notificationService';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const data = await getNotifications();
            setNotifications(data);
        } catch (err) {
            setError('Failed to fetch notifications');
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await markNotificationAsRead(id);
            fetchNotifications();
        } catch (err) {
            setError('Failed to mark notification as read');
        }
    };

    return (
        <div className="relative ">
            <button className="relative bg-blue-500 text-white px-4 py-2 rounded">
                Notifications
                {notifications.filter((n) => !n.isRead).length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                        {notifications.filter((n) => !n.isRead).length}
                    </span>
                )}
            </button>
            <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded">
                {error ? (
                    <p className="p-4 text-red-500">{error}</p>
                ) : notifications.length === 0 ? (
                    <p className="p-4 text-gray-500">No notifications</p>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {notifications.map((notification) => (
                            <li key={notification._id} className="p-4 flex justify-between items-center">
                                <p className={notification.isRead ? 'text-gray-500' : 'text-black'}>
                                    {notification.message}
                                </p>
                                {!notification.isRead && (
                                    <button
                                        onClick={() => handleMarkAsRead(notification._id)}
                                        className="text-blue-500"
                                    >
                                        Mark as read
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Notifications;
