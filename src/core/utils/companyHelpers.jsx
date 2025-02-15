import API from './api';

export const getCompanyById = async (companyId) => {
    try {
        const response = await API.get(`companies/${companyId}`);
        console.log(companyId);
        return response.data;
    } catch (error) {
        console.error('Error fetching company data:', error);
        throw error;
    }
};

const uploadImage = async (imageFile) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authorization token not found");

        const imageData = new FormData();
        imageData.append("image", imageFile);

        const uploadResponse = await API.post("/auth/upload", imageData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (uploadResponse.data && uploadResponse.data.imageUrl) {
            return uploadResponse.data.imageUrl;
        } else {
            throw new Error("Failed to retrieve uploaded image URL");
        }
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
};


// Handle Updating the Company Profile
export const handleUpdateProfile = async (formData, companyId) => {
    try {
        let logoUrl = formData.logo;
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authorization token not found");

        // Check if the logo is a newly selected image and upload it
        if (formData.logo.startsWith("blob:")) {
            const imageFile = document.getElementById("logoInput").files[0];
            logoUrl = await uploadImage(imageFile); // Await the image upload
        }

        // Prepare the updated profile data
        const updatedProfile = {
            companyName: formData.companyName,
            companyBio: formData.companyBio,
            founded: formData.founded,
            ceo: formData.ceo,
            headquarters: formData.headquarters,
            industry: formData.industry,
            employees: formData.employees,
            website: formData.website,
            logo: logoUrl,
        };

        // Update the company profile
        await API.put(`companies/${companyId}`, updatedProfile, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return { success: true };
    } catch (error) {
        console.error("Error updating company profile:", error);
        return { success: false, error };
    }
};
