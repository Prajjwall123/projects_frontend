import React from "react";
import avatar from "../assets/avatar.png"; // Fallback avatar if no company logo is provided

const Card = ({ project }) => {
    return (
        <div className="card bg-white w-96 shadow-xl p-4 rounded-md border border-gray-200">
            {/* Company Logo and Name */}
            <div className="flex items-center mb-4">
                <img
                    src={project.company?.logo || avatar} // Use company logo or fallback
                    alt={`${project.company?.name || "Company"} Logo`}
                    className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                        {project.company?.name || "Unknown Company"}
                    </h3>
                </div>
            </div>

            {/* Project Title */}
            <h2 className="text-xl font-bold text-gray-900 mb-2">
                {project.title}
            </h2>

            {/* Posted Date and Project Duration */}
            <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center border border-gray-300 rounded-full px-3 py-1 text-gray-600 text-sm">
                    {new Date(project.postedDate).toLocaleDateString()} {/* Format date */}
                </div>
                <div className="flex items-center border border-gray-300 rounded-full px-3 py-1 text-gray-600 text-sm">
                    {project.duration || "N/A"} {/* Show project duration if available */}
                </div>
            </div>

            {/* Project Category and Status */}
            <div className="flex items-center justify-between mb-4">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                    {project.category}
                </span>
                <span
                    className={`px-3 py-1 rounded-full text-sm ${project.status === "posted"
                            ? "bg-green-500 text-white"
                            : "bg-gray-300 text-gray-700"
                        }`}
                >
                    {project.status}
                </span>
            </div>

            {/* Project Description */}
            <p className="text-gray-700 text-sm mb-4">
                {project.description?.length > 100
                    ? `${project.description.substring(0, 100)}...`
                    : project.description || "No description available."}
            </p>

            {/* Project Requirements */}
            <p className="text-gray-600 text-sm italic mb-4">
                <strong>Requirements:</strong> {project.requirements || "None specified."}
            </p>

            <hr className="border-gray-300 mb-4" />

            {/* View Details Button */}
            <div className="text-center">
                <button className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800">
                    View Details
                </button>
            </div>
        </div>
    );
};

export default Card;
