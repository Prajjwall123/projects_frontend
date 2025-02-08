import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ProjectDetails = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const project = state?.project;
    const company = project?.company;

    if (!project) {
        navigate("/");
        return null;
    }

    const handleBid = (e) => {
        e.preventDefault();
        const bidAmount = e.target.bidAmount.value;
        const message = e.target.message.value;
        console.log("Bid Amount:", bidAmount, "Message:", message);
    };

    return (
        <div className="container mx-auto p-6">
            {/* Project Details Section */}
            <div className="mb-12">
                <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
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

            {/* About the Company Section */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6">About the Company</h2>
                <div className="flex items-center mb-6">
                    <img
                        src={company?.logo ? `http://localhost:3000/${company.logo}` : "/defaultLogo.png"}
                        alt="Company Logo"
                        className="w-36 h-36 object-cover rounded-full shadow-md"
                    />
                    <div className="ml-8">
                        <h1 className="text-4xl font-bold text-gray-800">{company?.companyName}</h1>
                        <p className="mt-2 text-gray-600 text-lg">{company?.companyBio || "No company bio available."}</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold text-gray-800">Company Details</h3>
                        <ul className="mt-4 space-y-3 text-gray-700">
                            <li><strong>Founded:</strong> {company?.founded || "N/A"}</li>
                            <li><strong>CEO:</strong> {company?.ceo || "N/A"}</li>
                            <li><strong>Headquarters:</strong> {company?.headquarters || "N/A"}</li>
                            <li><strong>Industry:</strong> {company?.industry || "N/A"}</li>
                            <li><strong>Employees:</strong> {company?.employees || "N/A"}</li>
                            <li>
                                <strong>Website:</strong>{" "}
                                {company?.website ? (
                                    <a
                                        href={company.website.startsWith("http") ? company.website : `http://${company.website}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline hover:text-blue-800"
                                    >
                                        {company.website}
                                    </a>
                                ) : "N/A"}
                            </li>
                        </ul>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold text-gray-800">Projects Summary</h3>
                        <ul className="mt-4 space-y-3 text-gray-700">
                            <li><strong>Projects Posted:</strong> {company?.projectsPosted || 0}</li>
                            <li><strong>Projects Awarded:</strong> {company?.projectsAwarded || 0}</li>
                            <li><strong>Projects Completed:</strong> {company?.projectsCompleted || 0}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
