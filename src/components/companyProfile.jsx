import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCompanyById, handleUpdateProfile } from "../core/utils/companyHelpers";
import defaultLogo from "../assets/default_profile_picture.jpg";

const CompanyProfile = ({ companyId }) => {
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
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

    useEffect(() => {
        const fetchCompanyData = async () => {
            try {
                const companyData = await getCompanyById(companyId);
                setCompany(companyData);
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
            } catch (error) {
                console.error("Error fetching company data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyData();
    }, [companyId]);

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
            alert("Company profile updated successfully!");
            setIsModalOpen(false);
        } else {
            alert("Failed to update company profile. Please try again.");
        }
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-lg text-gray-600">
                Loading company profile...
            </div>
        );
    }

    if (!company) {
        return (
            <div className="flex items-center justify-center min-h-screen text-lg text-gray-600">
                Company not found.
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-10">
            {/* Header Section */}
            <div className="flex items-center">
                <img
                    src={company.logo ? `http://localhost:3000/${company.logo}` : defaultLogo}
                    alt="Company Logo"
                    className="w-36 h-36 object-cover rounded-full shadow-md"
                />
                <div className="ml-8">
                    <h1 className="text-4xl font-bold text-gray-800">{company.companyName}</h1>
                    <p className="mt-2 text-gray-600 text-lg">{company.companyBio || "No company bio available."}</p>
                </div>
            </div>

            {/* Details Section */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
                    <h3 className="text-2xl font-semibold text-gray-800">Company Details</h3>
                    <ul className="mt-4 space-y-3 text-gray-700">
                        <li><strong>Founded:</strong> {company.founded || "N/A"}</li>
                        <li><strong>CEO:</strong> {company.ceo || "N/A"}</li>
                        <li><strong>Headquarters:</strong> {company.headquarters || "N/A"}</li>
                        <li><strong>Industry:</strong> {company.industry || "N/A"}</li>
                        <li><strong>Employees:</strong> {company.employees || "N/A"}</li>
                        <li><strong>Website:</strong> {company.website || "N/A"}</li>
                    </ul>
                </div>
                <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
                    <h3 className="text-2xl font-semibold text-gray-800">Projects Summary</h3>
                    <ul className="mt-4 space-y-3 text-gray-700">
                        <li><strong>Projects Posted:</strong> {company.projectsPosted}</li>
                        <li><strong>Projects Awarded:</strong> {company.projectsAwarded}</li>
                        <li><strong>Projects Completed:</strong> {company.projectsCompleted}</li>
                    </ul>
                </div>
            </div>

            {/* Update Profile Button */}
            <div className="mt-12 text-center">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-md shadow-md hover:bg-blue-700 transition duration-200"
                >
                    Update Profile
                </button>
            </div>

            {/* Modal for Editing Profile */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="relative bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full overflow-auto h-[80vh]">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl font-bold"
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-bold mb-6 text-center">Edit Company Profile</h2>
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
                        <div className="space-y-4">
                            {["companyName", "companyBio", "founded", "ceo", "headquarters", "industry", "employees", "website"].map((field) => (
                                <div key={field}>
                                    <label className="block text-gray-800 font-medium capitalize">{field.replace(/([A-Z])/g, " $1")}</label>
                                    <input
                                        type="text"
                                        name={field}
                                        value={formData[field]}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded-md"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 text-right">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md mr-4"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitProfileUpdate}
                                className="px-6 py-2 bg-blue-600 text-white rounded-md"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanyProfile;
