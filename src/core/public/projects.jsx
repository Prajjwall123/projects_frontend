import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProjectsByFreelancerId, updateProjectStatusInBackend } from "../utils/projectHelpers";
import { FaTimes } from "react-icons/fa";

const STATUS_OPTIONS = ["To Do", "In Progress", "Feedback Requested", "Done"];

const FreelancerProjectsTable = ({ theme }) => {
    const { freelancerId } = useParams();
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [modalType, setModalType] = useState("");
    const [modalData, setModalData] = useState({ link: "", message: "" });

    useEffect(() => {
        if (!freelancerId) return;

        const fetchProjects = async () => {
            try {
                console.log("Fetching projects for freelancer ID:", freelancerId);
                const projectsData = await getProjectsByFreelancerId(freelancerId);
                setProjects(projectsData);
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };

        fetchProjects();
    }, [freelancerId]);

    const handleStatusChange = (projectId, newStatus) => {
        if (newStatus === "Feedback Requested") {
            const project = projects.find((p) => p.projectId === projectId);
            setSelectedProject(project);
            setModalType("feedbackRequested");
        } else {
            saveProjectUpdate(projectId, newStatus);
        }
    };

    const handleShowFeedback = (project) => {
        setSelectedProject(project);
        setModalType("feedbackResponse");
    };

    const saveProjectUpdate = async (projectId, newStatus, link = "", message = "") => {
        try {
            await updateProjectStatusInBackend(projectId, newStatus, link, message);
            setProjects((prevProjects) =>
                prevProjects.map((project) =>
                    project.projectId === projectId
                        ? { ...project, status: newStatus, link, feedbackRequestedMessage: message }
                        : project
                )
            );
            setSelectedProject(null);
            setModalData({ link: "", message: "" });
        } catch (error) {
            console.error("Failed to update project status:", error);
        }
    };

    return (
        <div
            className={`p-3 sm:p-4 md:p-6 rounded-xl shadow-lg transition-all duration-300 border ${theme === "dark"
                ? "bg-gray-900 border-gray-800 text-white"
                : "bg-gray-100 border-gray-200 text-gray-900"
                }`}
        >
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 md:mb-6 tracking-tight">
                Your Projects
            </h2>

            <div className="overflow-x-auto">
                <table
                    className={`table-auto w-full rounded-xl shadow-md border border-opacity-20 border-white/10 ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"
                        }`}
                >
                    <thead
                        className={`${theme === "dark" ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-800"
                            }`}
                    >
                        <tr>
                            <th className="p-2 sm:p-3 text-left text-xs sm:text-sm md:text-base font-semibold">
                                Project
                            </th>
                            <th className="p-2 sm:p-3 text-left text-xs sm:text-sm md:text-base font-semibold">
                                Company
                            </th>
                            <th className="p-2 sm:p-3 text-left text-xs sm:text-sm md:text-base font-semibold">
                                Category
                            </th>
                            <th className="p-2 sm:p-3 text-left text-xs sm:text-sm md:text-base font-semibold">
                                Status
                            </th>
                            <th className="p-2 sm:p-3 text-left text-xs sm:text-sm md:text-base font-semibold">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.length > 0 ? (
                            projects.map((project) => (
                                <tr
                                    key={project.projectId}
                                    className={`${theme === "dark"
                                        ? "border-gray-700 hover:bg-gray-700"
                                        : "border-gray-300 hover:bg-gray-100"
                                        } transition-all duration-200 border-b`}
                                >
                                    <td className="p-2 sm:p-3 text-xs sm:text-sm md:text-base">
                                        {project.title}
                                    </td>
                                    <td className="p-2 sm:p-3 text-xs sm:text-sm md:text-base">
                                        {project.companyName}
                                    </td>
                                    <td className="p-2 sm:p-3 text-xs sm:text-sm md:text-base">
                                        {project.category.join(", ")}
                                    </td>
                                    <td className="p-2 sm:p-3">
                                        <select
                                            className={`border p-1 sm:p-2 rounded-lg text-xs sm:text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${theme === "dark"
                                                ? "bg-gray-700 text-white border-gray-600"
                                                : "bg-gray-100 text-gray-900 border-gray-300"
                                                }`}
                                            value={project.status}
                                            onChange={(e) => handleStatusChange(project.projectId, e.target.value)}
                                        >
                                            {STATUS_OPTIONS.map((status) => (
                                                <option key={status} value={status}>
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="p-2 sm:p-3 flex flex-col sm:flex-row gap-1 sm:gap-2">
                                        <button
                                            className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 hover:scale-105 ${theme === "dark"
                                                ? "bg-blue-600 text-white hover:bg-blue-500"
                                                : "bg-blue-500 text-white hover:bg-blue-600"
                                                }`}
                                            onClick={() => handleShowFeedback(project)}
                                        >
                                            Show Feedback
                                        </button>
                                        <button
                                            className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 hover:scale-105 ${theme === "dark"
                                                ? "bg-green-600 text-white hover:bg-green-500"
                                                : "bg-green-500 text-white hover:bg-green-600"
                                                }`}
                                            onClick={() => navigate(`/project-details/${project.projectId}`)}
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="5"
                                    className={`text-center p-3 sm:p-4 text-xs sm:text-sm md:text-base ${theme === "dark" ? "text-gray-400" : "text-gray-500"
                                        }`}
                                >
                                    No projects found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {modalType === "feedbackRequested" && selectedProject && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-3 sm:p-4 z-50 overflow-y-auto">
                    <div
                        className={`relative p-4 sm:p-6 md:p-8 rounded-xl shadow-xl w-full max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto border backdrop-blur-md ${theme === "dark"
                            ? "bg-gray-800 border-gray-700 text-white"
                            : "bg-gray-100 border-gray-200 text-gray-900"
                            }`}
                        style={{
                            background: theme === "dark"
                                ? "linear-gradient(145deg, rgba(31, 41, 55, 0.9), rgba(17, 24, 39, 0.7))"
                                : "linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(243, 244, 246, 0.7))",
                        }}
                    >
                        <button
                            onClick={() => setSelectedProject(null)}
                            className={`absolute top-3 sm:top-4 right-3 sm:right-4 text-lg sm:text-xl font-bold transition-all duration-200 ${theme === "dark" ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            <FaTimes />
                        </button>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 md:mb-6 text-center tracking-tight">
                            Provide Feedback - {selectedProject.title}
                        </h3>
                        <label className="block mb-2 text-xs sm:text-sm md:text-base font-semibold">
                            Progress Link:
                        </label>
                        <input
                            type="text"
                            className={`w-full p-2 sm:p-3 border rounded-lg text-xs sm:text-sm md:text-base focus:outline-none focus:ring-2 ${theme === "dark"
                                ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
                                : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-400"
                                }`}
                            placeholder="Enter progress link..."
                            value={modalData.link}
                            onChange={(e) => setModalData({ ...modalData, link: e.target.value })}
                        />
                        <label className="block mt-2 sm:mt-3 mb-2 text-xs sm:text-sm md:text-base font-semibold">
                            Message:
                        </label>
                        <textarea
                            className={`w-full p-2 sm:p-3 border rounded-lg text-xs sm:text-sm md:text-base focus:outline-none focus:ring-2 resize-none h-24 ${theme === "dark"
                                ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
                                : "bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-400"
                                }`}
                            placeholder="Enter feedback message..."
                            value={modalData.message}
                            onChange={(e) => setModalData({ ...modalData, message: e.target.value })}
                        />
                        <div className="flex justify-end gap-2 sm:gap-3 mt-3 sm:mt-4 md:mt-6">
                            <button
                                className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm md:text-base font-semibold transition-all duration-200 hover:scale-105 ${theme === "dark"
                                    ? "bg-gray-600 text-white hover:bg-gray-500"
                                    : "bg-gray-300 text-gray-800 hover:bg-gray-400"
                                    }`}
                                onClick={() => setSelectedProject(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm md:text-base font-semibold transition-all duration-200 hover:scale-105 ${theme === "dark"
                                    ? "bg-blue-600 text-white hover:bg-blue-500"
                                    : "bg-blue-500 text-white hover:bg-blue-600"
                                    }`}
                                onClick={() =>
                                    saveProjectUpdate(
                                        selectedProject.projectId,
                                        "Feedback Requested",
                                        modalData.link,
                                        modalData.message
                                    )
                                }
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {modalType === "feedbackResponse" && selectedProject && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-3 sm:p-4 z-50 overflow-y-auto">
                    <div
                        className={`relative p-4 sm:p-6 md:p-8 rounded-xl shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-md max-h-[90vh] overflow-y-auto border backdrop-blur-md ${theme === "dark"
                            ? "bg-gray-800 border-gray-700 text-white"
                            : "bg-gray-100 border-gray-200 text-gray-900"
                            }`}
                        style={{
                            background: theme === "dark"
                                ? "linear-gradient(145deg, rgba(31, 41, 55, 0.9), rgba(17, 24, 39, 0.7))"
                                : "linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(243, 244, 246, 0.7))",
                        }}
                    >
                        <button
                            onClick={() => setSelectedProject(null)}
                            className={`absolute top-3 sm:top-4 right-3 sm:right-4 text-lg sm:text-xl font-bold transition-all duration-200 ${theme === "dark" ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            <FaTimes />
                        </button>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 md:mb-6 text-center tracking-tight">
                            Feedback Response
                        </h3>
                        <p className="mb-3 sm:mb-4 md:mb-6 text-xs sm:text-sm md:text-base">
                            <strong>Message:</strong>{" "}
                            {selectedProject.feedbackRespondMessage ||
                                "The company has not sent a feedback yet."}
                        </p>
                        <div className="flex justify-end">
                            <button
                                className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm md:text-base font-semibold transition-all duration-200 hover:scale-105 ${theme === "dark"
                                    ? "bg-gray-600 text-white hover:bg-gray-500"
                                    : "bg-gray-300 text-gray-800 hover:bg-gray-400"
                                    }`}
                                onClick={() => setSelectedProject(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FreelancerProjectsTable;