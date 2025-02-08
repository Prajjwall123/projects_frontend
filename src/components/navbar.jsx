import React, { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import logo from "../assets/logo.png";
import defaultProfilePicture from "../assets/default_profile_picture.jpg";
import { logoutUser, getUserProfile } from "../core/utils/authHelpers";
import { useNavigate } from "react-router-dom";

const Navbar = ({ theme, toggleTheme }) => {
    const [avatarUrl, setAvatarUrl] = useState(defaultProfilePicture);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                if (localStorage.getItem("token")) {
                    const profile = await getUserProfile();
                    if (profile) {
                        const imageUrl = profile.profile.profileImage || profile.profile.logo;
                        if (imageUrl) {
                            setAvatarUrl(`http://localhost:3000/${imageUrl}`);
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
            navigate("/freelancer", { state: { freelancerId: userId } });
        } else if (profile.role === "company" && userId) {
            navigate("/company", { state: { companyId: userId } });
        } else {
            console.log("No user logged in");
        }
    };

    return (
        <div className="navbar bg-black text-white sticky top-0 z-50">
            <div className="navbar-start">
                <a className="btn btn-ghost text-xl">
                    <img src={logo} alt="Logo" className="h-10" />
                </a>
            </div>

            <div className="flex-none">
                <ul className="menu menu-horizontal px-1 font-sans">
                    <li>
                        <details>
                            <summary className="font-bold">Find Projects</summary>
                            <ul className="p-2 bg-black">
                                <li><a>App Development</a></li>
                                <li><a>Web Development</a></li>
                            </ul>
                        </details>
                    </li>
                    <li>
                        <details>
                            <summary className="font-bold">Find Freelancers</summary>
                            <ul className="p-2 bg-black">
                                <li><a>Top Rated</a></li>
                                <li><a>Best Performers</a></li>
                            </ul>
                        </details>
                    </li>
                    <li><a className="font-bold">About Us</a></li>
                </ul>
            </div>

            <div className="navbar-end flex items-center gap-2">
                {/* Theme Toggle Button */}
                <button
                    onClick={toggleTheme}
                    className="btn btn-outline flex items-center justify-center gap-2"
                >
                    {theme === "light" ? <FaMoon className="text-blue-400" /> : <FaSun className="text-yellow-400" />}
                </button>

                <div className="form-control">
                    <input
                        type="text"
                        placeholder="Search Projects"
                        className="input input-bordered w-24 md:w-auto"
                    />
                </div>

                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img alt="Avatar" src={avatarUrl} />
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                    >
                        <li><a onClick={handleProfileClick}>Profile</a></li>
                        <li><a>Settings</a></li>
                        <li>
                            <a onClick={handleLogout}>
                                Logout
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
