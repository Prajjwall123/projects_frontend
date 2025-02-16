import React, { useState, useEffect } from "react";
import { getProjectsByCompany, updateProject, deleteProject, fetchSkills } from "../core/utils/projectHelpers";
import { format } from "date-fns";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const ProjectsSection = ({ companyId, theme }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeMenu, setActiveMenu] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);
    const [categories, setCategories] = useState([]);
    const [activeProjectId, setActiveProjectId] = useState(null);
    const [biddersModalOpen, setBiddersModalOpen] = useState(false);
    const [currentBidders, setCurrentBidders] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            if (!companyId) return;
            setLoading(true);
            setError(null);
            try {
                const projectsData = await getProjectsByCompany(companyId);
                const projectsWithBids = await Promise.all(
                    projectsData.map(async (project) => {
                        const bidCount = await fetchBiddingCount(project._id);
                        return { ...project, bidCount };
                    })
                );
                setProjects(projectsWithBids);
            } catch (err) {
                console.error("Error fetching projects:", err);
                setError("Failed to fetch projects.");
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();

        const fetchCategoryData = async () => {
            try {
                const fetchedCategories = await fetchSkills();
                setCategories(fetchedCategories);
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };

        fetchProjects();
        fetchCategoryData();
    }, [companyId]);

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
            // console.log(result);
            setCurrentBidders(result.data || []);
        } catch (error) {
            console.error("Error fetching bidders:", error);
            setCurrentBidders([]);
        }
    };

    const fetchBiddingCount = async (projectId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/biddings/count/${projectId}`);
            const result = await response.json();
            return result.count || 0;
        } catch (error) {
            console.error("Error fetching bidding count:", error);
            return 0;
        }
    };

    const handleDelete = async (projectId) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;

        try {
            await deleteProject(projectId);
            setProjects((prevProjects) => prevProjects.filter((project) => project._id !== projectId));
            alert("Project deleted successfully!");
        } catch (err) {
            console.error("Error deleting project:", err);
            alert("Failed to delete project.");
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
        // console.log(project);
        setCurrentProject(project);
        await fetchBidders(project._id)
        setBiddersModalOpen(true);
    };

    const handleModalUpdate = async () => {
        if (!currentProject) return;

        try {
            const updatedProject = await updateProject(currentProject._id, currentProject);
            setProjects((prevProjects) =>
                prevProjects.map((project) =>
                    project._id === currentProject._id ? updatedProject : project
                )
            );
            alert("Project updated successfully!");
            setIsModalOpen(false);
        } catch (err) {
            alert("Failed to update project.");
        }
    };

    const cardClass = theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black";
    const modalClass = theme === "dark" ? "bg-gray-900 text-black" : "bg-white text-gray-800";
    const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-300";
    const hoverClass = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100";

    return (
        <div className={`${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} p-6 rounded shadow-md`}>
            <h2 className="text-2xl font-bold mb-6">Your Current Projects</h2>
            {loading && <p className="text-gray-600">Loading projects...</p>}
            {error && <p className="text-red-600">{error}</p>}
            {!loading && !error && projects.length === 0 && (
                <p className="text-gray-600">No projects found.</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div key={project._id} className={`p-4 rounded shadow relative flex flex-col h-full ${cardClass}`}>
                        <div className="flex justify-between items-center">
                            <h4 className="text-xl font-bold">{project.title}</h4>
                            <div className="relative">
                                <button onClick={() => handleMenuToggle(project._id)} className="text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <circle cx="5" cy="12" r="1" />
                                        <circle cx="12" cy="12" r="1" />
                                        <circle cx="19" cy="12" r="1" />
                                    </svg>
                                </button>
                                {activeMenu === project._id && (
                                    <div className={`absolute right-0 mt-2 w-32 border rounded shadow-lg z-50 ${borderColor} ${cardClass}`}>
                                        <button onClick={() => handleUpdate(project)} className={`block w-full text-left px-4 py-2 ${hoverClass}`}>
                                            Update
                                        </button>
                                        <button onClick={() => handleDelete(project._id)} className={`block w-full text-left px-4 py-2 text-red-700 ${hoverClass}`}>
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <p className="mb-4 flex-grow">{project.description.substring(0, 100)}...</p>
                        <div className="mt-auto">
                            <hr className={`my-4 ${borderColor}`} />
                            <div className="flex justify-between items-center">
                                <div>
                                    <button
                                        onClick={() => openBiddersModal(project)}
                                        className={`text-lg font-bold ${hoverClass} py-1 px-3 rounded`}
                                    >
                                        {project.bidCount} Bidders
                                    </button>
                                </div>
                                <div className="text-right">
                                    <p>{format(new Date(project.postedDate || Date.now()), "dd/MM/yyyy")}</p>
                                    <p className="text-sm">Posted Date</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="relative bg-white p-8 rounded-lg shadow-lg max-w-3xl w-full overflow-auto">
                        <h3 className="text-2xl font-bold mb-6 text-center text-black">Update Project</h3>
                        <div className="space-y-4">
                            {/* Project Title */}
                            <div>
                                <label className="block font-medium text-black">Project Title</label>
                                <input
                                    type="text"
                                    value={currentProject?.title || ""}
                                    onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-black"
                                    placeholder="Enter project title"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block font-medium text-black">Description</label>
                                <textarea
                                    value={currentProject?.description || ""}
                                    onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-black"
                                    placeholder="Enter project description "
                                />
                            </div>

                            {/* Categories (Skills Tags) */}
                            <div>
                                <label className="block font-medium  text-black">Categories </label>
                                <div className="w-full p-2 border border-gray-300 rounded-md flex flex-wrap gap-2  text-black">
                                    {categories.map((category) => (
                                        <button
                                            key={category._id}
                                            type="button"
                                            className={`px-3 py-1 rounded-md ${currentProject?.category.includes(category._id) ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-blue-200"}`}
                                            onClick={() => handleCategoryToggle(category._id)}
                                        >
                                            {category.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Duration */}
                            <div>
                                <label className="block font-medium  text-black">Duration (in weeks)</label>
                                <input
                                    type="number"
                                    value={currentProject?.duration || ""}
                                    onChange={(e) => setCurrentProject({ ...currentProject, duration: e.target.value })}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-black"
                                    placeholder="Enter duration in weeks"
                                />
                            </div>

                            {/* Requirements */}
                            <div>
                                <label className="block font-medium  text-black">Requirements</label>
                                <textarea
                                    value={currentProject?.requirements || ""}
                                    onChange={(e) => setCurrentProject({ ...currentProject, requirements: e.target.value })}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2  text-black"
                                    placeholder="Enter project requirements"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button onClick={() => setIsModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">
                                Cancel
                            </button>
                            <button onClick={handleModalUpdate} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {biddersModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className={`relative p-8 rounded-lg shadow-2xl max-w-5xl w-full ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
                        <h3 className="text-2xl font-bold mb-6 text-center">{`Bidders for ${currentProject.title}`}</h3>
                        <ul className="space-y-4">
                            {currentBidders.map((bid) => (
                                <li
                                    key={bid._id}
                                    onClick={() => toast.info(`View Bid: ${bid._id}`, { position: "top-right", autoClose: 3000 })}
                                    className={`flex justify-between items-center p-5 rounded-lg transition-all cursor-pointer ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"
                                        }`}
                                >
                                    <div className="flex items-center w-2/3">
                                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-300 dark:bg-gray-700">
                                            <img
                                                src={bid.freelancer.profileImage ? `http://localhost:3000/images/${bid.freelancer.profileImage}` : "/defaultAvatar.png"}
                                                alt="Freelancer"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-lg font-semibold capitalize">{bid.freelancer.freelancerName || "Unknown Freelancer"}</h4>
                                            <p className="text-sm text-gray-500">
                                                {bid.message.length > 100 ? `${bid.message.substring(0, 100)}...` : bid.message || "No message provided"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right w-1/3">
                                        <p className="text-lg font-bold">NRs {bid.amount}</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(bid.createdAt).toLocaleDateString()} {new Date(bid.createdAt).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="flex justify-end mt-8">
                            <button
                                onClick={() => setBiddersModalOpen(false)}
                                className={`px-6 py-2 font-medium rounded-md transition-all ${theme === "dark" ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-300 hover:bg-gray-400 text-gray-800"
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