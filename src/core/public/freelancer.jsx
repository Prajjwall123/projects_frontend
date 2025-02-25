import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getFreelancerById } from "../utils/freelancerHelpers";
import { FaHome, FaProjectDiagram, FaEnvelope, FaUser, FaSearch, FaBars, FaTimes, FaSun, FaMoon, FaBell } from "react-icons/fa";
import logo from "../../assets/logo.png";
import SearchBar from "../../components/SearchBar";
import FreelancerProfile from "../../components/FreelancerProfile";
import { fetchNotifications, markNotificationAsRead } from "../utils/notificationHelpers";
import FreelancerProjects from "./projects";


const FreelancerDashboard = () => {
    const navigate = useNavigate();
    const { freelancerId } = useParams();
    const [selectedBidId, setSelectedBidId] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("dashboard");
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");


    // Fetch freelancer data using React Query
    const { data: freelancer, isLoading, error } = useQuery({
        queryKey: ["freelancer", freelancerId],
        queryFn: () => getFreelancerById(freelancerId),
        enabled: !!freelancerId,
        retry: false,
    });

    // Handle theme persistence
    React.useEffect(() => {
        document.documentElement.className = theme;
        localStorage.setItem("theme", theme);
    }, [theme]);

    const handleOpenBidSection = (bidId) => {
        setSelectedBidId(bidId);
        setActiveSection("biddingSection");
    };

    // Fetch notifications
    const { data: notifications = [], refetch } = useQuery({
        queryKey: ["notifications", freelancerId],
        queryFn: () => fetchNotifications(freelancerId, "Freelancer"),
        enabled: !!freelancerId,
    });

    // Count unread notifications
    const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

    // ✅ Mark notification as read and refetch
    const handleMarkAsRead = async (notificationId) => {
        await markNotificationAsRead(notificationId);
        refetch();
    };

    const handleThemeToggle = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    if (isLoading) {
        return <div className="h-screen flex justify-center items-center text-xl">Loading freelancer data...</div>;
    }

    if (error) {
        return (
            <div className="h-screen flex flex-col justify-center items-center text-xl">
                <p>Failed to load freelancer data. Please try again.</p>
                <button onClick={() => navigate("/")} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
                    Go to Home
                </button>
            </div>
        );
    }

    return (
        <div className={`flex h-screen ${theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-black"}`}>
            {/* Sidebar */}
            <div
                className={`fixed md:relative bg-black text-white w-3/4 md:w-1/5 p-6 transition-transform transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } md:translate-x-0 h-screen overflow-y-auto shadow-lg z-50`}
            >
                <button className="absolute top-4 right-4 md:hidden" onClick={() => setIsSidebarOpen(false)}>
                    <FaTimes className="text-2xl" />
                </button>
                <div className="flex items-center justify-center mb-6">
                    <img src={logo} alt="Logo" className="h-12 w-auto" />
                </div>
                <ul className="space-y-4">
                    <li className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-700 ${activeSection === "dashboard" ? "bg-gray-700" : ""}`} onClick={() => setActiveSection("dashboard")}>
                        <FaHome className="text-xl" />
                        <span>Dashboard</span>
                    </li>
                    <li className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-700 ${activeSection === "projects" ? "bg-gray-700" : ""}`} onClick={() => setActiveSection("projects")}>
                        <FaProjectDiagram className="text-xl" />
                        <span>My Projects</span>
                    </li>
                    <li className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-700">
                        <FaEnvelope className="text-xl" />
                        <span>Messages</span>
                    </li>
                    <li className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-700 ${activeSection === "profile" ? "bg-gray-700" : ""}`} onClick={() => setActiveSection("profile")}>
                        <FaUser className="text-xl" />
                        <span>My Profile</span>
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 h-screen overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <button className="md:hidden text-2xl" onClick={() => setIsSidebarOpen(true)}>
                        <FaBars />
                    </button>
                    <h2 className="text-2xl font-bold">Hello {freelancer ? freelancer.freelancerName : "Freelancer"}</h2>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="relative flex items-center justify-center p-2 rounded-full bg-gray-800 text-white hover:bg-gray-700">
                                <FaBell className="w-6 h-6" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-gray-300 shadow-xl rounded-lg overflow-hidden z-50">
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Notifications</h3>
                                        {notifications.length === 0 ? (
                                            <p className="text-gray-500 text-center text-sm py-4">No new notifications</p>
                                        ) : (
                                            <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                                                {notifications.map(notification => (
                                                    <div
                                                        key={notification._id}
                                                        className="flex items-start justify-between p-3 bg-gray-50 hover:bg-gray-100 transition border-b"
                                                    >
                                                        <div className="flex flex-col">
                                                            <p className="text-gray-800 text-sm font-medium">
                                                                {notification.message}
                                                            </p>
                                                            <span className="text-xs text-gray-500 mt-1">
                                                                {new Date(notification.createdAt).toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <button
                                                            className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition"
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
                        <button onClick={() => navigate("/login")} className="bg-black text-white px-4 py-2 rounded">
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="w-full mb-6">
                    <SearchBar />
                </div>

                {/* Dynamic Content */}
                {activeSection === "dashboard" && (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Welcome to your Freelancer Dashboard</h2>
                        {/* Add custom content like stats, notifications, etc. */}
                    </div>
                )}
                {activeSection === "projects" && (
                    <FreelancerProjects freelancerId={freelancerId} />)}
                {activeSection === "biddingSection" && selectedBidId && (
                    <>
                        hello</>
                )}
                {activeSection === "profile" && (
                    <FreelancerProfile freelancerId={freelancerId} />
                )}
            </div>
        </div>
    );
};

export default FreelancerDashboard;
