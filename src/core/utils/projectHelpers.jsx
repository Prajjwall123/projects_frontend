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
        return response.data || [];
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


export const createBid = async (formData) => {
    try {
        const response = await API.post("biddings/create", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating bid:", error);
        throw error.response ? error.response.data : { message: "An error occurred while placing the bid" };
    }
};

export const getBidById = async (bidId) => {
    try {
        const response = await API.get(`biddings/${bidId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching bid details:", error);
        throw error.response ? error.response.data : { message: "An error occurred while fetching the bid details" };
    }
};

export const getBiddingCountByProject = async (projectId) => {
    try {
        const response = await API.get(`biddings/count/${projectId}`);
        return response.data.count;
    } catch (error) {
        console.error("Error fetching bidding count:", error);
        throw error.response ? error.response.data : { message: "An error occurred while fetching the bidding count" };
    }
};



export const updateProjectStatus = async (projectId, freelancerId) => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("Unauthorized: No token found");
        }

        const response = await API.put(
            `/projects/${projectId}`,
            {
                status: "awarded",
                awardedTo: freelancerId,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        console.log(" Project successfully awarded:", response.data);
        return response.data;
    } catch (error) {
        console.error(" Error updating project status:", error.response?.data || error.message);
        throw error;
    }
};


export const getProjectsByFreelancerId = async (freelancerId) => {
    try {
        const response = await API.get(`projects/freelancer/${freelancerId}`);
        console.log("this freelancer has these projects:", response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching projects for freelancer:', error);
        throw error;
    }
};


export const updateProjectStatusInBackend = async (projectId, status, link = "", message = "") => {
    try {
        const token = localStorage.getItem("token");
        console.log(token);

        const response = await API.put(
            `/projects/${projectId}`,
            {
                status,
                feedbackRequestedMessage: status === "Feedback Requested" ? message : undefined,
                link: status === "Feedback Requested" ? link : undefined,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error updating project status:", error);
        throw error;
    }
};


export const deleteBid = async (bidId) => {
    if (!bidId) {
        console.error("Bid ID is required to delete a bid.");
        return;
    }

    const confirmDelete = window.confirm("Are you sure you want to reject this bid?");
    if (!confirmDelete) return;

    try {
        const token = localStorage.getItem("token");
        const response = await API.delete(`/biddings/delete/${bidId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("Bid rejected successfully:", response.data);
        toast.success("Bid has been rejected successfully!");

        return response.data;
    } catch (error) {
        console.error("Error rejecting bid:", error.response?.data || error.message);
        toast.error("Failed to reject bid. Please try again.");
        throw error;
    }
};

export const fetchProjectsByCategory = async (categoryId) => {
    try {
        const endpoint = categoryId && categoryId !== "" ? `/projects/category/${categoryId}` : "/projects";
        const response = await API.get(endpoint);
        return response.data;
    } catch (error) {
        console.error("Error fetching projects by category:", error);
        return [];
    }
};