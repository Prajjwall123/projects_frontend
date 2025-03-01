import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getProjectsByCompany, updateProject } from "../../../utils/projectHelpers";
import { transferMoney } from "../../../utils/paymentHelpers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UnderwayProjectsSection = ({ companyId, theme }) => {
    const [selectedProject, setSelectedProject] = useState(null);
    const [responseMessage, setResponseMessage] = useState("");
    const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState("");

    const queryClient = useQueryClient();
    const navigate = useNavigate();

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
            setIsResponseModalOpen(false);
        },
        onError: () => {
            toast.error("Failed to submit feedback response.");
        },
    });

    const handleOpenFeedbackModal = (project) => {
        setSelectedProject(project);
        setIsFeedbackModalOpen(true);
    };

    const handleOpenResponseModal = (project) => {
        setSelectedProject(project);
        setResponseMessage("");
        setIsResponseModalOpen(true);
    };

    const handleOpenPaymentModal = (project) => {
        setSelectedProject(project);
        setPaymentAmount("");
        setIsPaymentModalOpen(true);
    };

    const submitFeedbackResponse = () => {
        if (!selectedProject || !responseMessage.trim()) return;
        updateProjectMutation.mutate({
            projectId: selectedProject._id,
            projectData: { feedbackRespondMessage: responseMessage },
        });
    };

    const handleTransferMoney = async () => {
        if (!selectedProject || !paymentAmount || isNaN(paymentAmount) || paymentAmount <= 0) {
            toast.error("Please enter a valid amount.");
            return;
        }

        const senderId = localStorage.getItem("userId");
        const receiverId = selectedProject.awardedTo;

        if (!senderId || !receiverId) {
            toast.error("Invalid sender or receiver ID.");
            return;
        }

        try {
            const response = await transferMoney(senderId, receiverId, parseFloat(paymentAmount));
            toast.success(response.message);
            setIsPaymentModalOpen(false);
        } catch (error) {
            toast.error(error.message || "Failed to transfer money.");
        }
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

    return (
        <div className={`p-6 rounded-lg shadow-lg  transition-all duration-300 
            ${theme === "dark" ? "bg-gray-900 border-gray-800 text-white" : "bg-gray-100 border-gray-300 text-black"}`}>
            <h2 className="text-2xl font-bold mb-6">Underway Projects</h2>


            {underwayProjects.length === 0 && (
                <p className="text-gray-600">No underway projects at the moment.</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {underwayProjects.map((project) => (
                    <div
                        key={project._id}
                        className={`p-6 rounded-xl shadow-lg border transition-transform duration-300 hover:scale-105 ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                            } flex flex-col`}
                    >
                        <div className="flex justify-between items-center mb-3">
                            <h4 className={`text-lg font-bold ${theme === "dark" ? "text-white" : "text-black"}`}>
                                {project.title}
                            </h4>
                            <button
                                onClick={() => navigate(`/project-details/${project._id}`)}
                                className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-all"
                            >
                                View Details
                            </button>
                        </div>

                        <p className={`text-sm mb-4 ${theme === "dark" ? "text-gray-300" : "text-black"}`}>
                            {project.description.substring(0, 100)}...
                        </p>


                        <hr className="border-gray-300 dark:border-gray-600 my-4" />

                        <div className="flex justify-between">
                            <button
                                onClick={() => handleOpenFeedbackModal(project)}
                                className="flex-1 px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold text-sm hover:bg-blue-600 transition-all"
                            >
                                View Feedback
                            </button>

                            <button
                                onClick={() => handleOpenResponseModal(project)}
                                className="flex-1 mx-2 px-4 py-2 rounded-lg bg-green-500 text-white font-semibold text-sm hover:bg-green-600 transition-all"
                            >
                                Respond
                            </button>

                            <button
                                onClick={() => handleOpenPaymentModal(project)}
                                className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-all"
                            >
                                Pay Freelancer
                            </button>
                        </div>
                    </div>
                ))}
            </div>


            {isPaymentModalOpen && selectedProject && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="p-6 rounded-lg shadow-lg w-96 bg-white text-black">
                        <h3 className="text-lg font-bold mb-3">Pay Freelancer</h3>
                        <p className="mb-3">
                            Enter the amount to transfer to the freelancer for <strong>{selectedProject.title}</strong>.
                        </p>
                        <input
                            type="number"
                            placeholder="Enter amount"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            className="w-full p-2 border rounded mb-3"
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-700"
                                onClick={() => setIsPaymentModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-700"
                                onClick={handleTransferMoney}
                            >
                                Transfer Money
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isResponseModalOpen && selectedProject && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className={`p-6 rounded-lg shadow-lg w-96 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
                        <h3 className="text-lg font-bold mb-3">Respond to Feedback - {selectedProject.title}</h3>
                        <label className="block mb-2 text-sm font-semibold">Your Response:</label>
                        <textarea
                            className="w-full p-2 border rounded mb-3"
                            placeholder="Enter your response..."
                            value={responseMessage}
                            onChange={(e) => setResponseMessage(e.target.value)}
                        ></textarea>

                        <div className="flex justify-end gap-2">
                            <button
                                className={`px-4 py-2 rounded-md transition ${theme === "dark" ? "bg-gray-600 text-white hover:bg-gray-500" : "bg-gray-500 text-white hover:bg-gray-700"}`}
                                onClick={() => setIsResponseModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className={`px-4 py-2 rounded-md transition ${theme === "dark" ? "bg-green-600 text-white hover:bg-green-500" : "bg-green-500 text-white hover:bg-green-700"}`}
                                onClick={submitFeedbackResponse}
                            >
                                Submit Response
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isFeedbackModalOpen && selectedProject && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className={`p-6 rounded-lg shadow-lg w-96 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
                        <h3 className="text-lg font-bold mb-3">Feedback Request</h3>
                        <p className="mb-3">
                            <strong>Message:</strong> {selectedProject.feedbackRequestedMessage || "No feedback provided."}
                        </p>
                        {selectedProject.link && (
                            <p>
                                <strong>Progress Link:</strong>{" "}
                                <a href={selectedProject.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                                    View Progress
                                </a>
                            </p>
                        )}
                        <div className="flex justify-end">
                            <button
                                className={`px-4 py-2 rounded-md transition ${theme === "dark" ? "bg-gray-600 text-white hover:bg-gray-500" : "bg-gray-500 text-white hover:bg-gray-700"}`}
                                onClick={() => setIsFeedbackModalOpen(false)}
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

export default UnderwayProjectsSection;
