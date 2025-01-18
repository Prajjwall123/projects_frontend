import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../utils/authHelpers";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        role: "freelancer",
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);

        if (!formData.role) {
            setError("Role is required");
            return;
        }

        try {
            const response = await registerUser(formData);
            console.log(response);
            navigate("/verify-otp", { state: { email: formData.email } });
        } catch (err) {
            setError(err.message || "Registration failed");
        }
    };

    return (
        <div>
            <h1>Register</h1>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input name="name" placeholder="Full Name" onChange={handleChange} required />
                <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
                <input name="phone" type="text" placeholder="Phone Number" onChange={handleChange} required />

                <select name="role" onChange={handleChange} value={formData.role} required>
                    <option value="freelancer">Freelancer</option>
                    <option value="company">Company</option>
                </select>

                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
