import React, { useState, useEffect } from "react";
import { getUserProfile } from "../core/utils/authHelpers";
import { fetchSkills, createProject } from "../core/utils/projectHelpers"; // Importing the helper methods

const ProjectsSection = () => {
    const [project, setProject] = useState({
        title: "",
        requirements: "",
        description: "",
        duration: "",
        category: [],
    });
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [companyId, setCompanyId] = useState(null);

    useEffect(() => {
        const initializeData = async () => {
            try {
                // Fetch company ID
                const profile = await getUserProfile();
                if (profile.role === "company") {
                    setCompanyId(profile.profile._id);
                } else {
                    setError("Only companies can post projects.");
                }

                // Fetch skills
                const allSkills = await fetchSkills();
                setSkills(allSkills);
            } catch (err) {
                setError("Failed to initialize data.");
            }
        };

        initializeData();
    }, []);

    const handleChange = (e) => {
        setProject({ ...project, [e.target.name]: e.target.value });
    };

    const handleSkillToggle = (skillId) => {
        setProject((prev) => ({
            ...prev,
            category: prev.category.includes(skillId)
                ? prev.category.filter((id) => id !== skillId)
                : [...prev.category, skillId],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!companyId) return;

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
            await createProject(projectData); // Use createProject from helper methods
            setSuccess(true);
            setProject({ title: "", requirements: "", description: "", duration: "", category: [] });
        } catch (err) {
            setError(err.message || "Failed to create project.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded shadow">
            <h3 className="text-lg font-bold mb-4">Post a New Project</h3>
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
                    <label className="block text-gray-700">Categories</label>
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                            <button
                                key={skill._id}
                                type="button"
                                className={`px-2 py-1 rounded ${project.category.includes(skill._id) ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                                onClick={() => handleSkillToggle(skill._id)}
                            >
                                {skill.name}
                            </button>
                        ))}
                    </div>
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

export default ProjectsSection;
