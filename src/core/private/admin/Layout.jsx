import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCompanyById } from "../../utils/companyHelpers";
import { fetchNotifications, markNotificationAsRead } from "../../utils/notificationHelpers";
import { FaHome, FaProjectDiagram, FaBell, FaUser, FaSearch, FaBars, FaTimes, FaPlus, FaSun, FaMoon } from "react-icons/fa";

import PostProjectForm from "./Projects/PostProjectForm";
import ProjectsSection from "./Projects/ProjectsSection";
import BiddingSection from "./Bidding/BiddingSection";
import CompanyProfile from "./dashboard/companyProfile";
import Dashboard from "./dashboard/dashboard";
import NotificationsSection from "./notifications/NotificationsSection";
import logo from "../../../assets/logo.png";
import Navbar from "../../../components/navbar";

const Layout = () => {
    const navigate = useNavigate();
    const { companyId } = useParams();
    const [selectedBidId, setSelectedBidId] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("dashboard");
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    const userId = localStorage.getItem("userId");
    const userType = localStorage.getItem("role");

    // Fetch Notifications
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

    // Fetch Company Details
    const { data: company, isLoading, error } = useQuery({
        queryKey: ["company", companyId],
        queryFn: () => getCompanyById(companyId),
        enabled: !!companyId,
        retry: false,
    });

    // Apply Theme Changes
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
        return <div className="h-screen flex justify-center items-center text-xl">Loading company data...</div>;
    }

    if (error) {
        return (
            <div className="h-screen flex flex-col justify-center items-center text-xl">
                <p>Failed to load company data. Please try again.</p>
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

                {/* Display Company Logo */}
                {company && (
                    <div className="flex items-center justify-center mb-6">
                        <img src={logo} alt="Company Logo" className="h-12 w-auto" />
                    </div>
                )}

                {/* Sidebar Navigation */}
                <ul className="space-y-4">
                    <li
                        className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-700 ${activeSection === "dashboard" ? "bg-gray-700" : ""
                            }`}
                        onClick={() => setActiveSection("dashboard")}
                    >
                        <FaHome className="text-xl" />
                        <span>Dashboard</span>
                    </li>

                    <li
                        className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-700 ${activeSection === "projects" ? "bg-gray-700" : ""
                            }`}
                        onClick={() => setActiveSection("projects")}
                    >
                        <FaProjectDiagram className="text-xl" />
                        <span>Your Projects</span>
                    </li>

                    <li
                        className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-700 ${activeSection === "notifications" ? "bg-gray-700" : ""
                            }`}
                        onClick={() => setActiveSection("notifications")}
                    >
                        <FaBell className="text-xl" />
                        <span>Notifications</span>
                        {unreadCount > 0 && (
                            <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </li>

                    <li
                        className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-700 ${activeSection === "companyProfile" ? "bg-gray-700" : ""
                            }`}
                        onClick={() => setActiveSection("companyProfile")}
                    >
                        <FaUser className="text-xl" />
                        <span>Company Profile</span>
                    </li>
                </ul>

                {/* Post New Project Button */}
                <div className="absolute bottom-6 left-6 right-6">
                    <button
                        className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
                        onClick={() => setActiveSection("postProject")}
                    >
                        <FaPlus className="inline-block mr-2" />
                        Post New Project
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 h-screen overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <button className="md:hidden text-2xl" onClick={() => setIsSidebarOpen(true)}>
                        <FaBars />
                    </button>
                    <h2 className="text-2xl font-bold">Hello {company ? company.companyName : "Company"}</h2>
                    <div className="flex items-center space-x-4">
                        <button onClick={handleThemeToggle} className="text-2xl">
                            {theme === "light" ? <FaMoon /> : <FaSun />}
                        </button>
                        <button onClick={() => navigate("/login")} className="bg-black text-white px-4 py-2 rounded">
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="flex items-center bg-white p-3 rounded shadow-md mb-6">
                    <FaSearch className="text-gray-500 mr-2" />
                    <input type="text" placeholder="Find Freelancers..." className="w-full outline-none" />
                </div>

                {/* Dynamic Content */}
                {activeSection === "dashboard" && (
                    <>
                        <Dashboard company={company} theme={theme} />
                    </>
                )}
                {activeSection === "notifications" && <NotificationsSection notifications={notifications} onMarkAsRead={handleMarkAsRead} />}

                {activeSection === "postProject" && (
                    <div className={`min-h-screen p-6 rounded shadow ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
                        <h2 className="text-2xl font-bold mb-4">Post a New Project</h2>
                        <PostProjectForm companyId={companyId} onProjectCreated={() => setActiveSection("projects")} theme={theme} />
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
                    <BiddingSection bidId={selectedBidId} theme={theme} onClose={() => setActiveSection("projects")} />
                )}
                {activeSection === "companyProfile" && (
                    <div className={`min-h-screen p-6 rounded shadow ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
                        <h2 className="text-2xl font-bold mb-4">Edit Company Profile</h2>
                        <CompanyProfile
                            companyId={companyId}
                            onProfileUpdated={() => navigate("/company", { state: { activeSection: "companyProfile" } })}
                        />
                    </div>
                )}

            </div>
        </div >
    );
};

export default Layout;
