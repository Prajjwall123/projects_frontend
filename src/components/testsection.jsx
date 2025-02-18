import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFreelancerById } from "../utils/freelancerHelpers";
import { fetchSkills } from "../utils/authHelpers";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

function ProfilePage() {
    const { freelancerId } = useParams();
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const navigate = useNavigate();
    const [freelancer, setFreelancer] = useState(null);
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);


    //modals for editing
    const [isProfileModalOpen, setProfileModalOpen] = useState(false);
    const [isSkillsModalOpen, setSkillsModalOpen] = useState(false);
    const [isAboutModalOpen, setAboutModalOpen] = useState(false);
    const [isExperienceOpen, setExperienceOpen] = useState(false);
    const [isCertificationsOpen, setCertificationsOpen] = useState(false);

    //for skills toggle
    const [availableSkills, setAvailableSkills] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "light";
        setTheme(savedTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    const handleOpenSkillsModal = async () => {
        try {
            const skills = await fetchSkills();
            setAvailableSkills(skills);
            setSkillsModalOpen(true);
        } catch (error) {
            console.error("Failed to fetch skills:", error);
        }
    };

    // Toggle skill selection
    const toggleSkill = (skillId) => {
        setSelectedSkills((prevSkills) =>
            prevSkills.includes(skillId)
                ? prevSkills.filter((id) => id !== skillId)
                : [...prevSkills, skillId]
        );
    };

    useEffect(() => {
        const fetchFreelancerData = async () => {
            try {
                const freelancerData = await getFreelancerById(freelancerId);
                setFreelancer(freelancerData);

                const allSkills = await fetchSkills();
                const freelancerSkills = allSkills.filter(skill => freelancerData.skills.includes(skill._id));
                setSkills(freelancerSkills);
            } catch (error) {
                console.error("Error fetching freelancer data:", error);
                navigate("/");
            } finally {
                setLoading(false);
            }
        };

        if (freelancerId) {
            fetchFreelancerData();
        }
    }, [freelancerId, navigate]);

    if (loading) {
        return <div className="text-center p-6">Loading freelancer profile...</div>;
    }

    if (!freelancer) {
        return <div className="text-center p-6 text-red-500">Failed to load freelancer profile.</div>;
    }

    const staticBio = "I am a highly skilled and motivated software developer with expertise in web and mobile applications. I am passionate about creating scalable solutions and delivering high-quality products.";
    const staticPrice = "NRs 2,000 per short-term project";

    return (
        <><Navbar theme={theme} toggleTheme={toggleTheme} /><div className={`p-8 rounded shadow-lg space-y-8 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
            <div className={`bg-gray-100 dark:bg-gray-900 min-h-screen py-8`}>
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-4">
                        {/* Left Sidebar (Static) */}
                        <div className="col-span-1 lg:col-span-1 space-y-4 sticky top-8 h-fit">
                            {/* Profile Section */}
                            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 relative">
                                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 uppercase mb-4">Profile</h2>
                                <button
                                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
                                    onClick={() => setProfileModalOpen(true)}
                                >
                                    Edit
                                </button>
                                <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300">
                                    <i className="fas fa-edit"></i>
                                </button>
                                <div className="flex flex-col items-center">
                                    <img
                                        src={`http://localhost:3000/${freelancer.profileImage}`}
                                        alt={freelancer.freelancerName}
                                        className="w-24 h-24 rounded-full bg-gray-300 mb-4 object-cover border-4 border-blue-500"
                                    />
                                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">{freelancer.freelancerName || "Not defined"}</h1>
                                    <p className="mt-2 text-gray-700 dark:text-gray-300 text-center">
                                        <strong>What I Do:</strong> {freelancer.jobTitle || "Not defined"}
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-300 text-center">
                                        <strong>I am From:</strong> {freelancer.location || "Not defined"}
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-4 justify-center">
                                        <a href={freelancer.portfolio || "#"} target="_blank" rel="noopener noreferrer" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                                            View Portfolio
                                        </a>
                                        <a href="#" className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                                            Contact Me
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Skills Section */}
                            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 relative">
                                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 uppercase mb-4">Skills</h2>
                                <button
                                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
                                    onClick={() => setSkillsModalOpen(true)}
                                >
                                    Edit
                                </button>
                                <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300">
                                    <i className="fas fa-edit"></i>
                                </button>
                                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                                    {skills.length > 0 ? (
                                        skills.map((skill, index) => <li key={index} className="mb-2">{skill.name}</li>)
                                    ) : (
                                        <p className="text-gray-500">No skills listed.</p>
                                    )}
                                </ul>
                            </div>
                        </div>

                        {/* Right Content (Scrollable) */}
                        <div className="col-span-1 lg:col-span-3 overflow-y-auto max-h-[80vh] pr-2">
                            {/* About Me Section */}
                            <div className={`bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-6 relative`}>
                                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">About Me</h2>
                                <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300">
                                    <i className="fas fa-edit"></i>
                                </button>
                                <p className="text-gray-700 dark:text-gray-300 mb-6">{staticBio || "Not defined"}</p>
                                {/* Details Section with Icons */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg flex items-center">
                                        <span className="text-blue-500 text-2xl mr-4">
                                            <i className="fas fa-briefcase"></i>
                                        </span>
                                        <div>
                                            <h3 className="font-bold text-gray-800 dark:text-gray-100">I work at</h3>
                                            <p className="text-gray-700 dark:text-gray-300">{freelancer.workHistory || "No work history available"}</p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg flex items-center">
                                        <span className="text-green-500 text-2xl mr-4">
                                            <i className="fas fa-language"></i>
                                        </span>
                                        <div>
                                            <h3 className="font-bold text-gray-800 dark:text-gray-100">Languages</h3>
                                            <p className="text-gray-700 dark:text-gray-300">{freelancer.languages || "Not specified"}</p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg flex items-center">
                                        <span className="text-yellow-500 text-2xl mr-4">
                                            <i className="fas fa-calendar-alt"></i>
                                        </span>
                                        <div>
                                            <h3 className="font-bold text-gray-800 dark:text-gray-100">Joined Date</h3>
                                            <p className="text-gray-700 dark:text-gray-300">{new Date(freelancer.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg flex items-center">
                                        <span className="text-red-500 text-2xl mr-4">
                                            <i className="fas fa-clock"></i>
                                        </span>
                                        <div>
                                            <h3 className="font-bold text-gray-800 dark:text-gray-100">Availability</h3>
                                            <p className="text-gray-700 dark:text-gray-300">{freelancer.availability}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Experience Section */}
                            <div className={`bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-6 relative`}>
                                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Experience</h2>
                                <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300">
                                    <i className="fas fa-edit"></i>
                                </button>
                                <div className="mb-6">
                                    <div className="flex justify-between flex-wrap gap-2 w-full">
                                        <span className="text-gray-800 font-bold dark:text-gray-200">Web Developer</span>
                                        <p>
                                            <span className="text-gray-600 dark:text-gray-400 mr-2">at ABC Company</span>
                                            <span className="text-gray-600 dark:text-gray-400">2017 - 2019</span>
                                        </p>
                                    </div>
                                    <p className="mt-2 text-gray-700 dark:text-gray-300">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed finibus est vitae tortor ullamcorper, ut vestibulum velit convallis.
                                    </p>
                                </div>
                            </div>

                            {/* Certifications Section */}
                            <div className={`bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 relative`}>
                                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Certifications</h2>
                                <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300">
                                    <i className="fas fa-edit"></i>
                                </button>
                                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                                    <li>
                                        <strong>Certified React Developer</strong> - Meta
                                    </li>
                                    <li className="mt-2">
                                        <strong>Full-Stack Web Development</strong> - FreeCodeCamp
                                    </li>
                                    <li className="mt-2">
                                        <strong>Advanced JavaScript</strong> - Udemy
                                    </li>
                                    <li className="mt-2">
                                        <strong>Cloud Practitioner</strong> - Google Cloud
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for Profile Edit */}
            {isProfileModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Edit Profile</h2>
                            <button onClick={() => setProfileModalOpen(false)} className="text-red-500">Close</button>
                        </div>
                        {/* Form elements for profile edit */}
                        <div className="space-y-4">
                            <input type="text" placeholder="Edit Name" className="input w-full px-3 py-2 border rounded-md" />
                            <input type="text" placeholder="Edit Job Title" className="input w-full px-3 py-2 border rounded-md" />
                            <input type="text" placeholder="Edit Location" className="input w-full px-3 py-2 border rounded-md" />
                            <button className="btn bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => setProfileModalOpen(false)}>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isSkillsModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Edit Skills</h2>
                            <button onClick={() => setSkillsModalOpen(false)} className="text-red-500">Close</button>
                        </div>

                        <div className="space-y-4">
                            {availableSkills.length > 0 ? (
                                <div className="grid grid-cols-2 gap-2">
                                    {availableSkills.map((skill) => (
                                        <button
                                            key={skill._id}
                                            onClick={() => toggleSkill(skill._id)}
                                            className={`px-4 py-2 border rounded-md ${selectedSkills.includes(skill._id) ? "bg-blue-500 text-white" : "bg-gray-200"
                                                }`}
                                        >
                                            {skill.name}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No skills available.</p>
                            )}

                            <button
                                className="btn bg-blue-500 text-white px-4 py-2 rounded-md w-full"
                                onClick={() => {
                                    setSkillsModalOpen(false);
                                    console.log("Selected Skills:", selectedSkills);
                                }}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
            <Footer theme={theme} />
        </>
    );
}

export default ProfilePage;
