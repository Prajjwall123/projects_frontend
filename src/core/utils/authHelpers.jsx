import API from './api';

const loginUser = async (credentials) => {
    try {
        const response = await API.post("/auth/login", credentials);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: "Network error" };
    }
};

// Fetch skills from database
const fetchSkills = async () => {
    try {
        const response = await API.get("/skills");
        return response.data;
    } catch (error) {
        console.error("Error fetching skills:", error);
        return [];
    }
};

//uplolad image
const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
        const response = await API.post("/auth/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data.imageUrl;
    } catch (error) {
        console.error("Image upload failed:", error);
        throw error;
    }
};

// Register user
const registerUser = async (userData) => {
    try {
        const response = await API.post("/auth/register", userData);
        return response.data;
    } catch (error) {
        console.error("Registration failed:", error);
        throw error;
    }
};



const verifyOTP = async (payload, navigate) => {
    try {
        const response = await API.post("/auth/verify-otp", payload);
        const verifiedUser = response.data;
        return verifiedUser;
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        throw error.response ? error.response.data : { message: "Network error" };
    }
};



const logoutUser = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
};

const isUserLoggedIn = () => {
    return !!localStorage.getItem("token");
};

const getUserProfile = async () => {
    console.log("get user profile called");
    const isLoggedIn = isUserLoggedIn();
    if (!isLoggedIn) {
        throw { message: "User is not logged in" };
    }

    const token = localStorage.getItem("token");
    if (!token) {
        throw { message: "Token not found" };
    }

    try {
        const response = await API.post("/auth/get-user-profile", {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // console.log(response.data);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: "Error fetching user profile" };
    }
};

export { loginUser, registerUser, verifyOTP, logoutUser, isUserLoggedIn, getUserProfile, fetchSkills, uploadImage };
