import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCompanyById } from "../utils/companyHelpers";
import { Line, Bar } from "recharts";
import { FaClipboardList, FaCheckCircle, FaBars, FaTimes } from "react-icons/fa";

const CompanyDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [companyId, setCompanyId] = useState(null);
    const [company, setCompany] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (location.state && location.state.companyId) {
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
        <div className="flex flex-col md:flex-row h-screen bg-gray-100">
            {/* Mobile Sidebar Toggle */}
            <div className="md:hidden p-4 flex justify-between items-center">
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-black text-2xl">
                    {isSidebarOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {/* Sidebar */}
            <div className={`fixed md:static top-0 left-0 h-full bg-black text-white p-6 transition-transform transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 w-3/4 md:w-1/5 z-50`}>
                <button onClick={() => setIsSidebarOpen(false)} className="text-white text-2xl absolute top-4 right-4 md:hidden">
                    <FaTimes />
                </button>
                <h1 className="text-xl font-bold mb-6">Projects Yeti</h1>
                <ul className="space-y-4">
                    <li className="flex items-center space-x-2 cursor-pointer hover:text-gray-300" onClick={() => setIsSidebarOpen(false)}>
                        <FaClipboardList />
                        <span>Dashboard</span>
                    </li>
                    <li className="flex items-center space-x-2 cursor-pointer hover:text-gray-300" onClick={() => setIsSidebarOpen(false)}>
                        <FaClipboardList />
                        <span>Current Projects</span>
                    </li>
                    <li className="flex items-center space-x-2 cursor-pointer hover:text-gray-300" onClick={() => setIsSidebarOpen(false)}>
                        <FaClipboardList />
                        <span>Messages</span>
                    </li>
                    <li className="flex items-center space-x-2 cursor-pointer hover:text-gray-300" onClick={() => setIsSidebarOpen(false)}>
                        <FaClipboardList />
                        <span>Settings</span>
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6" onClick={() => setIsSidebarOpen(false)}>
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <h2 className="text-2xl font-bold">Hello {company ? company.companyName : "Company"} 👋</h2>
                    <button className="bg-black text-white px-4 py-2 rounded mt-4 md:mt-0">Sign Out</button>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-white p-6 rounded shadow flex items-center space-x-4">
                        <FaClipboardList className="text-4xl text-green-500" />
                        <div>
                            <p className="text-xl font-bold">{company ? company.projectsPosted : "75"}</p>
                            <p className="text-gray-500">Projects Posted</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded shadow flex items-center space-x-4">
                        <FaCheckCircle className="text-4xl text-blue-500" />
                        <div>
                            <p className="text-xl font-bold">{company ? company.projectsCompleted : "70"}</p>
                            <p className="text-gray-500">Projects Completed</p>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-white p-6 rounded shadow">
                        <h3 className="text-lg font-bold">Total Project Value</h3>
                        <p className="text-xl font-bold">90,000</p>
                        <p className="text-green-500">⬆ 15% Increase</p>
                        <Bar data={[]} width={300} height={150} />
                    </div>
                    <div className="bg-white p-6 rounded shadow">
                        <h3 className="text-lg font-bold">Bids Frequency</h3>
                        <Line data={[]} width={300} height={150} />
                    </div>
                </div>

                {/* Company Profile Section */}
                {company && (
                    <div className="bg-white p-6 rounded shadow mt-6">
                        <h3 className="text-lg font-bold">Company Profile</h3>
                        <img
                            src={`http://localhost:3000/${company.logo}`}
                            alt="Company Logo"
                            className="w-32 h-32 md:w-40 md:h-40 rounded-md"
                        />
                        <p><strong>Bio:</strong> {company.companyBio}</p>
                        <p><strong>Employees:</strong> {company.employees}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyDashboard;
