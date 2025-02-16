import React, { useEffect, useState } from "react";
import { getBidById } from "../core/utils/projectHelpers";

const BiddingSection = ({ bidId, theme, onClose }) => {
    const [bid, setBid] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBidDetails = async () => {
            try {
                setLoading(true);
                const bidDetails = await getBidById(bidId);
                setBid(bidDetails.data);
                setError(null);
            } catch (error) {
                console.error("Failed to fetch bid details:", error);
                setError(error.message || "Failed to load bid details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchBidDetails();
    }, [bidId]);

    if (loading) {
        return <div className="text-center p-4">Loading bid details...</div>;
    }

    if (error) {
        return <div className="text-center p-4 text-red-500">{error}</div>;
    }

    const { freelancer, project, amount, message, fileName, createdAt } = bid;

    return (
        <div className={`p-6 rounded shadow-lg space-y-8 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-4 border-gray-300 dark:border-gray-700">
                <h3 className="text-3xl font-bold">Bid Details</h3>
                <button
                    onClick={onClose}
                    className={`px-4 py-2 rounded-md font-medium ${theme === "dark" ? "bg-gray-600 hover:bg-gray-500 text-white" : "bg-gray-200 hover:bg-gray-300 text-black"}`}
                >
                    Close
                </button>
            </div>

            {/* Freelancer Profile Section */}
            <div className={`rounded-lg p-6 shadow-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                <h4 className="text-xl font-semibold mb-4">Freelancer Profile</h4>
                <div className="flex items-center space-x-6">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500">
                        <img
                            src={`http://localhost:3000/images/${freelancer.profileImage}`}
                            alt={freelancer.freelancerName}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{freelancer.freelancerName}</p>
                        <p className="text-sm text-gray-400">Experience: {freelancer.experienceYears} years</p>
                        <p className="text-sm text-gray-400">Availability: {freelancer.availability}</p>
                        <a
                            href={freelancer.portfolio}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                        >
                            View Portfolio
                        </a>
                    </div>
                </div>
            </div>

            {/* Project Information Section */}
            <div className={`rounded-lg p-6 shadow-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                <h4 className="text-xl font-semibold mb-4">Project Information</h4>
                <p className="text-md font-medium"><strong>Title:</strong> {project.title}</p>
                <p className="text-sm text-gray-400"><strong>Duration:</strong> {project.duration} months</p>
                <p className="mt-2">{project.description}</p>
                <h5 className="mt-4 font-semibold">Requirements:</h5>
                <ul className="list-disc ml-6 text-gray-600 dark:text-gray-400">
                    {project.requirements.split("\n").map((req, index) => (
                        <li key={index}>{req}</li>
                    ))}
                </ul>
            </div>

            {/* Bid Information Section */}
            <div className={`rounded-lg p-6 shadow-lg ${theme === "dark" ? "bg-blue-900" : "bg-blue-100"}`}>
                <h4 className="text-xl font-semibold mb-4 text-white">Bid Information</h4>
                <p className="text-lg text-white"><strong>Bid Amount:</strong> NRs {amount}</p>
                <p className="text-sm text-blue-200"><strong>Bid Date:</strong> {new Date(createdAt).toLocaleString()}</p>
                <p className="mt-4 text-white">{message}</p>
            </div>

            {/* Attachment Section */}
            {fileName && (
                <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-2">Attachment</h4>
                    <a
                        href={`http://localhost:3000/uploads/${fileName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 underline"
                    >
                        View Attached PDF
                    </a>
                </div>
            )}
        </div>

    );
};

export default BiddingSection;
