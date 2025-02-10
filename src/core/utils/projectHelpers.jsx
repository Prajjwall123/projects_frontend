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
        //console.log("Project created successfully:", response.data);
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

export const getProjectsByCompany = async (companyId) => {
    try {
        const response = await API.get(`projects/getByCompany/${companyId}`);
        //console.log(response);
        return response.data;
    } catch (error) {
        console.error('Error fetching projects by company:', error);
        throw error;
    }
};

const getAuthToken = () => localStorage.getItem("token");

export const updateProject = async (projectId, projectData) => {
    try {
        const token = getAuthToken();
        const response = await API.put(`/projects/${projectId}`, projectData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating project:", error);
        throw error;
    }
};

export const deleteProject = async (projectId) => {
    try {
        const token = getAuthToken();
        const response = await API.delete(`/projects/${projectId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting project:", error);
        throw error;
    }
};