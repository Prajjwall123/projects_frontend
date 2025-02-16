import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import { FaMapMarkerAlt, FaIndustry, FaGlobe, FaUserTie, FaCalendarAlt, FaBuilding, FaCommentDots } from "react-icons/fa";
import { getCompanyById } from "../utils/companyHelpers";
import Footer from "../../components/footer";

const CompanyView = ({ theme, toggleTheme }) => {
    const { companyId } = useParams();
    const navigate = useNavigate();
    const [companyDetails, setCompanyDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCompanyDetails = async () => {
            try {
                const companyData = await getCompanyById(companyId);
                setCompanyDetails(companyData);
            } catch (error) {
                console.error("Error fetching company details:", error);
                navigate("/");
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyDetails();
    }, [companyId, navigate]);

    return (
        <div className={`${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"} min-h-screen`}>
            <Navbar theme={theme} toggleTheme={toggleTheme} />
            <div className="container mx-auto p-8">
                <div className={`p-8 rounded-lg shadow-md mb-12 ${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}>
                    <h2 className="text-3xl font-bold mb-6">About the Company</h2>
                    {loading ? (
                        <p>Loading company details...</p>
                    ) : companyDetails ? (
                        <div>
                            <div className="flex items-center mb-8">
                                <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 shadow-md">
                                    <img
                                        src={`http://localhost:3000/${companyDetails.logo}`}
                                        alt="Company Logo"
                                        className="absolute top-0 left-0 w-full h-full object-cover"
                                    />
                                </div>
                                <div className="ml-8 flex items-center">
                                    <div>
                                        <h1 className="text-2xl font-bold flex items-center">
                                            {companyDetails.companyName}
                                            <div
                                                className={`ml-3 cursor-pointer transition-colors duration-200 ${theme === "dark" ? "text-white hover:text-gray-300" : "text-blue-600 hover:text-blue-800"
                                                    }`}
                                                onClick={() => alert(`Chat with Company ID: ${companyDetails._id}`)}
                                            >
                                                <FaCommentDots className="text-3xl" />
                                            </div>
                                        </h1>
                                        <p className={`flex items-center mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                                            <FaMapMarkerAlt className="mr-2 text-blue-600" /> {companyDetails.headquarters || "N/A"}
                                        </p>
                                        <p className="mt-4">{companyDetails.companyBio || "No company bio available."}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                                <div className={`p-6 rounded-lg shadow-md text-center ${theme === "dark" ? "bg-blue-800 text-blue-200" : "bg-blue-100 text-blue-800"}`}>
                                    <h3 className="text-xl font-semibold">Projects Posted</h3>
                                    <p className="text-2xl font-bold">{companyDetails.projectsPosted}</p>
                                </div>
                                <div className={`p-6 rounded-lg shadow-md text-center ${theme === "dark" ? "bg-green-800 text-green-200" : "bg-green-100 text-green-800"}`}>
                                    <h3 className="text-xl font-semibold">Projects Awarded</h3>
                                    <p className="text-2xl font-bold">{companyDetails.projectsAwarded}</p>
                                </div>
                                <div className={`p-6 rounded-lg shadow-md text-center ${theme === "dark" ? "bg-yellow-800 text-yellow-200" : "bg-yellow-100 text-yellow-800"}`}>
                                    <h3 className="text-xl font-semibold">Projects Completed</h3>
                                    <p className="text-2xl font-bold">{companyDetails.projectsCompleted}</p>
                                </div>
                            </div>

                            <div className={`p-6 rounded-lg shadow-md ${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"}`}>
                                <h3 className="text-xl font-bold mb-4">Company Information</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-center">
                                        <FaCalendarAlt className="text-blue-600 mr-2" />
                                        <strong className="mr-2">Founded:</strong> {companyDetails.founded || "N/A"}
                                    </li>
                                    <li className="flex items-center">
                                        <FaUserTie className="text-green-600 mr-2" />
                                        <strong className="mr-2">CEO:</strong> {companyDetails.ceo || "N/A"}
                                    </li>
                                    <li className="flex items-center">
                                        <FaUserTie className="text-red-600 mr-2" />
                                        <strong className="mr-2">Employees:</strong> {companyDetails.employees || "N/A"}
                                    </li>
                                    <li className="flex items-center">
                                        <FaBuilding className="text-yellow-600 mr-2" />
                                        <strong className="mr-2">Industry:</strong> {companyDetails.industry || "N/A"}
                                    </li>
                                    <li className="flex items-center">
                                        <FaGlobe className="text-red-600 mr-2" />
                                        <strong className="mr-2">Website:</strong>
                                        {companyDetails.website ? (
                                            <a
                                                href={companyDetails.website.startsWith("http") ? companyDetails.website : `http://${companyDetails.website}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 underline hover:text-blue-800"
                                            >
                                                {companyDetails.website}
                                            </a>
                                        ) : (
                                            "N/A"
                                        )}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <p>Company details not found.</p>
                    )}
                </div>
            </div>
            <Footer theme={theme} />
        </div>
    );
};

export default CompanyView;
