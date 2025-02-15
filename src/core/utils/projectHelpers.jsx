import API from './api';

export const fetchProjects = async () => {
    try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const response = await API.get("projects/", { headers });
        const projects = response.data;

        const projectsWithCategoryNames = projects.map((project) => ({
            ...project,
            category: project.category.filter((name) => name !== null)
        }));

        return projectsWithCategoryNames;
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

export const getFullProjectDetails = async (projectId) => {
    try {
        const response = await API.get(`projects/${projectId}`);
        const projectData = response.data;

        projectData.category = projectData.category.filter((name) => name !== null);

        return projectData;
    } catch (error) {
        console.error("Error fetching full project details:", error);
        throw error;
    }
};


export const createBid = async (freelancerId, projectId, amount, message) => {
    try {
        const response = await API.post("biddings/create", {
            freelancer: freelancerId,
            project: projectId,
            amount,
            message,
        });
        return response.data;
    } catch (error) {
        console.error("Error creating bid:", error);
        throw error.response ? error.response.data : { message: "An error occurred while placing the bid" };
    }
};
