import React from "react";
import { useNavigate } from "react-router-dom";
import avatar from "../assets/avatar.png";
import { isUserLoggedIn, getUserProfile } from "../core/utils/authHelpers";
import { toast } from "react-toastify";

const Card = ({ project, theme }) => {
    const navigate = useNavigate();

    const handleViewDetails = async () => {
        try {
            if (!isUserLoggedIn()) {
                toast.error("Log In to view details");
                navigate("/login");
                return;
            }

            const userProfile = await getUserProfile();

            if (userProfile.role !== "freelancer") {
                toast.error("You must be a freelancer to view details");
                return;
            }

            navigate(`/project-details/${project.projectId}`);
        } catch (error) {
            console.error("Error checking user role:", error);
        }
    };

    const truncateText = (text, wordLimit) => {
        if (!text) return "None specified.";
        const words = text.split(" ");
        return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : text;
    };

    return (
        <div className={`card w-96 shadow-xl p-4 rounded-md border ${theme === "dark" ? "bg-gray-800 text-white border-gray-700" : "bg-white text-gray-900 border-gray-200"}`}>
            <div className="flex items-center mb-4">
                <img
                    src={project.companyLogo ? `http://localhost:3000/${project.companyLogo}` : avatar}
                    alt={`${project.companyName || "Company"} Logo`}
                    className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4">
                    <h3 className="text-lg font-semibold">
                        {project.companyName || "Unknown Company"}
                    </h3>
                </div>
            </div>

            <h2 className="text-xl font-bold mb-2">{project.title}</h2>

            <div className="flex items-center space-x-4 mb-4">
                <div className={`flex items-center border rounded-full px-3 py-1 text-sm ${theme === "dark" ? "border-gray-500 text-gray-300" : "border-gray-300 text-gray-600"}`}>
                    {new Date(project.postedDate).toLocaleDateString()}
                </div>
                <div className={`flex items-center border rounded-full px-3 py-1 text-sm ${theme === "dark" ? "border-gray-500 text-gray-300" : "border-gray-300 text-gray-600"}`}>
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
                    className={`px-3 py-1 rounded-full text-sm ${project.status === "posted" ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700"}`}
                >
                    {project.status}
                </span>
            </div>

            <p className={`text-sm mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                {project.description?.length > 100
                    ? `${project.description.substring(0, 100)}...`
                    : project.description || "No description available."}
            </p>

            <p className={`text-sm italic mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                <strong>Requirements:</strong> {truncateText(project.requirements, 17)}
            </p>

            <hr className={`border mb-4 ${theme === "dark" ? "border-gray-600" : "border-gray-300"}`} />

            <div className="text-center">
                <button
                    className={`py-2 px-4 rounded-md transition duration-300 ${theme === "dark" ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-black text-white hover:bg-gray-800"}`}
                    onClick={handleViewDetails}
                >
                    View Details
                </button>
            </div>
        </div>
    );
};

export default Card;
