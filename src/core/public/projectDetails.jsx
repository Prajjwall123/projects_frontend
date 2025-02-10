import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCompanyById } from "../utils/companyHelpers";
import { getUserProfile } from "../utils/authHelpers";
import Navbar from "../../components/navbar";
import { FaMapMarkerAlt, FaCalendarAlt, FaBriefcase, FaCheck, FaListAlt } from "react-icons/fa";

const ProjectDetails = ({ theme, toggleTheme }) => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const project = state?.project;
    const freelancerId = getUserProfile().freelancerId;
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

    const handleBid = async () => {
        if (!bidAmount || !bidMessage) {
            alert("Please enter both bidding amount and a message.");
            return;
        }

        try {
            // Fetch the user profile to get the freelancer ID
            const profile = await getUserProfile();
            const freelancerId = profile?.profile?._id; // Assuming profile.id is the correct field for the freelancer ID
            const projectId = project._id;

            if (!freelancerId) {
                alert("Freelancer ID not found. Please log in again.");
                return;
            }

            const response = await fetch("http://localhost:3000/api/biddings/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    freelancer: freelancerId,
                    project: projectId,
                    amount: bidAmount,
                    message: bidMessage,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                alert("Bid successfully placed!");
                setShowModal(false);
                setBidAmount("");
                setBidMessage("");
            } else {
                const errorData = await response.json();
                alert(`Failed to place bid: ${errorData.message || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Error placing bid:", error);
            alert("An error occurred while placing the bid.");
        }
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
                <div className={`p-8 rounded-lg shadow-md ${theme === "dark" ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}>
                    <h2 className="text-2xl font-bold mb-4">{project.title}</h2>
                    <div
                        className="flex items-center cursor-pointer mb-6"
                        onClick={() => navigate("/company-view", { state: { companyId: project.company._id } })}
                    >
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                            <img
                                src={project.company?.logo ? `http://localhost:3000/${project.company.logo}` : "/defaultLogo.png"}
                                alt="Company Logo"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h3 className="text-lg font-medium hover:underline ml-4">
                            {project.company?.companyName || "Unknown Company"}
                        </h3>
                    </div>
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
                </div>

                <div className="mt-10 text-center">
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md text-lg"
                    >
                        Bid
                    </button>
                </div>
            </div>
            {
                showModal && (
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
                )
            }
        </div >
    );
}
export default ProjectDetails;
