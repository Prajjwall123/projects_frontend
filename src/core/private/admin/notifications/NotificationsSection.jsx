import React from "react";
import { FaBell } from "react-icons/fa";

const NotificationsSection = ({ notifications, onMarkAsRead, theme }) => {
    return (
        <div
            className={`p-3 sm:p-4 md:p-6 rounded-xl shadow-lg transition-all duration-300 border backdrop-blur-sm ${theme === "dark"
                    ? "bg-gray-900/80 border-gray-800 text-white"
                    : "bg-gray-100/80 border-gray-200 text-gray-900"
                }`}
        >
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 md:mb-6 tracking-tight flex items-center">
                <FaBell className="mr-2 text-blue-500 dark:text-blue-400" />
                Notifications
            </h2>

            {notifications.length === 0 ? (
                <p
                    className={`text-center text-xs sm:text-sm md:text-base py-4 sm:py-6 ${theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                >
                    No new notifications
                </p>
            ) : (
                <div className="space-y-3 sm:space-y-4">
                    {notifications.map((notification) => (
                        <div
                            key={notification._id}
                            className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 sm:p-4 md:p-5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.01] backdrop-blur-md border border-opacity-20 border-white/10 ${theme === "dark"
                                    ? "bg-gray-800/90 text-gray-200 hover:bg-gray-700/90"
                                    : "bg-gray-200/90 text-gray-800 hover:bg-gray-300/90"
                                }`}
                            style={{
                                background: theme === "dark"
                                    ? "linear-gradient(145deg, rgba(31, 41, 55, 0.9), rgba(17, 24, 39, 0.7))"
                                    : "linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(243, 244, 246, 0.7))",
                            }}
                        >
                            <div className="mb-2 sm:mb-0">
                                <p className="text-xs sm:text-sm md:text-base font-medium">
                                    {notification.message}
                                </p>
                                <span
                                    className={`text-xs sm:text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                                        }`}
                                >
                                    {new Date(notification.createdAt).toLocaleString()}
                                </span>
                            </div>
                            {!notification.isRead && (
                                <button
                                    className={`px-2 sm:px-3 md:px-4 py-1 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 hover:scale-105 ${theme === "dark"
                                            ? "bg-blue-600 text-white hover:bg-blue-500"
                                            : "bg-blue-500 text-white hover:bg-blue-600"
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