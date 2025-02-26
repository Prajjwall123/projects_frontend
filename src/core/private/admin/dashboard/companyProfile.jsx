import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCompanyById, handleUpdateProfile } from "../../../utils/companyHelpers";
import defaultLogo from "../../../../assets/default_profile_picture.jpg";
import { FaMapMarkerAlt, FaUsers, FaIndustry, FaGlobe, FaUserTie, FaCalendarAlt, FaBuilding, FaCommentDots } from "react-icons/fa";

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
            <div className="flex items-center justify-center min-h-screen text-lg text-gray-600">
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

    const outerClass = theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-800";
    const containerClass = "bg-white text-gray-800";
    const modalClass = theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-800";
    const inputClass = theme === "dark" ? "bg-gray-700 text-white border-gray-600" : "bg-gray-100 text-black border-gray-300";

    return (
        <div className={`${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"} min-h-screen`}>
            <div className="container mx-auto p-8">
                <div className="flex items-center mb-8">
                    <div className="flex flex-col items-center mb-6">
                        <label htmlFor="logoInput" className="cursor-pointer">
                            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 shadow-md">
                                <img
                                    src={formData.logo.startsWith("blob:") ? formData.logo : company.logo ? `http://localhost:3000/${company.logo}` : defaultLogo}
                                    alt="Company Logo"
                                    className="absolute top-0 left-0 w-full h-full object-cover"
                                />
                            </div>
                        </label>
                        <input id="logoInput" type="file" onChange={handleImageChange} className="hidden" />
                    </div>

                    <div className="ml-8">
                        <h1 className="text-2xl font-bold">{company.companyName}</h1>
                        <p className="text-gray-500 flex items-center mt-2">
                            <FaMapMarkerAlt className="mr-2 text-blue-600" /> {company.headquarters || "N/A"}
                        </p>
                        <p className="mt-4">{company.companyBio || "No company bio available."}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className={`p-6 rounded-lg shadow ${theme === "dark" ? "bg-blue-900 text-blue-200" : "bg-blue-100 text-blue-900"}`}>
                        <h3 className="text-lg font-semibold">Projects Posted</h3>
                        <p className="text-3xl font-bold">{company.projectsPosted}</p>
                    </div>
                    <div className={`p-6 rounded-lg shadow ${theme === "dark" ? "bg-green-900 text-green-200" : "bg-green-100 text-green-900"}`}>
                        <h3 className="text-lg font-semibold">Projects Awarded</h3>
                        <p className="text-3xl font-bold">{company.projectsAwarded}</p>
                    </div>
                    <div className={`p-6 rounded-lg shadow ${theme === "dark" ? "bg-yellow-900 text-yellow-200" : "bg-yellow-100 text-yellow-900"}`}>
                        <h3 className="text-lg font-semibold">Projects Completed</h3>
                        <p className="text-3xl font-bold">{company.projectsCompleted}</p>
                    </div>
                </div>

                <div className={`p-6 rounded-lg shadow ${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"}`}>
                    <h3 className="text-xl font-bold mb-4">Company Information</h3>
                    <ul className="space-y-4">
                        <li className="flex items-center">
                            <FaCalendarAlt className="text-blue-600 mr-2" />
                            <strong className="mr-2">Founded:</strong> {company.founded || "N/A"}
                        </li>
                        <li className="flex items-center">
                            <FaUserTie className="text-green-600 mr-2" />
                            <strong className="mr-2">CEO:</strong> {company.ceo || "N/A"}
                        </li>
                        <li className="flex items-center">
                            <FaUsers className="text-red-600 mr-2" />
                            <strong className="mr-2">Employees:</strong> {company.employees || "N/A"}
                        </li>
                        <li className="flex items-center">
                            <FaBuilding className="text-yellow-600 mr-2" />
                            <strong className="mr-2">Industry:</strong> {company.industry || "N/A"}
                        </li>
                        <li className="flex items-center">
                            <FaGlobe className="text-red-600 mr-2" />
                            <strong className="mr-2">Website:</strong>
                            {company.website ? (
                                <a
                                    href={company.website.startsWith("http") ? company.website : `http://${company.website}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline hover:text-blue-800"
                                >
                                    {company.website}
                                </a>
                            ) : (
                                "N/A"
                            )}
                        </li>
                    </ul>
                </div>
            </div>
            <div className=" text-center">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-md shadow-md hover:bg-blue-700 transition duration-200"
                >
                    Update Profile
                </button>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`relative p-8 rounded-lg shadow-lg max-w-3xl w-full overflow-auto h-[80vh] ${modalClass}`}>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl font-bold"
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-bold mb-6 text-center">Edit Company Profile</h2>

                        {/* Company Logo */}
                        <div className="flex flex-col items-center mb-6">
                            <label htmlFor="logoInput" className="cursor-pointer">
                                <img
                                    src={formData.logo.startsWith("blob:") ? formData.logo : company.logo ? `http://localhost:3000/${company.logo}` : defaultLogo}
                                    alt="Company Logo"
                                    className="w-32 h-32 object-cover rounded-full shadow-md"
                                />
                            </label>
                            <input id="logoInput" type="file" onChange={handleImageChange} className="hidden" />
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-4">
                            {["companyName", "companyBio", "founded", "ceo", "headquarters", "industry", "employees", "website"].map((field) => (
                                <div key={field}>
                                    <label className="block font-medium capitalize">{field.replace(/([A-Z])/g, " $1")}</label>
                                    <input
                                        type={field === "founded" ? "number" : "text"}
                                        name={field}
                                        value={formData[field]}
                                        onChange={handleChange}
                                        className={`w-full p-2 border rounded-md ${inputClass}`}
                                        placeholder={`Enter ${field.replace(/([A-Z])/g, " $1")}`}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 text-center">
                            <button
                                onClick={handleSubmitProfileUpdate}
                                className="w-full px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-md shadow-md hover:bg-blue-700 transition duration-200"
                            >
                                Update Profile
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
};

export default CompanyProfile;
