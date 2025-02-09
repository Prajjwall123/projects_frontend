import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCompanyById } from "../utils/companyHelpers";
import Navbar from "../../components/navbar";
import { FaMapMarkerAlt, FaCalendarAlt, FaBriefcase, FaCheck, FaListAlt } from "react-icons/fa";

const ProjectDetails = ({ theme, toggleTheme }) => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const project = state?.project;
    const [companyDetails, setCompanyDetails] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [bidAmount, setBidAmount] = useState("");
    const [bidMessage, setBidMessage] = useState("");

    useEffect(() => {
        if (!project) {
            navigate("/");
            return;
        }

        const fetchCompanyDetails = async () => {
            try {
                const companyData = await getCompanyById(project.company._id);
                setCompanyDetails(companyData);
            } catch (error) {
                console.error("Error fetching company details:", error);
            }
        };

        fetchCompanyDetails();
    }, [project, navigate]);

    const formatRequirements = (requirements) => {
        if (!requirements) return "None specified.";
        return requirements.split("\n").map((req, index) => (
            <li key={index} className="mb-1">
                {req}
            </li>
        ));
    };

    const handleBid = () => {
        alert(`Bid on the project: ${project._id}\nAmount: ${bidAmount}\nMessage: ${bidMessage}`);
        setShowModal(false);
    };


    const renderCategories = (categories) => {
        if (!categories) return "N/A";

        if (Array.isArray(categories)) {
            return categories.map((category, index) => (
                <span
                    key={index}
                    className="bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 text-sm px-3 py-1 rounded-full mr-2 mb-2 inline-block"
                >
                    {category}
                </span>
            ));
        }

        if (typeof categories === "string") {
            return categories.split(",").map((category, index) => (
                <span
                    key={index}
                    className="bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 text-sm px-3 py-1 rounded-full mr-2 mb-2 inline-block"
                >
                    {category.trim()}
                </span>
            ));
        }

        return "N/A";
    };

    return (
        <div className={`${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"} min-h-screen`}>
            <Navbar theme={theme} toggleTheme={toggleTheme} />
            <div className="container mx-auto p-8">
                {/* About the Company Section */}
                <div className={`p-8 rounded-lg shadow-md mb-12 ${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}>
                    <h2 className="text-3xl font-bold mb-6">About the Company</h2>
                    {companyDetails ? (
                        <div className="flex items-center mb-8">
                            <img
                                src={companyDetails.logo ? `http://localhost:3000/${companyDetails.logo}` : "/defaultLogo.png"}
                                alt="Company Logo"
                                className="w-36 h-36 object-cover rounded-full shadow-lg"
                            />
                            <div className="ml-8">
                                <h1 className="text-2xl font-bold">{companyDetails.companyName}</h1>
                                <p className={`flex items-center mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                                    <FaMapMarkerAlt className="mr-2 text-blue-600" /> {companyDetails.headquarters || "N/A"}
                                </p>
                                <p className="mt-4">{companyDetails.companyBio || "No company bio available."}</p>
                            </div>
                        </div>
                    ) : (
                        <p>Loading company details...</p>
                    )}

                    {/* Company Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className={`p-6 rounded-lg shadow-md text-center ${theme === "dark" ? "bg-blue-800 text-blue-200" : "bg-blue-100 text-blue-800"}`}>
                            <FaBriefcase className="text-4xl mb-4" />
                            <h3 className="text-xl font-semibold">Projects Posted</h3>
                            <p className="text-2xl font-bold">{companyDetails?.projectsPosted || 0}</p>
                        </div>
                        <div className={`p-6 rounded-lg shadow-md text-center ${theme === "dark" ? "bg-green-800 text-green-200" : "bg-green-100 text-green-800"}`}>
                            <FaCheck className="text-4xl mb-4" />
                            <h3 className="text-xl font-semibold">Projects Awarded</h3>
                            <p className="text-2xl font-bold">{companyDetails?.projectsAwarded || 0}</p>
                        </div>
                        <div className={`p-6 rounded-lg shadow-md text-center ${theme === "dark" ? "bg-yellow-800 text-yellow-200" : "bg-yellow-100 text-yellow-800"}`}>
                            <FaCalendarAlt className="text-4xl mb-4" />
                            <h3 className="text-xl font-semibold">Projects Completed</h3>
                            <p className="text-2xl font-bold">{companyDetails?.projectsCompleted || 0}</p>
                        </div>
                    </div>
                </div>

                <div className={`p-8 rounded-lg shadow-md ${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}>
                    <h2 className="text-3xl font-bold mb-6">About the Project</h2>
                    <p className={`mb-6 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>{project.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className={`flex items-center p-4 rounded-lg ${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"}`}>
                            <FaCalendarAlt className="text-blue-600 text-2xl mr-4" />
                            <div>
                                <strong>Posted Date:</strong>
                                <p>{new Date(project.postedDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className={`flex items-center p-4 rounded-lg ${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"}`}>
                            <FaBriefcase className="text-green-600 text-2xl mr-4" />
                            <div>
                                <strong>Duration:</strong>
                                <p>{project.duration || "N/A"}</p>
                            </div>
                        </div>
                        <div className={`flex items-center p-4 rounded-lg ${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"}`}>
                            <FaListAlt className="text-yellow-600 text-2xl mr-4" />
                            <div>
                                <strong>Categories:</strong>
                                <div className="mt-2">{renderCategories(project.category)}</div>
                            </div>
                        </div>
                        <div className={`flex items-center p-4 rounded-lg ${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"}`}>
                            <FaCheck className="text-red-600 text-2xl mr-4" />
                            <div>
                                <strong>Status:</strong>
                                <p>{project.status || "N/A"}</p>
                            </div>
                        </div>
                    </div>
                    <h3 className="text-xl font-bold mb-4">Requirements</h3>
                    <ul className={`list-disc pl-6 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                        {formatRequirements(project.requirements)}
                    </ul>

                    {/* Bid Button */}
                    <div className="mt-10 text-center">
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md text-lg"
                        >
                            Bid
                        </button>
                    </div>
                </div>

                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className={`p-8 rounded-lg shadow-md w-full max-w-lg ${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}>
                            <h2 className="text-2xl font-bold mb-4">Place Your Bid</h2>

                            <div className="mb-4">
                                <label className="block font-semibold mb-2">Your Bidding Amount</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">NRs</span>
                                    <input
                                        type="number"
                                        className={`w-full pl-12 border rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 
                        ${theme === "dark" ? "bg-white text-black" : "bg-white text-black"}`}
                                        placeholder="Enter your bidding amount"
                                        value={bidAmount}
                                        onChange={(e) => setBidAmount(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block font-semibold mb-2">Message To The Company</label>
                                <textarea
                                    className={`w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 
                    ${theme === "dark" ? "bg-white text-black" : "bg-white text-black"}`}
                                    placeholder="Enter your message"
                                    value={bidMessage}
                                    onChange={(e) => setBidMessage(e.target.value)}
                                />
                            </div>


                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleBid}
                                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                                >
                                    Bid
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
export default ProjectDetails;
