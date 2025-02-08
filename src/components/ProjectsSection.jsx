import React, { useState, useEffect } from "react";
import { getProjectsByCompany, updateProject, deleteProject } from "../core/utils/projectHelpers";
import { format } from "date-fns";

const ProjectsSection = ({ companyId }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeMenu, setActiveMenu] = useState(null);

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

        fetchProjects();
    }, [companyId]);

    const handleMenuToggle = (projectId) => {
        setActiveMenu(activeMenu === projectId ? null : projectId);
    };

    const handleUpdate = async (projectId) => {
        const updatedTitle = prompt("Enter new title for the project:");
        if (!updatedTitle) return;

        try {
            const updatedProject = await updateProject(projectId, { title: updatedTitle });
            setProjects((prevProjects) =>
                prevProjects.map((project) =>
                    project._id === projectId ? { ...project, title: updatedProject.title } : project
                )
            );
            alert("Project updated successfully!");
        } catch (err) {
            alert("Failed to update project.");
        }
    };

    const handleDelete = async (projectId) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;

        try {
            await deleteProject(projectId);
            setProjects((prevProjects) => prevProjects.filter((project) => project._id !== projectId));
            alert("Project deleted successfully!");
        } catch (err) {
            alert("Failed to delete project.");
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
                                            onClick={() => handleUpdate(project._id)}
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
        </div>
    );
};

export default ProjectsSection;
