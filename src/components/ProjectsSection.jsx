import React, { useState, useEffect } from "react";
import { getProjectsByCompany, updateProject, deleteProject, fetchSkills } from "../core/utils/projectHelpers";
import { format } from "date-fns";
import BiddersList from "./BiddersList";

const ProjectsSection = ({ companyId, theme }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeMenu, setActiveMenu] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);
    const [categories, setCategories] = useState([]);
    const [activeProjectId, setActiveProjectId] = useState(null);


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
    }, [companyId]);

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

    const toggleBiddersList = (projectId) => {
        setActiveProjectId((prevId) => (prevId === projectId ? null : projectId));
    };

    const cardClass = theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black";
    const borderColor = theme === "dark" ? "border-gray-700" : "border-gray-300";
    const hoverClass = theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100";

    return (
        <div className={`${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} p-6 rounded shadow-md`}>
            <h2 className="text-2xl font-bold mb-6">Your Current Projects</h2>
            {loading && <p className="text-gray-600">Loading projects...</p>}
            {error && <p className="text-red-600">{error}</p>}
            {!loading && !error && projects.length === 0 && <p className="text-gray-600">No projects found.</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div key={project._id} className={`p-4 rounded shadow relative flex flex-col h-full ${cardClass}`}>
                        <div className="flex justify-between items-center">
                            <h4 className="text-xl font-bold">{project.title}</h4>
                        </div>
                        <p className="mb-4 flex-grow">{project.description.substring(0, 100)}...</p>
                        <div className="mt-auto">
                            <hr className={`my-4 ${borderColor}`} />
                            <div className="flex justify-between items-center">
                                <div>
                                    <button
                                        onClick={() => toggleBiddersList(project._id)}
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

                        {activeProjectId === project._id && (
                            <div className="mt-4">
                                <BiddersList projectId={project._id} theme={theme} />
                            </div>
                        )}
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

        </div>
    );
};

export default ProjectsSection;
