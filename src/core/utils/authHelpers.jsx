import API from './api';

const loginUser = async (credentials) => {
    try {
        const response = await API.post("/auth/login", credentials);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: "Network error" };
    }
};

const registerUser = async (userData) => {
    try {
        const response = await API.post("/auth/register", userData);
        return response.data;
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        throw error.response ? error.response.data : { message: "Network error" };
    }
};

const verifyOTP = async (payload) => {
    try {
        const response = await API.post("/auth/verify-otp", payload);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: "Network error" };
    }
};

const logoutUser = () => {
    try {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
    } catch (error) {
        console.error("Error during logout:", error.message);
    }
};

export { loginUser, registerUser, verifyOTP, logoutUser };
