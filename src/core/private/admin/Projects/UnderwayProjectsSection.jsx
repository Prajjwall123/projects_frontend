import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProjectsByCompany, updateProject } from "../../../utils/projectHelpers";
import { format } from "date-fns";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UnderwayProjectsSection = ({ companyId, theme }) => {
    const [selectedProject, setSelectedProject] = useState(null);
    const [responseMessage, setResponseMessage] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const queryClient = useQueryClient();

    const { data: projects, isLoading, error } = useQuery({
        queryKey: ["companyUnderwayProjects", companyId],
        queryFn: () => getProjectsByCompany(companyId),
        enabled: !!companyId,
        retry: false,
    });

    const updateProjectMutation = useMutation({
        mutationFn: ({ projectId, projectData }) => updateProject(projectId, projectData),
        onSuccess: () => {
            toast.success("Feedback response submitted successfully!");
            queryClient.invalidateQueries(["companyUnderwayProjects", companyId]);
            setIsModalOpen(false);
        },
        onError: () => {
            toast.error("Failed to submit feedback response.");
        },
    });

    const handleResponseModal = (project) => {
        setSelectedProject(project);
        setResponseMessage("");
        setIsModalOpen(true);
    };

    const submitFeedbackResponse = () => {
        if (!selectedProject || !responseMessage.trim()) return;
        updateProjectMutation.mutate({
            projectId: selectedProject._id,
            projectData: { feedbackRespondMessage: responseMessage },
        });
    };

    if (isLoading) {
        return <div className="text-center p-6">Loading underway projects...</div>;
    }

    if (error) {
        return <div className="text-center p-6 text-red-500">Failed to load projects.</div>;
    }

    const underwayProjects = projects.filter((project) =>
        ["In Progress", "Feedback Requested"].includes(project.status)
    );

    const cardClass = theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black";
    const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-300";
    const hoverClass = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100";

    return (
        <div className={`${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} p-6 rounded shadow-md`}>
            <h2 className="text-2xl font-bold mb-6">Underway Projects</h2>

            {underwayProjects.length === 0 && <p className="text-gray-600">No underway projects at the moment.</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {underwayProjects.map((project) => (
                    <div key={project._id} className={`p-4 rounded shadow relative flex flex-col h-full ${cardClass}`}>
                        <h4 className="text-xl font-bold">{project.title}</h4>
                        <p className="mb-4 flex-grow">{project.description.substring(0, 100)}...</p>

                        {/* Show Feedback Request Details */}
                        {(project.feedbackRequestedMessage || project.link) && (
                            <div className="bg-gray-200 p-2 rounded mt-3 text-sm text-gray-800">
                                <p className="font-semibold">Freelancer's Feedback Request:</p>
                                {project.feedbackRequestedMessage ? (
                                    <p>{project.feedbackRequestedMessage}</p>
                                ) : (
                                    <p className="italic text-gray-500">No message provided.</p>
                                )}
                                {project.link && (
                                    <p>
                                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                            View Progress
                                        </a>
                                    </p>
                                )}
                                <button
                                    onClick={() => handleResponseModal(project)}
                                    className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
                                >
                                    Respond to Feedback
                                </button>
                            </div>
                        )}

                        <div className="mt-auto">
                            <hr className={`my-4 ${borderColor}`} />
                            <p>{format(new Date(project.postedDate || Date.now()), "dd/MM/yyyy")}</p>
                            <p className="text-sm">Posted Date</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal for Responding to Feedback */}
            {isModalOpen && selectedProject && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-lg font-bold mb-3">
                            Respond to Feedback - {selectedProject.title}
                        </h3>
                        <label className="block mb-2 text-sm font-semibold">Your Response:</label>
                        <textarea
                            className="w-full p-2 border border-gray-300 rounded mb-3"
                            placeholder="Enter your response..."
                            value={responseMessage}
                            onChange={(e) => setResponseMessage(e.target.value)}
                        ></textarea>

                        <div className="flex justify-end gap-2">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-black text-white px-4 py-2 rounded"
                                onClick={submitFeedbackResponse}
                            >
                                Submit Response
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UnderwayProjectsSection;
