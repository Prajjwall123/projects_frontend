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
            toast.success(`${paymentAmount} sent to freelancer`);
            setIsPaymentModalOpen(false);
        } catch (error) {
            toast.error(error.message || "Failed to transfer money.");
        }
    };

    if (isLoading) {
        return <div className="text-center p-4 sm:p-6">Loading underway projects...</div>;
    }

    if (error) {
        return <div className="text-center p-4 sm:p-6 text-red-500">Failed to load projects.</div>;
    }

    const underwayProjects = projects.filter((project) =>
        ["In Progress", "Feedback Requested"].includes(project.status)
    );

    return (
        <div
            className={`p-4 sm:p-6 rounded-xl shadow-lg transition-all duration-300 border backdrop-blur-sm ${theme === "dark"
                ? "bg-gray-900/80 border-gray-800 text-white"
                : "bg-gray-100/80 border-gray-200 text-black"
                }`}
        >
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 tracking-tight">
                Underway Projects
            </h2>

            {underwayProjects.length === 0 && (
                <p className="text-gray-500 text-sm sm:text-base">
                    No underway projects at the moment.
                </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {underwayProjects.map((project) => (
                    <div
                        key={project._id}
                        className={`p-5 rounded-xl shadow-lg border transition-all duration-300 hover:shadow-xl hover:scale-[1.02] flex flex-col backdrop-blur-md ${theme === "dark"
                            ? "bg-gray-800/90 border-gray-700 text-white"
                            : "bg-white/90 border-gray-200 text-black"
                            }`}
                        style={{
                            background: theme === "dark"
                                ? "linear-gradient(145deg, rgba(31, 41, 55, 0.9), rgba(17, 24, 39, 0.7))"
                                : "linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(243, 244, 246, 0.7))",
                        }}
                    >
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-lg sm:text-xl font-semibold tracking-tight">
                                {project.title}
                            </h4>
                            <button
                                onClick={() => navigate(`/project-details/${project._id}`)}
                                className={`px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 ${theme === "dark"
                                    ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                    }`}
                            >
                                View Details
                            </button>
                        </div>

                        <p className="text-sm sm:text-base text-opacity-80 mb-4 flex-grow leading-relaxed">
                            {project.description.substring(0, 100)}...
                        </p>

                        <hr
                            className={`my-4 border-opacity-30 ${theme === "dark" ? "border-gray-600" : "border-gray-300"
                                }`}
                        />

                        <div className="flex flex-wrap gap-2 sm:gap-3">
                            <button
                                onClick={() => handleOpenFeedbackModal(project)}
                                className={`flex-1 px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 ${theme === "dark"
                                    ? "bg-blue-600 text-white hover:bg-blue-500"
                                    : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                    }`}
                            >
                                View Feedback
                            </button>

                            <button
                                onClick={() => handleOpenResponseModal(project)}
                                className={`flex-1 px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 ${theme === "dark"
                                    ? "bg-green-600 text-white hover:bg-green-500"
                                    : "bg-green-100 text-green-800 hover:bg-green-200"
                                    }`}
                            >
                                Respond
                            </button>

                            <button
                                onClick={() => handleOpenPaymentModal(project)}
                                className={`flex-1 px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 ${theme === "dark"
                                    ? "bg-red-600 text-white hover:bg-red-500"
                                    : "bg-red-100 text-red-800 hover:bg-red-200"
                                    }`}
                            >
                                Pay Freelancer
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Payment Modal */}
            {isPaymentModalOpen && selectedProject && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
                    <div
                        className={`p-5 sm:p-6 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto backdrop-blur-md border ${theme === "dark"
                            ? "bg-gray-800/90 border-gray-700 text-white"
                            : "bg-white/90 border-gray-200 text-black"
                            }`}
                        style={{
                            background: theme === "dark"
                                ? "rgba(31, 41, 55, 0.95)"
                                : "rgba(255, 255, 255, 0.95)",
                        }}
                    >
                        <h3 className="text-lg sm:text-xl font-bold mb-3 tracking-tight">
                            Pay Freelancer
                        </h3>
                        <p className="mb-4 text-sm sm:text-base text-opacity-80">
                            Enter the amount to transfer to the freelancer for{" "}
                            <strong>{selectedProject.title}</strong>.
                        </p>
                        <input
                            type="number"
                            placeholder="Enter amount"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                            className={`w-full p-2 sm:p-3 border rounded-lg mb-4 text-sm sm:text-base focus:outline-none focus:ring-2 ${theme === "dark"
                                ? "bg-gray-700 border-gray-600 text-white focus:ring-red-500"
                                : "bg-gray-50 border-gray-300 text-black focus:ring-red-400"
                                }`}
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 ${theme === "dark"
                                    ? "bg-gray-600 text-white hover:bg-gray-500"
                                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                    }`}
                                onClick={() => setIsPaymentModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 ${theme === "dark"
                                    ? "bg-red-600 text-white hover:bg-red-500"
                                    : "bg-red-500 text-white hover:bg-red-600"
                                    }`}
                                onClick={handleTransferMoney}
                            >
                                Transfer Money
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Response Modal */}
            {isResponseModalOpen && selectedProject && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
                    <div
                        className={`p-5 sm:p-6 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto backdrop-blur-md border ${theme === "dark"
                            ? "bg-gray-800/90 border-gray-700 text-white"
                            : "bg-white/90 border-gray-200 text-black"
                            }`}
                        style={{
                            background: theme === "dark"
                                ? "rgba(31, 41, 55, 0.95)"
                                : "rgba(255, 255, 255, 0.95)",
                        }}
                    >
                        <h3 className="text-lg sm:text-xl font-bold mb-3 tracking-tight">
                            Respond to Feedback - {selectedProject.title}
                        </h3>
                        <label className="block mb-2 text-sm sm:text-base font-semibold">
                            Your Response:
                        </label>
                        <textarea
                            className={`w-full p-2 sm:p-3 border rounded-lg mb-4 text-sm sm:text-base focus:outline-none focus:ring-2 resize-none h-32 ${theme === "dark"
                                ? "bg-gray-700 border-gray-600 text-white focus:ring-green-500"
                                : "bg-gray-50 border-gray-300 text-black focus:ring-green-400"
                                }`}
                            placeholder="Enter your response..."
                            value={responseMessage}
                            onChange={(e) => setResponseMessage(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 ${theme === "dark"
                                    ? "bg-gray-600 text-white hover:bg-gray-500"
                                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                    }`}
                                onClick={() => setIsResponseModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 ${theme === "dark"
                                    ? "bg-green-600 text-white hover:bg-green-500"
                                    : "bg-green-500 text-white hover:bg-green-600"
                                    }`}
                                onClick={submitFeedbackResponse}
                            >
                                Submit Response
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Feedback Modal */}
            {isFeedbackModalOpen && selectedProject && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
                    <div
                        className={`p-5 sm:p-6 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto backdrop-blur-md border ${theme === "dark"
                            ? "bg-gray-800/90 border-gray-700 text-white"
                            : "bg-white/90 border-gray-200 text-black"
                            }`}
                        style={{
                            background: theme === "dark"
                                ? "rgba(31, 41, 55, 0.95)"
                                : "rgba(255, 255, 255, 0.95)",
                        }}
                    >
                        <h3 className="text-lg sm:text-xl font-bold mb-3 tracking-tight">
                            Feedback Request
                        </h3>
                        <p className="mb-3 text-sm sm:text-base">
                            <strong>Message:</strong>{" "}
                            {selectedProject.feedbackRequestedMessage || "No feedback provided."}
                        </p>
                        {selectedProject.link && (
                            <p className="mb-3 text-sm sm:text-base">
                                <strong>Progress Link:</strong>{" "}
                                <a
                                    href={selectedProject.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`underline transition-all duration-200 ${theme === "dark"
                                        ? "text-blue-400 hover:text-blue-300"
                                        : "text-blue-600 hover:text-blue-700"
                                        }`}
                                >
                                    View Progress
                                </a>
                            </p>
                        )}
                        <div className="flex justify-end">
                            <button
                                className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105 ${theme === "dark"
                                    ? "bg-gray-600 text-white hover:bg-gray-500"
                                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                    }`}
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