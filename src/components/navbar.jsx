import React, { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import logo from "../assets/logo.png";
import blackLogo from "../assets/black-logo.png";
import defaultProfilePicture from "../assets/default_profile_picture.jpg";
import { logoutUser, getUserProfile } from "../core/utils/authHelpers";
import { useNavigate } from "react-router-dom";

const Navbar = ({ theme, toggleTheme }) => {
    const [avatarUrl, setAvatarUrl] = useState(defaultProfilePicture);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();
    const [currentTheme, setCurrentTheme] = useState(theme);

    useEffect(() => {
        setCurrentTheme(theme);
    }, [theme]);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                if (localStorage.getItem("token")) {
                    const profile = await getUserProfile();
                    if (profile) {
                        const imageUrl = profile.profile.profileImage || profile.profile.logo;
                        if (imageUrl) {
                            const avatarPath = profile.role === "freelancer"
                                ? `http://localhost:3000/${imageUrl}`
                                : `http://localhost:3000/${imageUrl}`;
                            setAvatarUrl(avatarPath);
                        }
                        setUserId(profile.profile._id);
                    }
                }
            } catch (error) {
                console.error("Error fetching user profile:", error.message);
            }
        };

        fetchUserProfile();
    }, []);

    const handleLogout = () => {
        logoutUser();
    };

    const handleProfileClick = async () => {
        const profile = await getUserProfile();
        if (profile.role === "freelancer" && userId) {
            navigate(`/freelancer/${userId}`);
        } else if (profile.role === "company" && userId) {
            navigate(`/company/${userId}`);
        }
    };


    return (
        <div
            className={`navbar sticky top-0 z-50 border-b ${currentTheme === "light"
                ? "bg-white text-black shadow-md border-gray-300"
                : "bg-black text-white shadow-lg border-gray-800"
                }`}
        >
            <div className="navbar-start">
                <a href="/" className="btn btn-ghost text-xl">
                    <img src={currentTheme === "light" ? blackLogo : logo} alt="Logo" className="h-10" />
                </a>
            </div>

            <div className="flex-none">
                <ul className="menu menu-horizontal px-1 font-sans">
                    <li>
                        <details>
                            <summary className={`${currentTheme === "light" ? "text-black" : "text-white"} font-bold`}>Find Projects</summary>
                            <ul className={`rounded-t-none p-2 ${currentTheme === "light" ? "bg-white text-black border border-gray-300" : "bg-black text-white border border-gray-800"}`}>
                                <li><a>App Development</a></li>
                                <li><a>Web Development</a></li>
                            </ul>
                        </details>
                    </li>
                    <li>
                        <details>
                            <summary className={`${currentTheme === "light" ? "text-black" : "text-white"} font-bold`}>Find Freelancers</summary>
                            <ul className={`rounded-t-none p-2 ${currentTheme === "light" ? "bg-white text-black border border-gray-300" : "bg-black text-white border border-gray-800"}`}>
                                <li><a>Top Rated</a></li>
                                <li><a>Best Performers</a></li>
                            </ul>
                        </details>
                    </li>
                    <li><a className={`${currentTheme === "light" ? "text-black" : "text-white"} font-bold`}>About Us</a></li>
                </ul>
            </div>

            <div className="navbar-end flex items-center gap-2">
                <button
                    onClick={toggleTheme}
                    className={`btn btn-outline flex items-center justify-center gap-2 ${currentTheme === "light" ? "text-black border-black" : "text-white border-white"}`}
                >
                    {currentTheme === "light" ? (
                        <FaMoon className="text-blue-400" />
                    ) : (
                        <FaSun className="text-yellow-400" />
                    )}
                </button>

                <div className="form-control">
                    <input
                        type="text"
                        placeholder="Search Projects"
                        className={`input input-bordered ${currentTheme === "light" ? "bg-gray-100 text-black border-gray-300" : "bg-gray-800 text-white border-gray-700"} w-24 md:w-auto`}
                    />
                </div>

                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className={`w-10 h-10 rounded-full overflow-hidden ${currentTheme === "light" ? "bg-gray-300" : "bg-gray-800"}`}>
                            <img alt="Avatar" src={avatarUrl} className="object-cover w-full h-full" />
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className={`menu menu-sm dropdown-content rounded-lg z-[1] mt-3 w-52 p-2 shadow-lg ${currentTheme === "light" ? "bg-white text-black border border-gray-300" : "bg-black text-white border border-gray-800"}`}
                    >
                        <li><a onClick={handleProfileClick}>Profile</a></li>
                        <li><a>Settings</a></li>
                        <li><a onClick={handleLogout}>Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
