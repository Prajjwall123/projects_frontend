import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProjectsByFreelancerId, updateProjectStatusInBackend } from "../utils/projectHelpers";

// Status options
const STATUS_OPTIONS = ["To Do", "In Progress", "Feedback Requested", "Done"];

const FreelancerProjectsTable = () => {
    const { freelancerId } = useParams();
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [modalType, setModalType] = useState(""); // "feedbackRequested" or "feedbackResponse"
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

    // Handle status change
    const handleStatusChange = (projectId, newStatus) => {
        if (newStatus === "Feedback Requested") {
            // Open modal for link & message
            const project = projects.find((p) => p.projectId === projectId);
            setSelectedProject(project);
            setModalType("feedbackRequested");
        } else {
            // Directly update status in backend for "To Do", "In Progress", "Done"
            saveProjectUpdate(projectId, newStatus);
        }
    };

    // Open modal for viewing feedback response
    const handleShowFeedback = (project) => {
        setSelectedProject(project);
        setModalType("feedbackResponse");
    };

    // Save project update (direct update or via modal)
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
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Your Projects</h2>
            <div className="overflow-x-auto">
                <table className="table-auto w-full border border-gray-300 shadow-md">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-3 text-left">Project</th>
                            <th className="p-3 text-left">Company</th>
                            <th className="p-3 text-left">Category</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.length > 0 ? (
                            projects.map((project) => (
                                <tr key={project.projectId} className="border-t">
                                    <td className="p-3">{project.title}</td>
                                    <td className="p-3">{project.companyName}</td>
                                    <td className="p-3">{project.category.join(", ")}</td>
                                    <td className="p-3">
                                        <select
                                            className="border p-2 rounded"
                                            value={project.status}
                                            onChange={(e) =>
                                                handleStatusChange(project.projectId, e.target.value)
                                            }
                                        >
                                            {STATUS_OPTIONS.map((status) => (
                                                <option key={status} value={status}>
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="p-3 flex gap-2">
                                        <button
                                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
                                            onClick={() => handleShowFeedback(project)}
                                        >
                                            Show Feedback
                                        </button>
                                        <button
                                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700"
                                            onClick={() => navigate(`/project-details/${project.projectId}`)}
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center p-4 text-gray-500">
                                    No projects found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal for Feedback Requested */}
            {modalType === "feedbackRequested" && selectedProject && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-lg font-bold mb-3">
                            Provide Feedback - {selectedProject.title}
                        </h3>
                        <label className="block mb-2 text-sm font-semibold">
                            Progress Link:
                        </label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded mb-3"
                            placeholder="Enter progress link..."
                            value={modalData.link}
                            onChange={(e) => setModalData({ ...modalData, link: e.target.value })}
                        />
                        <label className="block mb-2 text-sm font-semibold">Message:</label>
                        <textarea
                            className="w-full p-2 border border-gray-300 rounded mb-3"
                            placeholder="Enter feedback message..."
                            value={modalData.message}
                            onChange={(e) => setModalData({ ...modalData, message: e.target.value })}
                        ></textarea>

                        <div className="flex justify-end gap-2">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                                onClick={() => setSelectedProject(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-black text-white px-4 py-2 rounded"
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

            {/* Modal for Viewing Feedback Response */}
            {modalType === "feedbackResponse" && selectedProject && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-lg font-bold mb-3">Feedback Response</h3>
                        <p className="mb-3">
                            <strong>Message:</strong>{" "}
                            {selectedProject.feedbackRespondMessage || "The company has not sent a feedback yet."}
                        </p>
                        <div className="flex justify-end">
                            <button
                                className="bg-black text-white px-4 py-2 rounded"
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
