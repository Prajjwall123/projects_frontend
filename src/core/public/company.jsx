import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCompanyById } from "../utils/companyHelpers";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { FaClipboardList, FaCheckCircle, FaBars, FaTimes, FaProjectDiagram, FaEnvelope, FaCog, FaHome, FaSearch } from "react-icons/fa";

const staticBarData = [
    { name: 'Jan', value: 1000 },
    { name: 'Feb', value: 2000 },
    { name: 'Mar', value: 1500 },
    { name: 'Apr', value: 2500 },
    { name: 'May', value: 1800 },
    { name: 'Jun', value: 2200 },
];

const staticLineData = [
    { name: 'Sunday', value: 100 },
    { name: 'Monday', value: 400 },
    { name: 'Tuesday', value: 300 },
    { name: 'Wednesday', value: 200 },
    { name: 'Thursday', value: 250 },
    { name: 'Friday', value: 150 },
    { name: 'Saturday', value: 400 },
];

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
            {/* Sidebar */}
            <div className={`fixed md:static top-0 left-0 h-full bg-black text-white p-6 transition-transform transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 w-3/4 md:w-1/5 z-50 shadow-lg`}>
                {company && (
                    <div className="flex items-center justify-center mb-6">
                        <img src={`http://localhost:3000/${company.logo}`} alt="Company Logo" className="h-12 w-auto" />
                    </div>
                )}
                <ul className="space-y-4">
                    <li className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-700">
                        <FaHome className="text-xl" />
                        <span>Dashboard</span>
                    </li>
                    <li className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-700">
                        <FaProjectDiagram className="text-xl" />
                        <span>Current Projects</span>
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
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-2xl font-bold">Hello {company ? company.companyName : "Company"} 👋</h2>
                    </div>
                    <button className="bg-black text-white px-4 py-2 rounded">Sign Out</button>
                </div>

                {/* Search Bar */}
                <div className="flex items-center bg-white p-3 rounded shadow-md mb-6">
                    <FaSearch className="text-gray-500 mr-2" />
                    <input
                        type="text"
                        placeholder="Find Freelancers..."
                        className="w-full outline-none"
                    />
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded shadow flex flex-col items-center">
                        <p className="text-xl font-bold">{company ? company.projectsPosted : "75"}</p>
                        <p className="text-gray-500">Projects Posted</p>
                    </div>
                    <div className="bg-white p-6 rounded shadow flex flex-col items-center">
                        <p className="text-xl font-bold">{company ? company.projectsAwarded : "50"}</p>
                        <p className="text-gray-500">Projects Awarded</p>
                    </div>
                    <div className="bg-white p-6 rounded shadow flex flex-col items-center">
                        <p className="text-xl font-bold">{company ? company.projectsCompleted : "70"}</p>
                        <p className="text-gray-500">Projects Completed</p>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="bg-white p-6 rounded shadow">
                        <h3 className="text-lg font-bold mb-4">Total Project Value</h3>
                        <p className="text-xl font-bold">90,000</p>
                        <p className="text-green-500">⬆ 15% Increase</p>
                        <BarChart width={400} height={200} data={staticBarData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#FFA500" />
                        </BarChart>
                    </div>
                    <div className="bg-white p-6 rounded shadow border border-blue-400">
                        <h3 className="text-lg font-bold mb-4">Bids Frequency</h3>
                        <LineChart width={400} height={200} data={staticLineData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="#007BFF" strokeWidth={2} />
                        </LineChart>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyDashboard;