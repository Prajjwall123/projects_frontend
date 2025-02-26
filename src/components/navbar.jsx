import React, { useState } from "react";
import { FaSun, FaMoon, FaBell } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import logo from "../assets/logo.png";
import defaultProfilePicture from "../assets/default_profile_picture.jpg";
import { logoutUser, getUserProfile } from "../core/utils/authHelpers";
import { useNavigate } from "react-router-dom";
import { fetchNotifications, markNotificationAsRead } from "../core/utils/notificationHelpers";

const Navbar = ({ theme, toggleTheme }) => {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const { data: profile } = useQuery({
        queryKey: ["userProfile"],
        queryFn: getUserProfile,
        retry: false,
    });

    const avatarUrl = profile?.profile
        ? `http://localhost:3000/${profile.role === "freelancer" ? profile.profile.profileImage : profile.profile.logo
        }`
        : defaultProfilePicture;

    const userId = profile?.profile?._id;
    const userType = profile?.role === "freelancer" ? "Freelancer" : "Company";


    const { data: notifications = [], refetch } = useQuery({
        queryKey: ["notifications", userId, userType],
        queryFn: () => fetchNotifications(userId, userType),
        enabled: !!userId && !!userType,
    });

    const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

    const handleMarkAsRead = async (notificationId) => {
        await markNotificationAsRead(notificationId);
        refetch();
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");

        navigate(`/login`);
        window.location.reload();
    };

    const handleProfileClick = () => {
        if (!profile) return;
        if (profile.role === "freelancer" && userId) {
            navigate(`/freelancer/${userId}`);
        } else if (profile.role === "company" && userId) {
            navigate(`/company/${userId}`);
        }
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="navbar sticky top-0 z-50 bg-black text-white shadow-lg border-b border-gray-800">
            <div className="navbar-start">
                <a href="/" className="btn btn-ghost text-xl">
                    <img src={logo} alt="Logo" className="h-10" />
                </a>
            </div>

            <div className="flex-none">
                <ul className="menu menu-horizontal px-1 font-sans">
                    <li>
                        <details>
                            <summary className="text-white font-bold">Find Projects</summary>
                            <ul className="bg-black text-white border border-gray-800 rounded-t-none p-2">
                                <li><a>App Development</a></li>
                                <li><a>Web Development</a></li>
                            </ul>
                        </details>
                    </li>
                    <li>
                        <details>
                            <summary className="text-white font-bold">Find Freelancers</summary>
                            <ul className="bg-black text-white border border-gray-800 rounded-t-none p-2">
                                <li><a>Top Rated</a></li>
                                <li><a>Best Performers</a></li>
                            </ul>
                        </details>
                    </li>
                    <li><a className="text-white font-bold">About Us</a></li>
                </ul>
            </div>

            <div className="navbar-end flex items-center gap-2">
                <button onClick={toggleTheme} className="btn btn-outline text-white border-white flex items-center justify-center gap-2">
                    {theme === "dark" ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-blue-400" />}
                </button>

                <div className="relative">
                    <button onClick={toggleDropdown} className="relative flex items-center justify-center p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700">
                        <FaBell className="w-6 h-6" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-96 bg-gray-900 text-white border border-gray-800 shadow-lg rounded-lg overflow-hidden">
                            <div className="p-4">
                                <h3 className="text-lg font-semibold border-b pb-2">Notifications</h3>

                                {notifications.length === 0 ? (
                                    <p className="text-gray-400 text-center text-sm py-4">No new notifications</p>
                                ) : (
                                    <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                                        {notifications.map(notification => (
                                            <div
                                                key={notification._id}
                                                className="flex items-start justify-between p-3 bg-gray-800 hover:bg-gray-700 transition border-b border-gray-700"
                                            >
                                                <div className="flex flex-col">
                                                    <p className="text-gray-300 text-sm font-medium">
                                                        {notification.message}
                                                    </p>
                                                    <span className="text-xs text-gray-500 mt-1">
                                                        {new Date(notification.createdAt).toLocaleString()}
                                                    </span>
                                                </div>
                                                <button
                                                    className="text-xs font-semibold text-blue-400 hover:text-blue-500 transition"
                                                    onClick={() => handleMarkAsRead(notification._id)}
                                                >
                                                    Mark as Read
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="form-control">
                    <input
                        type="text"
                        placeholder="Search Projects"
                        className="input input-bordered bg-gray-800 text-white border-gray-700 w-24 md:w-auto"
                    />
                </div>

                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800">
                            <img alt="Avatar" src={avatarUrl} className="object-cover w-full h-full" />
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-gray-900 text-white border border-gray-800 rounded-lg z-[1] mt-3 w-52 p-2 shadow-lg"
                    >
                        <li><a onClick={handleProfileClick}>Profile</a></li>
                        <li><a onClick={handleLogout}>Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
