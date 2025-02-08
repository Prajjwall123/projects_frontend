import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCompanyById } from "../utils/companyHelpers";
import { FaHome, FaProjectDiagram, FaEnvelope, FaCog, FaSearch, FaBars, FaTimes, FaCross, FaPlus } from "react-icons/fa";
import { logoutUser } from '../utils/authHelpers';
import StatsSection from "..//../components/StatsSection";
import ChartsSection from "..//../components/ChartsSection";
import PostProjectForm from "../../components/PostProjectForm";
import ProjectsSection from "../../components/ProjectsSection";
import logo from '../../assets/logo.png';

const CompanyDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [companyId, setCompanyId] = useState(null);
    const [company, setCompany] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("dashboard");

    const handleLogout = () => {
        logoutUser();
    };

    useEffect(() => {
        if (location.state?.companyId) {
            setCompanyId(location.state.companyId);
        } else {
            navigate("/");
        }
    }, [location, navigate]);

    useEffect(() => {
        if (!companyId) return;
        const fetchCompanyData = async () => {
            try {
                const companyData = await getCompanyById(companyId);
                setCompany(companyData);
            } catch (error) {
                console.error('Error fetching company data:', error);
            }
        };
        fetchCompanyData();
    }, [companyId]);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`fixed md:relative bg-black text-white w-3/4 md:w-1/5 p-6 transition-transform transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 h-screen overflow-y-auto shadow-lg z-50`}>
                <button className="absolute top-4 right-4 md:hidden" onClick={() => setIsSidebarOpen(false)}>
                    <FaTimes className="text-2xl" />
                </button>
                {company && (
                    <div className="flex items-center justify-center mb-6">
                        <img src={logo} alt="Company Logo" className="h-12 w-auto" />
                    </div>
                )}
                <ul className="space-y-4">
                    <li
                        className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-700"
                        onClick={() => {
                            setActiveSection("dashboard");
                            window.location.reload();
                        }}
                    >
                        <FaHome className="text-xl" />
                        <span>Dashboard</span>
                    </li>

                    <li className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-700" onClick={() => setActiveSection("projects")}>
                        <FaProjectDiagram className="text-xl" />
                        <span>Your Projects</span>
                    </li>
                    <li className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-700">
                        <FaEnvelope className="text-xl" />
                        <span>Messages</span>
                    </li>
                    <li className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-700">
                        <FaCog className="text-xl" />
                        <span>Settings</span>
                    </li>
                </ul>

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
                    <button onClick={handleLogout} className="bg-black text-white px-4 py-2 rounded">Sign Out</button>
                </div>

                {/* Search Bar */}
                <div className="flex items-center bg-white p-3 rounded shadow-md mb-6">
                    <FaSearch className="text-gray-500 mr-2" />
                    <input type="text" placeholder="Find Freelancers..." className="w-full outline-none" />
                </div>

                {/* Dynamic Content */}
                {activeSection === "dashboard" && (
                    <>
                        <StatsSection company={company} />
                        <ChartsSection />
                    </>
                )}
                {activeSection === "projects" && (
                    <div className="min-h-screen">
                        <ProjectsSection companyId={companyId} />
                    </div>
                )}
                {activeSection === "postProject" && (
                    <div className="min-h-screen bg-white p-6 rounded shadow">
                        <h2 className="text-2xl font-bold mb-4">Post a New Project</h2>
                        <PostProjectForm companyId={companyId} onProjectCreated={() => setActiveSection("projects")} />
                    </div>
                )}
            </div>
        </div>
    );

};

export default CompanyDashboard;