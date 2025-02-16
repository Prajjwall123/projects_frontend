import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getCompanyById } from "../utils/companyHelpers";
import { FaHome, FaProjectDiagram, FaEnvelope, FaUser, FaSearch, FaBars, FaTimes, FaPlus, FaSun, FaMoon } from "react-icons/fa";
import StatsSection from "../../components/StatsSection";
import ChartsSection from "../../components/ChartsSection";
import PostProjectForm from "../../components/PostProjectForm";
import ProjectsSection from "../../components/ProjectsSection";
import CompanyProfile from "../../components/companyProfile";
import BiddingSection from "../../components/BiddingSection";
import logo from "../../assets/logo.png";

const CompanyDashboard = () => {
    const navigate = useNavigate();
    const { companyId } = useParams();
    const [selectedBidId, setSelectedBidId] = useState(null);
    const [company, setCompany] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("dashboard");
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log(companyId);
        if (!companyId) return;

        const fetchCompanyData = async () => {
            try {
                setLoading(true);
                const companyData = await getCompanyById(companyId);
                setCompany(companyData);
                setError(null);
            } catch (error) {
                console.error("Error fetching company data:", error);
                setError("Failed to load company data. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyData();
    }, [companyId]);

    useEffect(() => {
        document.documentElement.className = theme;
        localStorage.setItem("theme", theme);
    }, [theme]);

    const handleOpenBidSection = (bidId) => {
        setSelectedBidId(bidId);  // Store the bid ID
        setActiveSection("biddingSection");  // Switch to the Bidding Section
        console.log("set the active section to bidding with the id:", bidId);
    };

    const handleThemeToggle = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    if (loading) {
        return <div className="h-screen flex justify-center items-center text-xl">Loading company data...</div>;
    }

    if (error) {
        return (
            <div className="h-screen flex flex-col justify-center items-center text-xl">
                <p>{error}</p>
                <button onClick={() => navigate("/")} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Go to Home</button>
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
                {company && (
                    <div className="flex items-center justify-center mb-6">
                        <img src={logo} alt="Company Logo" className="h-12 w-auto" />
                    </div>
                )}
                <ul className="space-y-4">
                    <li className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-700 ${activeSection === "dashboard" ? "bg-gray-700" : ""}`} onClick={() => setActiveSection("dashboard")}>
                        <FaHome className="text-xl" />
                        <span>Dashboard</span>
                    </li>
                    <li className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-700 ${activeSection === "projects" ? "bg-gray-700" : ""}`} onClick={() => setActiveSection("projects")}>
                        <FaProjectDiagram className="text-xl" />
                        <span>Your Projects</span>
                    </li>
                    <li className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-700">
                        <FaEnvelope className="text-xl" />
                        <span>Messages</span>
                    </li>
                    <li className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-700 ${activeSection === "companyProfile" ? "bg-gray-700" : ""}`} onClick={() => setActiveSection("companyProfile")}>
                        <FaUser className="text-xl" />
                        <span>Company Profile</span>
                    </li>
                </ul>
                <div className="absolute bottom-6 left-6 right-6">
                    <button className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition" onClick={() => setActiveSection("postProject")}>
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
                        <StatsSection company={company} theme={theme} />
                        <ChartsSection />
                    </>
                )}
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

export default CompanyDashboard;
