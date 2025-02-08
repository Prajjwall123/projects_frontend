import React from "react";
import { useNavigate } from "react-router-dom";
import avatar from "../assets/avatar.png";
import { isUserLoggedIn, getUserProfile } from "../core/utils/authHelpers";

const Card = ({ project }) => {
    const navigate = useNavigate();

    const handleViewDetails = async () => {
        try {
            if (!isUserLoggedIn()) {
                alert("Log In to view details");
                navigate("/login");
                return;
            }

            const userProfile = await getUserProfile();

            if (userProfile.role !== "freelancer") {
                alert("You must be a freelancer to view details");
                return;
            }

            navigate("/project-details", { state: { project } });
        } catch (error) {
            console.error("Error checking user role:", error);
        }
    };

    return (
        <div className="card bg-white w-96 shadow-xl p-4 rounded-md border border-gray-200">
            <div className="flex items-center mb-4">
                <img
                    src={project.company?.logo ? `http://localhost:3000/${project.company?.logo}` : avatar}
                    alt={`${project.company?.companyName || "Company"} Logo`}
                    className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                        {project.company?.companyName || "Unknown Company"}
                    </h3>
                </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h2>

            <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center border border-gray-300 rounded-full px-3 py-1 text-gray-600 text-sm">
                    {new Date(project.postedDate).toLocaleDateString()}
                </div>
                <div className="flex items-center border border-gray-300 rounded-full px-3 py-1 text-gray-600 text-sm">
                    {project.duration || "N/A"}
                </div>
            </div>

            <div className="flex items-center justify-between mb-4">
                <div className="flex flex-wrap gap-2">
                    {project.category && project.category.length > 0 ? (
                        project.category.map((skill, index) => (
                            <span key={index} className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm">
                                {skill}
                            </span>
                        ))
                    ) : (
                        <span className="text-gray-500 text-sm italic">No categories available</span>
                    )}
                </div>
                <span
                    className={`px-3 py-1 rounded-full text-sm ${project.status === "posted" ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700"
                        }`}
                >
                    {project.status}
                </span>
            </div>

            <p className="text-gray-700 text-sm mb-4">
                {project.description?.length > 100
                    ? `${project.description.substring(0, 100)}...`
                    : project.description || "No description available."}
            </p>

            <p className="text-gray-600 text-sm italic mb-4">
                <strong>Requirements:</strong> {project.requirements || "None specified."}
            </p>

            <hr className="border-gray-300 mb-4" />

            <div className="text-center">
                <button
                    className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800"
                    onClick={handleViewDetails}
                >
                    View Details
                </button>
            </div>
        </div>
    );
};

export default Card;
