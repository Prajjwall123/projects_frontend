import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCompanyById, handleUpdateProfile } from "../../../utils/companyHelpers";
import defaultLogo from "../../../../assets/default_profile_picture.jpg";
import { FaMapMarkerAlt, FaUsers, FaIndustry, FaGlobe, FaUserTie, FaCalendarAlt, FaBuilding, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CompanyProfile = ({ companyId, theme }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        companyName: "",
        companyBio: "",
        founded: "",
        ceo: "",
        headquarters: "",
        industry: "",
        employees: "",
        website: "",
        logo: "",
    });

    const { data: company, isLoading, error } = useQuery({
        queryKey: ["companyProfile", companyId],
        queryFn: () => getCompanyById(companyId),
        onSuccess: (companyData) => {
            setFormData({
                companyName: companyData.companyName || "",
                companyBio: companyData.companyBio || "",
                founded: companyData.founded || "",
                ceo: companyData.ceo || "",
                headquarters: companyData.headquarters || "",
                industry: companyData.industry || "",
                employees: companyData.employees || "",
                website: companyData.website || "",
                logo: companyData.logo || "",
            });
        },
        retry: false,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, logo: URL.createObjectURL(file) });
        }
    };

    const handleSubmitProfileUpdate = async () => {
        const response = await handleUpdateProfile(formData, companyId);
        if (response.success) {
            toast.success("Company profile updated successfully!");
            setIsModalOpen(false);
        } else {
            toast.error("Failed to update company profile. Please try again.");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-lg text-gray-600 dark:text-gray-400">
                Loading company profile...
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen text-lg text-red-500">
                Failed to load company profile. Please try again.
            </div>
        );
    }

    return (
        <div
            className={`min-h-screen p-3 sm:p-4 md:p-6 ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
                }`}
        >
            <div className="container mx-auto">
                {/* Profile Header */}
                <div className="flex flex-col sm:flex-row items-center mb-4 sm:mb-6 md:mb-8">
                    <div className="flex flex-col items-center mb-3 sm:mb-0">
                        <label htmlFor="logoInput" className="cursor-pointer">
                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 shadow-md hover:shadow-lg transition-all duration-200">
                                <img
                                    src={
                                        formData.logo.startsWith("blob:")
                                            ? formData.logo
                                            : company.logo
                                                ? `http://localhost:3000/${company.logo}`
                                                : defaultLogo
                                    }
                                    alt="Company Logo"
                                    className="absolute top-0 left-0 w-full h-full object-cover"
                                />
                            </div>
                        </label>
                        <input id="logoInput" type="file" onChange={handleImageChange} className="hidden" />
                    </div>

                    <div className="sm:ml-4 md:ml-6 text-center sm:text-left">
                        <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight">
                            {company.companyName}
                        </h1>
                        <p className="text-gray-400 dark:text-gray-500 flex items-center justify-center sm:justify-start mt-1 sm:mt-2 text-xs sm:text-sm md:text-base">
                            <FaMapMarkerAlt className="mr-1 sm:mr-2 text-blue-500 dark:text-blue-400" />
                            {company.headquarters || "N/A"}
                        </p>
                        <p className="mt-1 sm:mt-2 md:mt-4 text-gray-500 dark:text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed">
                            {company.companyBio || "No company bio available."}
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
                    <div
                        className={`p-3 sm:p-4 md:p-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 backdrop-blur-md border border-opacity-20 border-white/10 ${theme === "dark" ? "bg-blue-800/90 text-blue-100" : "bg-blue-100 text-blue-900"
                            }`}
                    >
                        <h3 className="text-sm sm:text-base md:text-lg font-semibold">Projects Posted</h3>
                        <p className="text-xl sm:text-2xl md:text-3xl font-bold mt-1 sm:mt-2">
                            {company.projectsPosted}
                        </p>
                    </div>
                    <div
                        className={`p-3 sm:p-4 md:p-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 backdrop-blur-md border border-opacity-20 border-white/10 ${theme === "dark" ? "bg-green-800/90 text-green-100" : "bg-green-100 text-green-900"
                            }`}
                    >
                        <h3 className="text-sm sm:text-base md:text-lg font-semibold">Projects Awarded</h3>
                        <p className="text-xl sm:text-2xl md:text-3xl font-bold mt-1 sm:mt-2">
                            {company.projectsAwarded}
                        </p>
                    </div>
                    <div
                        className={`p-3 sm:p-4 md:p-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 backdrop-blur-md border border-opacity-20 border-white/10 ${theme === "dark" ? "bg-yellow-800/90 text-yellow-100" : "bg-yellow-100 text-yellow-900"
                            }`}
                    >
                        <h3 className="text-sm sm:text-base md:text-lg font-semibold">Projects Completed</h3>
                        <p className="text-xl sm:text-2xl md:text-3xl font-bold mt-1 sm:mt-2">
                            {company.projectsCompleted}
                        </p>
                    </div>
                </div>

                {/* Company Information */}
                <div
                    className={`p-3 sm:p-4 md:p-6 rounded-xl shadow-lg backdrop-blur-md border border-opacity-20 border-white/10 ${theme === "dark" ? "bg-gray-800/90 text-gray-200" : "bg-gray-200/90 text-gray-700"
                        }`}
                >
                    <h3 className="text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4 md:mb-6 tracking-tight">
                        Company Information
                    </h3>
                    <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                        <li className="flex items-center text-xs sm:text-sm md:text-base">
                            <FaCalendarAlt className="text-blue-600 dark:text-blue-400 mr-1 sm:mr-2 md:mr-3" />
                            <strong className="mr-1 sm:mr-2">Founded:</strong> {company.founded || "N/A"}
                        </li>
                        <li className="flex items-center text-xs sm:text-sm md:text-base">
                            <FaUserTie className="text-green-600 dark:text-green-400 mr-1 sm:mr-2 md:mr-3" />
                            <strong className="mr-1 sm:mr-2">CEO:</strong> {company.ceo || "N/A"}
                        </li>
                        <li className="flex items-center text-xs sm:text-sm md:text-base">
                            <FaUsers className="text-red-600 dark:text-red-400 mr-1 sm:mr-2 md:mr-3" />
                            <strong className="mr-1 sm:mr-2">Employees:</strong> {company.employees || "N/A"}
                        </li>
                        <li className="flex items-center text-xs sm:text-sm md:text-base">
                            <FaBuilding className="text-yellow-600 dark:text-yellow-400 mr-1 sm:mr-2 md:mr-3" />
                            <strong className="mr-1 sm:mr-2">Industry:</strong> {company.industry || "N/A"}
                        </li>
                        <li className="flex items-center text-xs sm:text-sm md:text-base">
                            <FaGlobe className="text-red-600 dark:text-red-400 mr-1 sm:mr-2 md:mr-3" />
                            <strong className="mr-1 sm:mr-2">Website:</strong>
                            {company.website ? (
                                <a
                                    href={
                                        company.website.startsWith("http")
                                            ? company.website
                                            : `http://${company.website}`
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`underline transition-all duration-200 ${theme === "dark"
                                            ? "text-blue-400 hover:text-blue-300"
                                            : "text-blue-600 hover:text-blue-700"
                                        }`}
                                >
                                    {company.website}
                                </a>
                            ) : (
                                "N/A"
                            )}
                        </li>
                    </ul>
                </div>

                {/* Update Profile Button */}
                <div className="text-center mt-4 sm:mt-6 md:mt-8">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className={`px-3 sm:px-4 md:px-6 py-1 sm:py-2 md:py-3 rounded-lg text-sm sm:text-base md:text-lg font-semibold transition-all duration-200 hover:scale-105 ${theme === "dark"
                                ? "bg-blue-600 text-white hover:bg-blue-500"
                                : "bg-blue-500 text-white hover:bg-blue-600"
                            }`}
                    >
                        Update Profile
                    </button>
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto">
                        <div
                            className={`relative p-4 sm:p-6 md:p-8 rounded-xl shadow-xl w-full max-w-md sm:max-w-lg md:max-w-3xl max-h-[90vh] overflow-y-auto backdrop-blur-md border ${theme === "dark"
                                    ? "bg-gray-800/90 border-gray-700 text-white"
                                    : "bg-gray-100/90 border-gray-200 text-gray-900"
                                }`}
                            style={{
                                background: theme === "dark"
                                    ? "linear-gradient(145deg, rgba(31, 41, 55, 0.9), rgba(17, 24, 39, 0.7))"
                                    : "linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(243, 244, 246, 0.7))",
                            }}
                        >
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className={`absolute top-3 sm:top-4 right-3 sm:right-4 text-lg sm:text-xl font-bold transition-all duration-200 ${theme === "dark" ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-900"
                                    }`}
                            >
                                <FaTimes />
                            </button>
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 md:mb-6 text-center tracking-tight">
                                Edit Company Profile
                            </h2>

                            {/* Company Logo */}
                            <div className="flex flex-col items-center mb-3 sm:mb-4 md:mb-6">
                                <label htmlFor="logoInput" className="cursor-pointer">
                                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full overflow-hidden shadow-md hover:shadow-lg transition-all duration-200">
                                        <img
                                            src={
                                                formData.logo.startsWith("blob:")
                                                    ? formData.logo
                                                    : company.logo
                                                        ? `http://localhost:3000/${company.logo}`
                                                        : defaultLogo
                                            }
                                            alt="Company Logo"
                                            className="absolute top-0 left-0 w-full h-full object-cover"
                                        />
                                    </div>
                                </label>
                                <input id="logoInput" type="file" onChange={handleImageChange} className="hidden" />
                            </div>

                            {/* Form Fields */}
                            <div className="space-y-3 sm:space-y-4">
                                {[
                                    "companyName",
                                    "companyBio",
                                    "founded",
                                    "ceo",
                                    "headquarters",
                                    "industry",
                                    "employees",
                                    "website",
                                ].map((field) => (
                                    <div key={field}>
                                        <label className="block font-medium text-xs sm:text-sm md:text-base capitalize">
                                            {field.replace(/([A-Z])/g, " $1")}
                                        </label>
                                        {field === "companyBio" ? (
                                            <textarea
                                                name={field}
                                                value={formData[field]}
                                                onChange={handleChange}
                                                className={`w-full p-2 sm:p-3 border rounded-lg text-xs sm:text-sm md:text-base focus:outline-none focus:ring-2 resize-none h-24 ${theme === "dark"
                                                        ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
                                                        : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-400"
                                                    }`}
                                                placeholder={`Enter ${field.replace(/([A-Z])/g, " $1")}`}
                                            />
                                        ) : (
                                            <input
                                                type={field === "founded" ? "number" : "text"}
                                                name={field}
                                                value={formData[field]}
                                                onChange={handleChange}
                                                className={`w-full p-2 sm:p-3 border rounded-lg text-xs sm:text-sm md:text-base focus:outline-none focus:ring-2 ${theme === "dark"
                                                        ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
                                                        : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-400"
                                                    }`}
                                                placeholder={`Enter ${field.replace(/([A-Z])/g, " $1")}`}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 sm:mt-6 md:mt-8 text-center">
                                <button
                                    onClick={handleSubmitProfileUpdate}
                                    className={`w-full px-3 sm:px-4 md:px-6 py-1 sm:py-2 md:py-3 rounded-lg text-sm sm:text-base md:text-lg font-semibold transition-all duration-200 hover:scale-105 ${theme === "dark"
                                            ? "bg-blue-600 text-white hover:bg-blue-500"
                                            : "bg-blue-500 text-white hover:bg-blue-600"
                                        }`}
                                >
                                    Update Profile
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyProfile;