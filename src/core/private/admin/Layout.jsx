import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCompanyById } from "../../utils/companyHelpers";
import { fetchNotifications, markNotificationAsRead } from "../../utils/notificationHelpers";
import { FaHome, FaProjectDiagram, FaBell, FaUser, FaSearch, FaBars, FaTimes, FaPlus, FaSun, FaMoon, FaWallet } from "react-icons/fa";

import PostProjectForm from "./Projects/PostProjectForm";
import ProjectsSection from "./Projects/ProjectsSection";
import BiddingSection from "./Bidding/BiddingSection";
import CompanyProfile from "./dashboard/companyProfile";
import Dashboard from "./dashboard/dashboard";
import NotificationsSection from "./notifications/NotificationsSection";
import Wallet from "./Wallet/Wallet";
import logo from "../../../assets/logo.png";
import Navbar from "../../../components/navbar";

const Layout = () => {
    const navigate = useNavigate();
    const { companyId } = useParams();
    const [selectedBidId, setSelectedBidId] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("projects");
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    const userId = localStorage.getItem("userId");
    const userType = localStorage.getItem("role");

    const { data: notifications = [], refetch } = useQuery({
        queryKey: ["notifications", userId, userType],
        queryFn: () => fetchNotifications(userId, userType),
        enabled: !!userId && !!userType,
    });

    const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

    const handleMarkAsRead = async (notificationId) => {
        await markNotificationAsRead(notificationId);
        refetch();
    };

    const { data: company, isLoading, error } = useQuery({
        queryKey: ["company", companyId],
        queryFn: () => getCompanyById(companyId),
        enabled: !!companyId,
        retry: false,
    });

    useEffect(() => {
        document.documentElement.className = theme;
        localStorage.setItem("theme", theme);
    }, [theme]);

    const handleOpenBidSection = (bidId) => {
        setSelectedBidId(bidId);
        setActiveSection("biddingSection");
        console.log("Set the active section to bidding with the id:", bidId);
    };

    const handleThemeToggle = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    if (isLoading) {
        return (
            <div className="h-screen flex justify-center items-center text-xl">
                Loading company data...
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen flex flex-col justify-center items-center text-xl">
                <p>Failed to load company data. Please try again.</p>
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
            className={`flex h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
                }`}
        >
            {/* Sidebar */}
            <div
                className={`fixed md:relative bg-black/90 text-white w-3/4 sm:w-2/3 md:w-1/5 p-4 sm:p-6 transition-transform transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } md:translate-x-0 h-screen overflow-y-auto shadow-2xl z-50 backdrop-blur-md border-r border-gray-800/50`}
                style={{
                    background: theme === "dark"
                        ? "linear-gradient(145deg, rgba(0, 0, 0, 0.9), rgba(17, 24, 39, 0.7))"
                        : "linear-gradient(145deg, rgba(31, 41, 55, 0.9), rgba(17, 24, 39, 0.7))",
                }}
            >
                <button
                    className="absolute top-4 right-4 md:hidden text-gray-300 hover:text-white transition-colors"
                    onClick={() => setIsSidebarOpen(false)}
                >
                    <FaTimes className="text-2xl" />
                </button>

                {company && (
                    <div className="flex items-center justify-center mb-6 sm:mb-8">
                        <img src={logo} alt="Company Logo" className="h-10 sm:h-12 w-auto" />
                    </div>
                )}

                <ul className="space-y-2 sm:space-y-3">
                    <li
                        className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg transition-all duration-200 hover:bg-gray-700/80 ${activeSection === "dashboard" ? "bg-gray-700" : ""
                            }`}
                        onClick={() => setActiveSection("dashboard")}
                    >
                        <FaHome className="text-lg sm:text-xl" />
                        <span className="text-sm sm:text-base">Dashboard</span>
                    </li>

                    <li
                        className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg transition-all duration-200 hover:bg-gray-700/80 ${activeSection === "projects" ? "bg-gray-700" : ""
                            }`}
                        onClick={() => setActiveSection("projects")}
                    >
                        <FaProjectDiagram className="text-lg sm:text-xl" />
                        <span className="text-sm sm:text-base">Your Projects</span>
                    </li>

                    <li
                        className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg transition-all duration-200 hover:bg-gray-700/80 ${activeSection === "notifications" ? "bg-gray-700" : ""
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
                        className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg transition-all duration-200 hover:bg-gray-700/80 ${activeSection === "companyProfile" ? "bg-gray-700" : ""
                            }`}
                        onClick={() => setActiveSection("companyProfile")}
                    >
                        <FaUser className="text-lg sm:text-xl" />
                        <span className="text-sm sm:text-base">Company Profile</span>
                    </li>

                    <li
                        className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg transition-all duration-200 hover:bg-gray-700/80 ${activeSection === "Wallet" ? "bg-gray-700" : ""
                            }`}
                        onClick={() => setActiveSection("Wallet")}
                    >
                        <FaWallet className="text-lg sm:text-xl" />
                        <span className="text-sm sm:text-base">Your Wallet</span>
                    </li>
                </ul>

                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
                    <button
                        className="w-full bg-blue-600 text-white py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                        onClick={() => setActiveSection("postProject")}
                    >
                        <FaPlus className="text-lg sm:text-xl" />
                        <span>Post New Project</span>
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 h-screen overflow-y-auto p-4 sm:p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <button
                        className="md:hidden text-2xl sm:text-3xl text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <FaBars />
                    </button>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                        Hello {company ? company.companyName : "Company"}
                    </h2>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <button
                            onClick={handleThemeToggle}
                            className="text-xl sm:text-2xl p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                        >
                            {theme === "light" ? <FaMoon /> : <FaSun />}
                        </button>
                        <button
                            onClick={() => navigate("/login")}
                            className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-sm sm:text-base font-semibold transition-all duration-200 hover:scale-105 ${theme === "dark"
                                    ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                }`}
                        >
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div
                    className={`flex items-center p-2 sm:p-3 rounded-lg shadow-md mb-4 sm:mb-6 transition-all duration-200 ${theme === "dark"
                            ? "bg-gray-800 border-gray-700"
                            : "bg-white border-gray-200"
                        } border`}
                >
                    <FaSearch
                        className={`text-lg sm:text-xl mr-2 sm:mr-3 ${theme === "dark" ? "text-gray-400" : "text-gray-500"
                            }`}
                    />
                    <input
                        type="text"
                        placeholder="Find Freelancers..."
                        className={`w-full outline-none bg-transparent text-sm sm:text-base placeholder-gray-500 dark:placeholder-gray-400 ${theme === "dark" ? "text-white" : "text-black"
                            }`}
                    />
                </div>

                {/* Content Sections */}
                <div className="transition-opacity duration-300">
                    {activeSection === "dashboard" && (
                        <Dashboard company={company} theme={theme} />
                    )}
                    {activeSection === "notifications" && (
                        <NotificationsSection
                            notifications={notifications}
                            onMarkAsRead={handleMarkAsRead}
                        />
                    )}
                    {activeSection === "postProject" && (
                        <div
                            className={`p-4 sm:p-6 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
                                }`}
                        >
                            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 tracking-tight">
                                Post a New Project
                            </h2>
                            <PostProjectForm
                                companyId={companyId}
                                onProjectCreated={() => setActiveSection("projects")}
                                theme={theme}
                            />
                        </div>
                    )}
                    {activeSection === "Wallet" && (
                        <div
                            className={`p-4 sm:p-6 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
                                }`}
                        >
                            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 tracking-tight">
                                Your Wallet
                            </h2>
                            <Wallet
                                companyId={companyId}
                                onProjectCreated={() => setActiveSection("Wallet")}
                                theme={theme}
                            />
                        </div>
                    )}
                    {activeSection === "projects" && (
                        <ProjectsSection
                            companyId={companyId}
                            theme={theme}
                            handleOpenBidSection={handleOpenBidSection}
                        />
                    )}
                    {activeSection === "biddingSection" && selectedBidId && (
                        <BiddingSection
                            bidId={selectedBidId}
                            theme={theme}
                            onClose={() => setActiveSection("projects")}
                        />
                    )}
                    {activeSection === "companyProfile" && (
                        <div
                            className={`p-4 sm:p-6 rounded-lg shadow-lg ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
                                }`}
                        >
                            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 tracking-tight">
                                Edit Company Profile
                            </h2>
                            <CompanyProfile
                                companyId={companyId}
                                onProfileUpdated={() =>
                                    navigate("/company", { state: { activeSection: "companyProfile" } })
                                }
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Layout;