import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ProjectDetails = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const project = state?.project;

    if (!project) {
        navigate("/");
        return null;
    }

    const handleBid = (e) => {
        e.preventDefault();
        const bidAmount = e.target.bidAmount.value;
        const message = e.target.message.value;
        console.log("Bid Amount:", bidAmount, "Message:", message);
        // Add your logic here to submit the bid to the server.
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">{project.title}</h1>
            <p className="text-gray-700 mb-4">{project.description}</p>
            <p className="text-gray-600 italic mb-4">
                <strong>Requirements:</strong> {project.requirements || "None specified."}
            </p>
            <div className="flex items-center space-x-4 mb-6">
                <div className="text-sm border border-gray-300 rounded-full px-3 py-1">
                    <strong>Posted Date:</strong> {new Date(project.postedDate).toLocaleDateString()}
                </div>
                <div className="text-sm border border-gray-300 rounded-full px-3 py-1">
                    <strong>Duration:</strong> {project.duration || "N/A"}
                </div>
            </div>
            <button
                className="text-blue-600 underline mb-6"
                onClick={() => navigate("/company", { state: { companyId: project.company._id } })}
            >
                View Company Profile
            </button>

            <form onSubmit={handleBid} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2 className="text-lg font-bold mb-4">Place Your Bid</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bidAmount">
                        Bid Amount
                    </label>
                    <input
                        type="number"
                        id="bidAmount"
                        name="bidAmount"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter your bid amount"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                        Custom Message
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter a message for the company"
                        required
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
                    >
                        Submit Bid
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProjectDetails;
