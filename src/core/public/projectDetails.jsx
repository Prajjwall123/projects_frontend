import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getFullProjectDetails, createBid } from "../utils/projectHelpers";
import { getUserProfile } from "../utils/authHelpers";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { toast } from "react-toastify";
import { FaMapMarkerAlt, FaCalendarAlt, FaBriefcase, FaCheck, FaListAlt } from "react-icons/fa";

const ProjectDetails = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [bidAmount, setBidAmount] = useState("");
    const [bidMessage, setBidMessage] = useState("");
    const [attachment, setAttachment] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    const { data: project, isLoading, error } = useQuery({
        queryKey: ["project", projectId],
        queryFn: () => getFullProjectDetails(projectId),
        retry: false,
        onError: () => navigate("/"),
    });

    const { data: profile } = useQuery({
        queryKey: ["userProfile"],
        queryFn: getUserProfile,
        enabled: !!showModal,
    });

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    const formatRequirements = (requirements) => {
        if (!requirements) return "None specified.";
        return requirements.split("\n").map((req, index) => (
            <li key={index} className="mb-1">{req}</li>
        ));
    };

    const handleBid = async () => {
        if (!bidAmount || !bidMessage) {
            toast.error("Please enter both bidding amount and a message.");
            return;
        }

        if (!attachment || attachment.type !== "application/pdf") {
            toast.error("Please upload a valid PDF file as an attachment.");
            return;
        }

        try {
            const freelancerId = profile?.profile?._id;

            if (!freelancerId) {
                toast.error("Freelancer ID not found. Please log in again.");
                return;
            }

            const formData = new FormData();
            formData.append("freelancer", freelancerId);
            formData.append("project", projectId);
            formData.append("amount", bidAmount);
            formData.append("message", bidMessage);
            formData.append("file", attachment);

            await createBid(formData);
            toast.success("Bid successfully placed!");
            setShowModal(false);
            setBidAmount("");
            setBidMessage("");
            setAttachment(null);
        } catch (error) {
            toast.error(error.message || "An error occurred while placing the bid.");
        }
    };

    const renderCategories = (categories) => {
        if (!categories || categories.length === 0) return "N/A";
        return categories.map((category, index) => (
            <span key={index} className="bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 text-sm px-3 py-1 rounded-full mr-2 mb-2 inline-block">
                {category}
            </span>
        ));
    };

    return (
        <div className={`${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"} min-h-screen`}>
            <Navbar theme={theme} toggleTheme={toggleTheme} />
            <div className="container mx-auto p-8">
                {project ? (
                    <div className={`p-8 rounded-lg shadow-md ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">{project.title}</h2>
                            <span className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-black"}`}>
                                {project.bidCount} Bids
                            </span>
                        </div>

                        <div
                            className="flex items-center cursor-pointer mb-6"
                            onClick={() => navigate(`/company-view/${project.companyId}`)}
                        >
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-black dark:bg-white">
                                <img
                                    src={project.companyLogo ? `http://localhost:3000/${project.companyLogo}` : "/defaultLogo.png"}
                                    alt="Company Logo"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="text-lg font-medium hover:underline ml-4">
                                {project.companyName || "Loading company details..."}
                            </h3>
                        </div>

                        <p className={`mb-6 ${theme === "dark" ? "text-white" : "text-black"}`}>{project.description}</p>

                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 mb-6`}>
                            <div className={`flex items-center p-4 rounded-lg ${theme === "dark" ? "bg-gray-600 text-gray-100" : "bg-gray-200 text-gray-800"} shadow`}>
                                <FaCalendarAlt className="text-blue-500 text-2xl mr-4" />
                                <div>
                                    <strong>Posted Date:</strong>
                                    <p>{new Date(project.postedDate).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className={`flex items-center p-4 rounded-lg ${theme === "dark" ? "bg-gray-600 text-gray-100" : "bg-gray-200 text-gray-800"} shadow`}>
                                <FaBriefcase className="text-green-500 text-2xl mr-4" />
                                <div>
                                    <strong>Duration:</strong>
                                    <p>{project.duration || "N/A"}</p>
                                </div>
                            </div>

                            <div className={`flex items-center p-4 rounded-lg ${theme === "dark" ? "bg-gray-600 text-white" : "bg-gray-200 text-black"} shadow`}>
                                <FaListAlt className="text-yellow-500 text-2xl mr-4" />
                                <div>
                                    <strong>Categories:</strong>
                                    <div className="mt-2">{renderCategories(project.category)}</div>
                                </div>
                            </div>

                            <div className={`flex items-center p-4 rounded-lg ${theme === "dark" ? "bg-gray-600 text-gray-100" : "bg-gray-200 text-gray-800"} shadow`}>
                                <FaCheck className="text-red-500 text-2xl mr-4" />
                                <div>
                                    <strong>Status:</strong>
                                    <p>{project.status || "N/A"}</p>
                                </div>
                            </div>
                        </div>


                        <h3 className="text-xl font-bold mb-4">Requirements</h3>
                        <ul className="list-disc pl-6">{formatRequirements(project.requirements)}</ul>
                    </div>
                ) : (
                    <p>Loading project details...</p>
                )}

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
                                    className={`w-full pl-12 border rounded p-3 focus:outline-none focus:ring-2 ${theme === "dark" ? "bg-gray-700 text-white border-gray-600" : "bg-white text-black border-gray-300"} focus:ring-blue-600`}
                                    placeholder="Enter your bidding amount"
                                    value={bidAmount}
                                    onChange={(e) => setBidAmount(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block font-semibold mb-2 ">Message To The Company</label>
                            <textarea
                                className={`w-full border rounded p-3 focus:outline-none focus:ring-2 ${theme === "dark" ? "bg-gray-700 text-white border-gray-600" : "bg-white text-black border-gray-300"} focus:ring-blue-600`}
                                placeholder="Enter your message"
                                value={bidMessage}
                                onChange={(e) => setBidMessage(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="fileInput" className="block font-semibold mb-2">Attachment (PDF only)</label>
                            <div
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const file = e.dataTransfer.files[0];
                                    if (file && file.type === "application/pdf") {
                                        setAttachment(file);
                                        setFileName(file.name);
                                    } else {
                                        alert("Only PDF files are allowed.");
                                    }
                                }}
                                onDragOver={(e) => e.preventDefault()}
                                onClick={() => document.getElementById("fileInput").click()}
                                className="w-full border-2 border-dashed rounded p-6 text-center cursor-pointer transition-all hover:border-blue-600 hover:bg-gray-50 focus:ring-2 focus:ring-blue-600"
                            >
                                <p className="text-gray-600">Select or Drop an Attachment</p>
                                <input
                                    type="file"
                                    id="fileInput"
                                    className="hidden"
                                    accept=".pdf"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file && file.type === "application/pdf") {
                                            setAttachment(file);
                                            setFileName(file.name);
                                        } else {
                                            alert("Only PDF files are allowed.");
                                        }
                                    }}
                                />
                                {attachment && (
                                    <p className="mt-2 text-sm text-gray-600">
                                        Selected file: <span className="font-medium">{attachment.name}</span>
                                    </p>
                                )}
                            </div>
                        </div>


                        <div className="flex justify-end gap-4 mt-4">
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

            <Footer theme={theme} />
        </div>
    );
};

export default ProjectDetails;
