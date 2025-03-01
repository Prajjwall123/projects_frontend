import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Logo from '../../assets/black-logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Register = () => {
    const [credentials, setCredentials] = useState({ email: "", password: "", confirmPassword: "" });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (credentials.password !== credentials.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        navigate("/register-second", { state: { email: credentials.email, password: credentials.password } });
    };


    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleToggleConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="bg-base-200 font-[sans-serif]">
            <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
                <div className="max-w-md w-full">
                    <a href="javascript:void(0)">
                        <img src={Logo} alt="logo" className="w-80 mb-8 mx-auto block" />
                    </a>

                    <ol className="items-center w-full flex justify-center space-x-8 sm:space-y-0 mb-6">
                        <li className="flex items-center text-xl text-blue-800 dark:text-blue-500 space-x-2.5 rtl:space-x-reverse">
                            <span className="flex items-center justify-center w-8 h-8 border border-blue-600 rounded-full shrink-0 dark:border-blue-500">
                                1
                            </span>
                            <span>
                                <h3 className="font-medium leading-tight">Account Info</h3>

                            </span>
                        </li>

                        <li className="flex items-center text-gray-500 dark:text-gray-400 space-x-2.5 rtl:space-x-reverse">
                            <span className="flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
                                2
                            </span>
                            <span>
                                <h3 className="font-medium leading-tight">Profile Info</h3>

                            </span>
                        </li>

                        <li className="flex items-center text-gray-500 dark:text-gray-400 space-x-2.5 rtl:space-x-reverse">
                            <span className="flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
                                3
                            </span>
                            <span>
                                <h3 className="font-medium leading-tight">OTP Verification</h3>

                            </span>
                        </li>
                    </ol>
                    <div className="p-8 rounded-2xl bg-white shadow">
                        <h2 className="text-gray-800 text-center text-2xl font-bold">Create an Account</h2>
                        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
                        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                            <div>
                                <label className="text-gray-800 text-sm mb-2 block">Email Address</label>
                                <div className="relative flex items-center">
                                    <input
                                        name="email"
                                        type="email"
                                        value={credentials.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                                        placeholder="Enter Email Address"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-gray-800 text-sm mb-2 block">Password</label>
                                <div className="relative flex items-center">
                                    <input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={credentials.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                                        placeholder="Enter password"
                                    />
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="#bbb"
                                        stroke="#bbb"
                                        className="w-4 h-4 absolute right-4 cursor-pointer"
                                        viewBox="0 0 24 24"
                                        onClick={handleTogglePassword}
                                    >
                                        {showPassword ? (
                                            <FontAwesomeIcon icon={faEyeSlash} />
                                        ) : (
                                            <FontAwesomeIcon icon={faEye} />
                                        )}
                                    </svg>
                                </div>
                            </div>

                            <div>
                                <label className="text-gray-800 text-sm mb-2 block">Confirm Password</label>
                                <div className="relative flex items-center">
                                    <input
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={credentials.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                                        placeholder="Confirm password"
                                    />
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="#bbb"
                                        stroke="#bbb"
                                        className="w-4 h-4 absolute right-4 cursor-pointer"
                                        viewBox="0 0 24 24"
                                        onClick={handleToggleConfirmPassword}
                                    >
                                        {showConfirmPassword ? (
                                            <FontAwesomeIcon icon={faEyeSlash} />
                                        ) : (
                                            <FontAwesomeIcon icon={faEye} />
                                        )}
                                    </svg>
                                </div>
                            </div>

                            <div className="!mt-8">
                                <button
                                    type="submit"
                                    className="btn bg-black text-white hover:text-black w-full"
                                >
                                    Next
                                </button>
                            </div>

                            <p className="text-gray-800 text-sm !mt-8 text-center">
                                Already have an account? <a href="/login" className="text-blue-600 hover:underline ml-1 whitespace-nowrap font-semibold">Login here</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Register;
