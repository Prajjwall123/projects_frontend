import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getFreelancerById } from "../utils/freelancerHelpers";
import { FaHome, FaProjectDiagram, FaEnvelope, FaUser, FaSearch, FaBars, FaTimes, FaSun, FaMoon, FaBell, FaPlus, FaWallet } from "react-icons/fa";
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
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("projects");
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    const { data: freelancer, isLoading, error } = useQuery({
        queryKey: ["freelancer", freelancerId],
        queryFn: () => getFreelancerById(freelancerId),
        enabled: !!freelancerId,
        retry: false,
    });

    React.useEffect(() => {
        document.documentElement.className = theme;
        localStorage.setItem("theme", theme);
        localStorage.setItem("freelancerId", freelancerId);
    }, [theme]);

    const handleOpenBidSection = (bidId) => {
        setSelectedBidId(bidId);
        setActiveSection("biddingSection");
    };

    const { data: notifications = [], refetch } = useQuery({
        queryKey: ["notifications", freelancerId],
        queryFn: () => fetchNotifications(freelancerId, "Freelancer"),
        enabled: !!freelancerId,
    });

    const unreadCount = notifications?.filter(n => !n.isRead).length || 0;

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
                    <li
                        className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-700 ${activeSection === "projects" ? "bg-gray-700" : ""
                            }`}
                        onClick={() => setActiveSection("projects")}
                    >
                        <FaHome className="text-xl" />
                        <span>Dashboard</span>
                    </li>

                    {/* <li
                        className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-700 ${activeSection === "projects" ? "bg-gray-700" : ""
                            }`}
                        onClick={() => setActiveSection("projects")}
                    >
                        <FaProjectDiagram className="text-xl" />
                        <span>Your Projects</span>
                    </li> */}

                    {/* Notifications Section */}
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
                        className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-700 ${activeSection === "Bank" ? "bg-gray-700" : ""
                            }`}
                        onClick={() => setActiveSection("Bank")}
                    >
                        <FaWallet className="text-xl" />
                        <span>Bank</span>
                    </li>
                    <li
                        className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-700 ${activeSection === "profile" ? "bg-gray-700" : ""
                            }`}
                        onClick={() => setActiveSection("profile")}
                    >
                        <FaUser className="text-xl" />
                        <span>My Profile</span>
                    </li>
                </ul>
            </div>

            <div className="flex-1 h-screen overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <button className="md:hidden text-2xl" onClick={() => setIsSidebarOpen(true)}>
                        <FaBars />
                    </button>
                    <h2 className="text-2xl font-bold">Hello {freelancer ? freelancer.freelancerName : "Freelancer"}</h2>

                    <div className="flex items-center space-x-4">
                        <button
                            className={`flex items-center justify-center p-3 rounded-lg transition ${theme === "dark"
                                ? "bg-gray-700 text-white hover:bg-gray-600"
                                : "bg-gray-200 text-black hover:bg-gray-300"
                                }`}
                            onClick={handleThemeToggle}
                        >
                            {theme === "dark" ? (
                                <>
                                    <FaSun className="text-yellow-400 mr-2" />
                                    <span>Light Mode</span>
                                </>
                            ) : (
                                <>
                                    <FaMoon className="text-blue-400 mr-2" />
                                    <span>Dark Mode</span>
                                </>
                            )}
                        </button>

                        <button onClick={() => navigate("/login")} className="bg-black text-white px-4 py-2 rounded">
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="w-full mb-6">
                    <SearchBar />
                </div>

                {/* Dynamic Content
                {activeSection === "dashboard" && (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">Welcome to your Freelancer Dashboard</h2>
                    </div>
                )} */}
                {activeSection === "projects" && <FreelancerProjects freelancerId={freelancerId} />}
                {activeSection === "Bank" && <Bank freelancerId={freelancerId} />}
                {activeSection === "notifications" && <NotificationsSection notifications={notifications} onMarkAsRead={handleMarkAsRead} />}
                {activeSection === "profile" && <FreelancerProfile freelancerId={freelancerId} />}
            </div>
        </div>



    );
};

export default FreelancerDashboard;
