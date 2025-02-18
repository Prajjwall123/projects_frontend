import API from './api';

export const getFreelancerById = async (freelancerId) => {
    try {
        console.log("called for freelancer");
        const response = await API.get(`freelancers/${freelancerId}`);
        console.log(response);
        return response.data;
    } catch (error) {
        console.error('Error fetching freelancer data:', error);
        throw error;
    }
};

export const updateFreelancerById = async (freelancerId, updateData) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No authentication token found. Please log in.");
        }

        const response = await API.put(`/freelancers/${freelancerId}`, updateData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error updating freelancer:", error.response?.data || error.message);
        throw error.response?.data || { message: "An error occurred while updating the freelancer." };
    }
};
