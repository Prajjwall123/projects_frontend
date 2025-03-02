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
        <div
            className={`w-full max-w-[350px] sm:max-w-[400px] mx-auto p-4 sm:p-5 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] backdrop-blur-md border border-opacity-20 border-white/10 ${theme === "dark" ? "bg-gray-800/90 text-gray-200" : "bg-gray-200/90 text-gray-800"
                }`}
            style={{
                background: theme === "dark"
                    ? "linear-gradient(145deg, rgba(31, 41, 55, 0.9), rgba(17, 24, 39, 0.7))"
                    : "linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(243, 244, 246, 0.7))",
            }}
        >
            <div className="flex items-center mb-3 sm:mb-4">
                <img
                    src={
                        project.companyLogo ? `http://localhost:3000/${project.companyLogo}` : avatar
                    }
                    alt={`${project.companyName || "Company"} Logo`}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                />
                <div className="ml-3 sm:ml-4">
                    <h3 className="text-base sm:text-lg font-semibold">
                        {project.companyName || "Unknown Company"}
                    </h3>
                </div>
            </div>

            <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{project.title}</h2>

            <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                <div
                    className={`flex items-center border rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm ${theme === "dark" ? "border-gray-500 text-gray-300" : "border-gray-300 text-gray-600"
                        }`}
                >
                    {new Date(project.postedDate).toLocaleDateString()}
                </div>
                <div
                    className={`flex items-center border rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm ${theme === "dark" ? "border-gray-500 text-gray-300" : "border-gray-300 text-gray-600"
                        }`}
                >
                    {project.duration || "N/A"}
                </div>
            </div>

            <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex flex-wrap gap-1 sm:gap-2">
                    {project.category && project.category.length > 0 ? (
                        project.category.map((skill, index) => (
                            <span
                                key={index}
                                className="bg-blue-200 text-blue-800 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm"
                            >
                                {skill}
                            </span>
                        ))
                    ) : (
                        <span
                            className={`text-xs sm:text-sm italic ${theme === "dark" ? "text-gray-400" : "text-gray-500"
                                }`}
                        >
                            No categories available
                        </span>
                    )}
                </div>
                <span
                    className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm ${project.status === "posted"
                            ? "bg-green-500 text-white"
                            : "bg-gray-300 text-gray-700"
                        }`}
                >
                    {project.status}
                </span>
            </div>

            <p
                className={`text-xs sm:text-sm mb-3 sm:mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
            >
                {project.description?.length > 100
                    ? `${project.description.substring(0, 100)}...`
                    : project.description || "No description available."}
            </p>

            <p
                className={`text-xs sm:text-sm italic mb-3 sm:mb-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
            >
                <strong>Requirements:</strong> {truncateText(project.requirements, 17)}
            </p>

            <hr
                className={`border mb-3 sm:mb-4 ${theme === "dark" ? "border-gray-600" : "border-gray-300"
                    }`}
            />

            <div className="text-center">
                <button
                    className={`w-full py-1 sm:py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 hover:scale-105 ${theme === "dark"
                            ? "bg-blue-600 text-white hover:bg-blue-500"
                            : "bg-black text-white hover:bg-gray-800"
                        }`}
                    onClick={handleViewDetails}
                >
                    View Details
                </button>
            </div>
        </div>
    );
};

export default Card;