import React from "react";

const NotificationsSection = ({ notifications, onMarkAsRead, theme }) => {
    return (
        <div className={`p-6 rounded-lg shadow-md ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black border border-gray-300"}`}>
            <h2 className={`text-2xl font-bold border-b pb-3 mb-4 ${theme === "dark" ? "border-gray-700" : "border-gray-300"}`}>
                Notifications
            </h2>

            {notifications.length === 0 ? (
                <p className={`text-center text-sm py-6 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                    No new notifications
                </p>
            ) : (
                <div className="space-y-4">
                    {notifications.map(notification => (
                        <div
                            key={notification._id}
                            className={`flex justify-between items-center p-4 rounded-lg transition shadow-sm ${theme === "dark"
                                    ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                                    : "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300"
                                }`}
                        >
                            <div>
                                <p className="text-sm font-medium">{notification.message}</p>
                                <span className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                                    {new Date(notification.createdAt).toLocaleString()}
                                </span>
                            </div>
                            {!notification.isRead && ( // Show button only if notification is unread
                                <button
                                    className={`text-xs font-semibold px-3 py-1 rounded transition ${theme === "dark"
                                            ? "bg-blue-500 text-white hover:bg-blue-600"
                                            : "bg-blue-600 text-white hover:bg-blue-700"
                                        }`}
                                    onClick={() => onMarkAsRead(notification._id)}
                                >
                                    Mark as Read
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationsSection;
