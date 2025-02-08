import React, { useState, useEffect } from "react";
import { getProjectsByCompany, updateProject, deleteProject, fetchSkills } from "../core/utils/projectHelpers";
import { format } from "date-fns";

const ProjectsSection = ({ companyId }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeMenu, setActiveMenu] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            if (!companyId) return;
            setLoading(true);
            setError(null);
            try {
                const projectsData = await getProjectsByCompany(companyId);
                setProjects(projectsData);
            } catch (err) {
                console.error("Error fetching projects:", err);
                setError("Failed to fetch projects.");
            } finally {
                setLoading(false);
            }
        };

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

    return (
        <div className="bg-gray-100 p-6 rounded shadow-md">
            <h2 className="text-2xl font-bold mb-6">Your Current Projects</h2>
            {loading && <p className="text-gray-600">Loading projects...</p>}
            {error && <p className="text-red-600">{error}</p>}
            {!loading && !error && projects.length === 0 && (
                <p className="text-gray-600">No projects found.</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div key={project._id} className="bg-white p-4 rounded shadow relative flex flex-col h-full">
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
                                    <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-50">
                                        <button
                                            onClick={() => handleUpdate(project)}
                                            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => handleDelete(project._id)}
                                            className="block w-full text-left px-4 py-2 text-red-700 hover:bg-red-100"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <p className="text-gray-700 mb-4 flex-grow">{project.description.substring(0, 100)}...</p>
                        <div className="mt-auto">
                            <hr className="my-4 border-gray-300" />
                            <div className="flex justify-between items-center text-gray-600">
                                <div>
                                    <p className="text-lg font-bold">10</p>
                                    <p>Bidders</p>
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
                    <div className="bg-white p-6 rounded shadow-lg w-1/3">
                        <h3 className="text-lg font-bold mb-4">Update Project</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700">Project Title</label>
                                <input
                                    type="text"
                                    value={currentProject?.title}
                                    onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Description</label>
                                <textarea
                                    value={currentProject?.description}
                                    onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Categories</label>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map((category) => (
                                        <button
                                            key={category._id}
                                            type="button"
                                            className={`px-3 py-1 rounded ${currentProject?.category.includes(category._id)
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-200 hover:bg-blue-200"
                                                }`}
                                            onClick={() => handleCategoryToggle(category._id)}
                                        >
                                            {category.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-700">Requirements</label>
                                <textarea
                                    value={currentProject?.requirements}
                                    onChange={(e) => setCurrentProject({ ...currentProject, requirements: e.target.value })}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Duration (in weeks)</label>
                                <input
                                    type="number"
                                    value={currentProject?.duration}
                                    onChange={(e) => setCurrentProject({ ...currentProject, duration: e.target.value })}
                                    className="w-full border rounded px-3 py-2"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end mt-6">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleModalUpdate}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
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
