import React, { useState, useEffect } from "react";
import { createProject, fetchSkills } from "../core/utils/projectHelpers";

const PostProjectForm = ({ companyId, onProjectCreated }) => {
    const [project, setProject] = useState({
        title: "",
        description: "",
        requirements: "",
        duration: "",
        category: [],
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                const fetchedCategories = await fetchSkills();
                setCategories(fetchedCategories);
            } catch (err) {
                console.error("Error fetching categories:", err);
                setError("Failed to fetch categories.");
            }
        };

        fetchCategoryData();
    }, []);

    const handleChange = (e) => {
        setProject({ ...project, [e.target.name]: e.target.value });
    };

    const handleCategoryToggle = (categoryId) => {
        setProject((prevProject) => ({
            ...prevProject,
            category: prevProject.category.includes(categoryId)
                ? prevProject.category.filter((id) => id !== categoryId)
                : [...prevProject.category, categoryId],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!companyId) {
            setError("Company ID is missing.");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        const projectData = {
            ...project,
            company: companyId,
            postedDate: new Date(),
            status: "posted",
        };

        try {
            const newProject = await createProject(projectData);
            setSuccess(true);
            setProject({ title: "", description: "", requirements: "", duration: "", category: [] });
            if (onProjectCreated) {
                onProjectCreated(newProject);
            }
        } catch (err) {
            setError(err.message || "Failed to create project.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded shadow">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700">Project Title</label>
                    <input
                        type="text"
                        name="title"
                        value={project.title}
                        onChange={handleChange}
                        required
                        className="w-full border rounded px-3 py-2"
                        placeholder="Enter project title"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Project Description</label>
                    <textarea
                        name="description"
                        value={project.description}
                        onChange={handleChange}
                        required
                        className="w-full border rounded px-3 py-2"
                        placeholder="Enter project description"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Categories</label>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <button
                                key={category._id}
                                type="button"
                                className={`px-3 py-1 rounded ${project.category.includes(category._id)
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
                        name="requirements"
                        value={project.requirements}
                        onChange={handleChange}
                        required
                        className="w-full border rounded px-3 py-2"
                        placeholder="Enter project requirements"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Duration (in weeks)</label>
                    <input
                        type="number"
                        name="duration"
                        value={project.duration}
                        onChange={handleChange}
                        required
                        className="w-full border rounded px-3 py-2"
                        placeholder="Enter project duration"
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className={`px-4 py-2 text-white rounded ${loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"}`}
                        disabled={loading}
                    >
                        {loading ? "Posting..." : "Post Project"}
                    </button>
                </div>
            </form>

            {success && <p className="text-green-600 mt-4">Project posted successfully!</p>}
            {error && <p className="text-red-600 mt-4">{error}</p>}
        </div>
    );
};

export default PostProjectForm;
