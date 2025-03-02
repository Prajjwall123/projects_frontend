import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getFreelancerById } from "../utils/freelancerHelpers";
import {
    FaHome,
    FaProjectDiagram,
    FaEnvelope,
    FaUser,
    FaSearch,
    FaBars,
    FaTimes,
    FaSun,
    FaMoon,
    FaBell,
    FaPlus,
    FaWallet,
} from "react-icons/fa";
import logo from "../../assets/logo.png";
import SearchBar from "../../components/SearchBar";
import FreelancerProfile from "../../components/FreelancerProfile";
import { fetchNotifications, markNotificationAsRead } from "../utils/notificationHelpers";
import FreelancerProjects from "./projects";
import NotificationsSection from "../private/admin/notifications/NotificationsSection";
import Bank from "./Bank";

const FreelancerDashboard = () => {
    const navigate = useNavigate();
    const { freelancerId } = useParams();
    const [selectedBidId, setSelectedBidId] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("projects");
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    const { data: freelancer, isLoading, error } = useQuery({
        queryKey: ["freelancer", freelancerId],
        queryFn: () => getFreelancerById(freelancerId),
        enabled: !!freelancerId,
        retry: false,
    });

    const { data: notifications = [], refetch } = useQuery({
        queryKey: ["notifications", freelancerId],
        queryFn: () => fetchNotifications(freelancerId, "Freelancer"),
        enabled: !!freelancerId,
    });

    const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

    const handleMarkAsRead = async (notificationId) => {
        await markNotificationAsRead(notificationId);
        refetch();
    };

    useEffect(() => {
        document.documentElement.className = theme;
        localStorage.setItem("theme", theme);
        localStorage.setItem("freelancerId", freelancerId);
    }, [theme]);

    const handleOpenBidSection = (bidId) => {
        setSelectedBidId(bidId);
        setActiveSection("biddingSection");
    };

    const handleThemeToggle = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    if (isLoading) {
        return (
            <div className="h-screen flex justify-center items-center text-xl">
                Loading freelancer data...
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen flex flex-col justify-center items-center text-xl">
                <p>Failed to load freelancer data. Please try again.</p>
                <button
                    onClick={() => navigate("/")}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200"
                >
                    Go to Home
                </button>
            </div>
        );
    }

    return (
        <div
            className={`flex h-screen ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
                }`}
        >
            <div
                className={`fixed md:relative bg-black text-white w-3/4 sm:w-2/3 md:w-1/5 p-4 sm:p-6 transition-transform transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } md:translate-x-0 h-screen overflow-y-auto shadow-2xl z-50 backdrop-blur-md border-r border-gray-800/50`}
                style={{
                    background: "linear-gradient(145deg, rgba(0, 0, 0, 0.9), rgba(17, 24, 39, 0.7))",
                }}
            >
                <button
                    className="absolute top-4 right-4 md:hidden text-gray-300 hover:text-white transition-colors"
                    onClick={() => setIsSidebarOpen(false)}
                >
                    <FaTimes className="text-xl sm:text-2xl" />
                </button>

                <div className="flex items-center justify-center mb-4 sm:mb-6 md:mb-8">
                    <img src={logo} alt="Logo" className="h-10 sm:h-12 w-auto" />
                </div>

                <ul className="space-y-2 sm:space-y-3">
                    <li
                        className={`flex items-center space-x-3 cursor-pointer p-2 sm:p-3 rounded-lg transition-all duration-200 hover:bg-gray-700/80 ${activeSection === "projects" ? "bg-gray-700" : ""
                            }`}
                        onClick={() => setActiveSection("projects")}
                    >
                        <FaHome className="text-lg sm:text-xl" />
                        <span className="text-sm sm:text-base">Dashboard</span>
                    </li>

                    <li
                        className={`flex items-center space-x-3 cursor-pointer p-2 sm:p-3 rounded-lg transition-all duration-200 hover:bg-gray-700/80 ${activeSection === "notifications" ? "bg-gray-700" : ""
                            }`}
                        onClick={() => setActiveSection("notifications")}
                    >
                        <FaBell className="text-lg sm:text-xl" />
                        <span className="text-sm sm:text-base">Notifications</span>
                        {unreadCount > 0 && (
                            <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </li>

                    <li
                        className={`flex items-center space-x-3 cursor-pointer p-2 sm:p-3 rounded-lg transition-all duration-200 hover:bg-gray-700/80 ${activeSection === "Bank" ? "bg-gray-700" : ""
                            }`}
                        onClick={() => setActiveSection("Bank")}
                    >
                        <FaWallet className="text-lg sm:text-xl" />
                        <span className="text-sm sm:text-base">Wallet</span>
                    </li>

                    <li
                        className={`flex items-center space-x-3 cursor-pointer p-2 sm:p-3 rounded-lg transition-all duration-200 hover:bg-gray-700/80 ${activeSection === "profile" ? "bg-gray-700" : ""
                            }`}
                        onClick={() => setActiveSection("profile")}
                    >
                        <FaUser className="text-lg sm:text-xl" />
                        <span className="text-sm sm:text-base">My Profile</span>
                    </li>
                </ul>
            </div>

            <div className="flex-1 h-screen overflow-y-auto p-3 sm:p-4 md:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6">
                    <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                        <button
                            className="md:hidden text-xl sm:text-2xl text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <FaBars />
                        </button>
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight">
                            Hello {freelancer ? freelancer.freelancerName : "Freelancer"}
                        </h2>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
                        <button
                            className={`flex items-center justify-center p-2 sm:p-3 rounded-lg text-sm sm:text-base transition-all duration-200 hover:scale-105 ${theme === "dark"
                                ? "bg-gray-700 text-white hover:bg-gray-600"
                                : "bg-gray-200 text-black hover:bg-gray-300"
                                }`}
                            onClick={handleThemeToggle}
                        >
                            {theme === "dark" ? (
                                <>
                                    <FaSun className="text-yellow-400 mr-1 sm:mr-2" />
                                    <span>Light Mode</span>
                                </>
                            ) : (
                                <>
                                    <FaMoon className="text-blue-400 mr-1 sm:mr-2" />
                                    <span>Dark Mode</span>
                                </>
                            )}
                        </button>

                        <button
                            className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-sm sm:text-base font-semibold transition-all duration-200 hover:scale-105 ${theme === "dark"
                                ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                }`}
                            onClick={() => navigate("/login")}
                        >
                            Sign Out
                        </button>
                    </div>
                </div>

                <div className="w-full mb-4 sm:mb-6">
                    <SearchBar theme={theme} />
                </div>

                <div className="transition-opacity duration-300">
                    {activeSection === "projects" && <FreelancerProjects freelancerId={freelancerId} theme={theme} />}
                    {activeSection === "Bank" && <Bank freelancerId={freelancerId} />}
                    {activeSection === "notifications" && (
                        <NotificationsSection notifications={notifications} onMarkAsRead={handleMarkAsRead} theme={theme} />
                    )}
                    {activeSection === "profile" && <FreelancerProfile freelancerId={freelancerId} />}
                </div>
            </div>
        </div>
    );
};

export default FreelancerDashboard;