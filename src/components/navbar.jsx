import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import defaultProfilePicture from '../assets/default_profile_picture.jpg';
import { logoutUser } from '../core/utils/authHelpers';
import { getUserProfile } from '../core/utils/authHelpers';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [avatarUrl, setAvatarUrl] = useState(defaultProfilePicture);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                if (localStorage.getItem('token')) {
                    const profile = await getUserProfile();
                    // console.log(profile);
                    if (profile) {
                        const imageUrl = profile.profile.profileImage || profile.profile.logo;
                        if (imageUrl) {
                            setAvatarUrl(`http://localhost:3000/images/${imageUrl}`);
                            // console.log(`http://localhost:3000/images/${imageUrl}`);
                        }
                        setUserId(profile.profile._id);
                        // console.log(profile.profile._id);
                    }
                }
            } catch (error) {
                console.error('Error fetching user profile:', error.message);
            }
        };

        fetchUserProfile();
    }, []);

    const handleLogout = () => {
        logoutUser();
    };

    const handleProfileClick = async () => {
        const profile = await getUserProfile();
        // console.log("after profile click", profile);
        if (profile.role == "freelancer") {
            // console.log(profile.profile);
            if (userId) {
                navigate("/freelancer", { state: { freelancerId: userId } });
            }
        } else if (profile.role == "company") {
            // console.log(profile.profile.companyId);
            if (userId) {
                navigate("/company", { state: { companyId: userId } });
            }
        }
        else {
            console.log("no user logged in");
        }

    };

    return (
        <div className="navbar bg-black">
            <div className="navbar-start">
                <a className="btn btn-ghost text-xl">
                    <img src={logo} alt="Logo" className="h-10" />
                </a>
            </div>

            <div className="flex-none">
                <ul className="menu menu-horizontal px-1 text-white font-sans">
                    <li>
                        <details>
                            <summary className="text-white hover:text-white font-bold">Find Projects</summary>
                            <ul className="bg-black rounded-t-none p-2 text-white">
                                <li><a className="text-white hover:text-white">App Development</a></li>
                                <li><a className="text-white hover:text-white">Web Development</a></li>
                            </ul>
                        </details>
                    </li>
                    <li>
                        <details>
                            <summary className="text-white hover:text-white font-bold">Find Freelancers</summary>
                            <ul className="bg-black rounded-t-none p-2 text-white">
                                <li><a className="text-white hover:text-white">Top Rated</a></li>
                                <li><a className="text-white hover:text-white">Best Performers</a></li>
                            </ul>
                        </details>
                    </li>
                    <li><a className="text-white hover:text-white font-bold">About Us</a></li>
                </ul>
            </div>

            <div className="navbar-end flex items-center gap-2">
                <div className="form-control">
                    <input
                        type="text"
                        placeholder="Search Projects"
                        className="input input-bordered w-24 md:w-auto"
                    />
                </div>
                <div className="dropdown dropdown-end">
                    <div
                        tabIndex={0}
                        role="button"
                        className="btn btn-ghost btn-circle avatar"
                    >
                        <div className="w-10 rounded-full">
                            <img
                                alt="Avatar"
                                src={avatarUrl}
                            />
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        <li>
                            <a className="justify-between" onClick={handleProfileClick}>
                                Profile
                            </a>
                        </li>
                        <li><a>Settings</a></li>
                        <li><a onClick={handleLogout} className="cursor-pointer">
                            Logout
                        </a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
