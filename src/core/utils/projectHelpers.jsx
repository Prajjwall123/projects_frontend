import API from './api';

export const fetchSkillNames = async (skillIds) => {
    try {
        const skillNames = await Promise.all(
            skillIds.map(async (id) => {
                const response = await API.get(`/skills/${id}`);
                return response.data.name;
            })
        );
        return skillNames;
    } catch (error) {
        console.error("Error fetching skill names:", error);
        throw error;
    }
};

export const fetchProjects = async () => {
    try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await API.get("projects/", { headers });
        const projects = response.data;

        const projectsWithSkills = await Promise.all(
            projects.map(async (project) => {
                if (project.category && project.category.length > 0) {
                    const skillNames = await fetchSkillNames(project.category);
                    project.category = skillNames;
                }
                return project;
            })
        );

        return projectsWithSkills;
    } catch (error) {
        console.error("Error fetching projects:", error);
        throw error;
    }
};

export const createProject = async (projectData) => {
    try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await API.post("projects/", projectData, { headers });
        console.log("Project created successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error creating project:", error);
        throw error;
    }
};

export const fetchSkills = async () => {
    try {
        const response = await API.get("/skills");
        return response.data;
    } catch (error) {
        console.error("Error fetching skills:", error);
        return [];
    }
};