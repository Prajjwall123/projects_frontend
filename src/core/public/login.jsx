import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../utils/authHelpers";
import { useAuth } from "../context/authContext";

const LoginPage = () => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [error, setError] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser(credentials);
            login({ token: response.token, user: response.user });
            localStorage.setItem("token", response.token);
            navigate("/");
        } catch (err) {
            setError(err.message || "Login failed");
        }
    };

    return (
        <div>
            <h1>Login</h1>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;
