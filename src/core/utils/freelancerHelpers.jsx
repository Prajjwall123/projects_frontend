import API from './api';

const createFreelancerProfile = async (freelancerData, profileImage) => {
    try {
        // Create a new FormData instance
        const formData = new FormData();

        // Append the text fields to FormData
        for (const key in freelancerData) {
            formData.append(key, freelancerData[key]);
        }

        // Append the profile image to FormData
        if (profileImage) {
            formData.append("file", profileImage);
        }

        // Send the form data with headers specifying "multipart/form-data"
        const response = await API.post("freelancers/", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return response.data;
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        throw error.response ? error.response.data : { message: "Network error" };
    }
};

export { createFreelancerProfile };
