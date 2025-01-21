import axios from "axios";

export const fetchProjects = async () => {
    try {
        const token = localStorage.getItem("token");

        const headers = token
            ? { Authorization: `Bearer ${token}` }
            : {};

        const response = await axios.get("http://localhost:3000/api/projects/", {
            headers,
        });

        console.log(response);
        return response.data;
    } catch (error) {
        console.error("Error fetching projects:", error);
        throw error;
    }
};
