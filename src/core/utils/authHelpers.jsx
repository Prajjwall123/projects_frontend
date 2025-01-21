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
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
};

const isUserLoggedIn = () => {
    return !!localStorage.getItem("token");
};

const getUserProfile = async () => {
    const isLoggedIn = isUserLoggedIn();
    if (!isLoggedIn) {
        throw { message: "User is not logged in" };
    }

    const token = localStorage.getItem("token");
    if (!token) {
        throw { message: "Token not found" };
    }

    try {
        const response = await API.get("/auth/get-user-profile", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: "Error fetching user profile" };
    }
};

export { loginUser, registerUser, verifyOTP, logoutUser, isUserLoggedIn, getUserProfile };
