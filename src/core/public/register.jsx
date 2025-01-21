import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../utils/authHelpers";
import Logo from '../../assets/black-logo.png';

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
        if (!formData.role) {
            setError("Role is required");
            return;
        }

        try {
            const response = await registerUser(formData);
            navigate("/verify-otp", { state: { email: formData.email } });
        } catch (err) {
            setError(err.message || "Registration failed");
        }
    };

    return (
        <div className="bg-base-200 font-[sans-serif]">
            <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
                <div className="max-w-md w-full">
                    <a href="javascript:void(0)">
                        <img src={Logo} alt="logo" className="w-80 mb-8 mx-auto block" />
                    </a>

                    <div className="p-8 rounded-2xl bg-white shadow">
                        <h2 className="text-gray-800 text-center text-2xl font-bold">Register</h2>
                        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
                        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                            <div>
                                <label className="text-gray-800 text-sm mb-2 block">Full Name</label>
                                <input
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                                    placeholder="Enter your full name"
                                />
                            </div>
                            <div>
                                <label className="text-gray-800 text-sm mb-2 block">Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div>
                                <label className="text-gray-800 text-sm mb-2 block">Password</label>
                                <input
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                                    placeholder="Enter your password"
                                />
                            </div>
                            <div>
                                <label className="text-gray-800 text-sm mb-2 block">Phone Number</label>
                                <input
                                    name="phone"
                                    type="text"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                                    placeholder="Enter your phone number"
                                />
                            </div>
                            <div>
                                <label className="text-gray-800 text-sm mb-2 block">I am a ...</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    required
                                    className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                                >
                                    <option value="freelancer">Freelancer</option>
                                    <option value="company">Company</option>
                                </select>
                            </div>
                            <div className="!mt-8">
                                <button
                                    type="submit"
                                    className="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                                >
                                    Register
                                </button>
                            </div>
                            <p className="text-gray-800 text-sm !mt-8 text-center">
                                Already have an account? <a href="/login" className="text-blue-600 hover:underline ml-1 font-semibold">Sign in</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
