import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProjectsByCompany, updateProject, deleteProject, fetchSkills } from "../../../utils/projectHelpers";
import { format } from "date-fns";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UnderwayProjectsSection from "./UnderwayProjectsSection";
import StatsSection from "../../../../components/StatsSection";
import { FaEllipsisV } from "react-icons/fa";

const ProjectsSection = ({ companyId, theme, handleOpenBidSection }) => {
    const [activeMenu, setActiveMenu] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);
    const [activeProjectId, setActiveProjectId] = useState(null);
    const [biddersModalOpen, setBiddersModalOpen] = useState(false);
    const [currentBidders, setCurrentBidders] = useState([]);

    const queryClient = useQueryClient();

    const { data: projects, isLoading: projectsLoading, error: projectsError } = useQuery({
        queryKey: ["companyProjects", companyId],
        queryFn: () => getProjectsByCompany(companyId),
        enabled: !!companyId,
        retry: false,
    });

    const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchSkills,
        retry: false,
    });

    const updateProjectMutation = useMutation({
        mutationFn: ({ projectId, projectData }) => updateProject(projectId, projectData),
        onSuccess: () => {
            toast.success("Project updated successfully!");
            queryClient.invalidateQueries(["companyProjects", companyId]);
            setIsModalOpen(false);
        },
        onError: () => {
            toast.error("Failed to update project.");
        },
    });

    const deleteProjectMutation = useMutation({
        mutationFn: deleteProject,
        onSuccess: (_, projectId) => {
            toast.success("Project deleted successfully!");
            queryClient.setQueryData(["companyProjects", companyId], (oldProjects) =>
                oldProjects.filter((project) => project._id !== projectId)
            );
        },
        onError: () => {
            toast.error("Failed to delete project.");
        },
    });

    const handleMenuToggle = (projectId) => {
        setActiveMenu(activeMenu === projectId ? null : projectId);
    };

    const toggleBiddersList = (projectId) => {
        setActiveProjectId((prevId) => (prevId === projectId ? null : projectId));
    };

    const fetchBidders = async (projectId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/biddings/project/${projectId}`);
            const result = await response.json();
            setCurrentBidders(result.data || []);
        } catch (error) {
            console.error("Error fetching bidders:", error);
            setCurrentBidders([]);
        }
    };

    const handleDelete = (projectId) => {
        if (window.confirm("Are you sure you want to delete this project?")) {
            deleteProjectMutation.mutate(projectId);
        }
    };

    const handleUpdate = (project) => {
        setCurrentProject(project);
        setIsModalOpen(true);
    };

    const handleCategoryToggle = (categoryId) => {
        setCurrentProject((prevProject) => ({
            ...prevProject,
            category: prevProject.category.includes(categoryId)
                ? prevProject.category.filter((id) => id !== categoryId)
                : [...prevProject.category, categoryId],
        }));
    };

    const openBiddersModal = async (project) => {
        setCurrentProject(project);
        await fetchBidders(project._id);
        setBiddersModalOpen(true);
    };

    const handleModalUpdate = () => {
        if (!currentProject) return;
        updateProjectMutation.mutate({ projectId: currentProject._id, projectData: currentProject });
    };

    if (projectsLoading) {
        return <div className="text-center p-4 sm:p-6">Loading projects...</div>;
    }

    if (projectsError) {
        return <div className="text-center p-4 sm:p-6 text-red-500">Failed to load projects.</div>;
    }

    const cardClass = theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black";
    const modalClass = theme === "dark" ? "bg-gray-900 text-black" : "bg-white text-gray-800";
    const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-300";
    const hoverClass = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100";

    return (
        <div
            className={`p-4 sm:p-6 rounded-xl shadow-lg transition-all duration-300 border backdrop-blur-sm ${theme === "dark" ? "bg-gray-900/80 border-gray-800 text-white" : "bg-gray-100/80 border-gray-200 text-black"
                }`}
        >
            <StatsSection companyId={companyId} theme={theme} />

            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 mt-6 sm:mt-8 tracking-tight">
                Your Current Projects
            </h2>
            {projectsLoading && <p className="text-gray-600">Loading projects...</p>}
            {projectsError && <p className="text-red-600">{projectsError.message}</p>}
            {!projectsLoading && !projectsError && projects.length === 0 && (
                <p className="text-gray-500 text-sm sm:text-base">No projects found.</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {projects
                    .filter((project) => project.status === "posted")
                    .map((project) => (
                        <div
                            key={project._id}
                            className={`relative flex flex-col h-full p-5 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl ${cardClass} backdrop-blur-md border border-opacity-20 border-white/10 bg-opacity-80`}
                            style={{
                                background: theme === "dark"
                                    ? "linear-gradient(145deg, rgba(31, 41, 55, 0.9), rgba(17, 24, 39, 0.7))"
                                    : "linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(243, 244, 246, 0.7))",
                            }}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-lg sm:text-xl font-semibold tracking-tight text-opacity-90">
                                    {project.title}
                                </h4>
                                <div className="relative">
                                    <button
                                        onClick={() => handleMenuToggle(project._id)}
                                        className="text-gray-400 hover:text-gray-200 transition-colors duration-200"
                                    >
                                        <FaEllipsisV className="h-5 w-5 sm:h-6 sm:w-6" />
                                    </button>
                                    {activeMenu === project._id && (
                                        <div
                                            className={`absolute right-0 mt-2 w-36 rounded-lg shadow-xl z-50 border ${borderColor} ${cardClass} backdrop-blur-md bg-opacity-90 overflow-hidden`}
                                            style={{
                                                background: theme === "dark"
                                                    ? "rgba(31, 41, 55, 0.95)"
                                                    : "rgba(255, 255, 255, 0.95)",
                                            }}
                                        >
                                            <button
                                                onClick={() => handleUpdate(project)}
                                                className={`block w-full text-left px-4 py-2 text-sm sm:text-base ${hoverClass} hover:bg-opacity-10 hover:bg-gray-500 transition-colors duration-200`}
                                            >
                                                Update
                                            </button>
                                            <button
                                                onClick={() => handleDelete(project._id)}
                                                className={`block w-full text-left px-4 py-2 text-sm sm:text-base text-red-600 hover:text-red-700 ${hoverClass} hover:bg-opacity-10 hover:bg-gray-500 transition-colors duration-200`}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <p className="text-sm sm:text-base text-opacity-80 flex-grow leading-relaxed mb-4">
                                {project.description.substring(0, 100)}...
                            </p>
                            <div className="mt-auto">
                                <hr
                                    className={`my-4 border-opacity-30 ${borderColor}`}
                                    style={{
                                        borderColor: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                                    }}
                                />
                                <div className="flex justify-between items-center">
                                    <div>
                                        <button
                                            onClick={() => openBiddersModal(project)}
                                            className={`text-base sm:text-lg font-semibold py-1 px-3 sm:px-4 rounded-full transition-all duration-200 transform hover:scale-105 ${theme === "dark" ? "bg-blue-700 text-white hover:bg-blue-600" : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                                }`}
                                        >
                                            {project.bidCount} Bidders
                                        </button>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm sm:text-base text-opacity-90">
                                            {format(new Date(project.postedDate || Date.now()), "dd/MM/yyyy")}
                                        </p>
                                        <p className="text-xs sm:text-sm text-opacity-70">Posted Date</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>

            <hr
                className={`my-6 sm:my-8 border-opacity-30 ${theme === "dark" ? "border-gray-600" : "border-gray-300"
                    }`}
            />

            <UnderwayProjectsSection companyId={companyId} theme={theme} />

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div
                        className={`relative p-6 sm:p-8 rounded-xl shadow-xl w-full max-w-lg sm:max-w-3xl max-h-[90vh] overflow-y-auto backdrop-blur-md border ${theme === "dark"
                                ? "bg-gray-800/90 border-gray-700 text-white"
                                : "bg-white/90 border-gray-200 text-black"
                            }`}
                        style={{
                            background: theme === "dark"
                                ? "rgba(31, 41, 55, 0.95)"
                                : "rgba(255, 255, 255, 0.95)",
                        }}
                    >
                        <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center tracking-tight">
                            Update Project
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block font-medium text-sm sm:text-base">
                                    Project Title
                                </label>
                                <input
                                    type="text"
                                    value={currentProject?.title || ""}
                                    onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
                                    className={`w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 ${theme === "dark"
                                            ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
                                            : "bg-gray-50 border-gray-300 text-black focus:ring-blue-400"
                                        }`}
                                    placeholder="Enter project title"
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-sm sm:text-base">
                                    Description
                                </label>
                                <textarea
                                    value={currentProject?.description || ""}
                                    onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                                    className={`w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 resize-none h-32 ${theme === "dark"
                                            ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
                                            : "bg-gray-50 border-gray-300 text-black focus:ring-blue-400"
                                        }`}
                                    placeholder="Enter project description"
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-sm sm:text-base">
                                    Categories
                                </label>
                                <div className="w-full p-2 border border-gray-300 rounded-md flex flex-wrap gap-2">
                                    {categories?.map((category) => (
                                        <button
                                            key={category._id}
                                            type="button"
                                            className={`px-2 sm:px-3 py-1 rounded-md text-sm sm:text-base transition-all duration-200 ${currentProject?.category.includes(category._id)
                                                    ? "bg-blue-600 text-white"
                                                    : theme === "dark"
                                                        ? "bg-gray-600 text-white hover:bg-blue-500"
                                                        : "bg-gray-200 text-gray-800 hover:bg-blue-200"
                                                }`}
                                            onClick={() => handleCategoryToggle(category._id)}
                                        >
                                            {category.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block font-medium text-sm sm:text-base">
                                    Duration (in weeks)
                                </label>
                                <input
                                    type="number"
                                    value={currentProject?.duration || ""}
                                    onChange={(e) => setCurrentProject({ ...currentProject, duration: e.target.value })}
                                    className={`w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 ${theme === "dark"
                                            ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
                                            : "bg-gray-50 border-gray-300 text-black focus:ring-blue-400"
                                        }`}
                                    placeholder="Enter duration in weeks"
                                />
                            </div>
                            <div>
                                <label className="block font-medium text-sm sm:text-base">
                                    Requirements
                                </label>
                                <textarea
                                    value={currentProject?.requirements || ""}
                                    onChange={(e) => setCurrentProject({ ...currentProject, requirements: e.target.value })}
                                    className={`w-full p-2 sm:p-3 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 resize-none h-32 ${theme === "dark"
                                            ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
                                            : "bg-gray-50 border-gray-300 text-black focus:ring-blue-400"
                                        }`}
                                    placeholder="Enter project requirements"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end mt-4 sm:mt-6 gap-2">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-semibold transition-all duration-200 hover:scale-105 ${theme === "dark"
                                        ? "bg-gray-600 text-white hover:bg-gray-500"
                                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                    }`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleModalUpdate}
                                className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-semibold transition-all duration-200 hover:scale-105 ${theme === "dark"
                                        ? "bg-blue-600 text-white hover:bg-blue-500"
                                        : "bg-blue-500 text-white hover:bg-blue-600"
                                    }`}
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {biddersModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div
                        className={`relative p-6 sm:p-8 rounded-lg shadow-2xl w-full max-w-4xl sm:max-w-5xl max-h-[90vh] overflow-y-auto ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                            }`}
                    >
                        <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">
                            {`Bidders for ${currentProject.title}`}
                        </h3>
                        <ul className="space-y-4">
                            {currentBidders.map((bid) => (
                                <li
                                    key={bid._id}
                                    onClick={() => {
                                        handleOpenBidSection(bid._id);
                                        setBiddersModalOpen(false);
                                    }}
                                    className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-5 rounded-lg transition-all cursor-pointer ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"
                                        }`}
                                >
                                    <div className="flex items-center w-full sm:w-2/3 mb-4 sm:mb-0">
                                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-gray-300 dark:bg-gray-700">
                                            <img
                                                src={
                                                    bid.freelancer.profileImage
                                                        ? `http://localhost:3000/${bid.freelancer.profileImage}`
                                                        : "/defaultAvatar.png"
                                                }
                                                alt="Freelancer"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-base sm:text-lg font-semibold capitalize">
                                                {bid.freelancer.freelancerName || "Unknown Freelancer"}
                                            </h4>
                                            <p className="text-xs sm:text-sm text-gray-500">
                                                {bid.message.length > 100
                                                    ? `${bid.message.substring(0, 100)}...`
                                                    : bid.message || "No message provided"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-left sm:text-right w-full sm:w-1/3">
                                        <p className="text-base sm:text-lg font-bold">NRs {bid.amount}</p>
                                        <p className="text-xs sm:text-sm text-gray-500">
                                            {new Date(bid.createdAt).toLocaleDateString()}{" "}
                                            {new Date(bid.createdAt).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-end mt-6 sm:mt-8">
                            <button
                                onClick={() => setBiddersModalOpen(false)}
                                className={`px-4 sm:px-6 py-2 font-medium rounded-md transition-all text-sm sm:text-base ${theme === "dark"
                                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                                    : "bg-gray-300 hover:bg-gray-400 text-gray-800"
                                    }`}
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

export default ProjectsSection;