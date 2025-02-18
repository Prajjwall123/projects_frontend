import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFreelancerById } from "../core/utils/freelancerHelpers";
import { fetchSkills } from "../core/utils/authHelpers";
import Navbar from "./navbar";

function FreelancerProfile() {
    const { freelancerId } = useParams();
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const navigate = useNavigate();
    const [freelancer, setFreelancer] = useState(null);
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <>
            <div className={`bg-gray-100 dark:bg-gray-900 min-h-screen py-8`}>
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 px-4">
                        {/* Left Sidebar (Profile & Skills) */}
                        <div className="col-span-1 lg:col-span-1 space-y-4 sticky top-8 h-fit">
                            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 uppercase mb-4">Profile</h2>
                                <div className="flex flex-col items-center">
                                    <img
                                        src={`http://localhost:3000/${freelancer.profileImage}`}
                                        alt={freelancer.freelancerName || "Not specified"}
                                        className="w-24 h-24 rounded-full bg-gray-300 mb-4 object-cover border-4 border-blue-500"
                                    />
                                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">{freelancer.freelancerName || "Not specified"}</h1>
                                    <p className="text-gray-700 dark:text-gray-300 text-center">
                                        <strong>Profession:</strong> {freelancer.profession || "Not specified"}
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-300 text-center">
                                        <strong>Location:</strong> {freelancer.location || "Not specified"}
                                    </p>
                                    <p className="text-gray-700 dark:text-gray-300 text-center">
                                        <strong>Experience:</strong> {freelancer.experienceYears ? `${freelancer.experienceYears} years` : "Not specified"}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                                <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 uppercase mb-4">Skills</h2>
                                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                                    {skills.length > 0 ? (
                                        skills.map((skill, index) => <li key={index} className="mb-2">{skill.name}</li>)
                                    ) : (
                                        <p className="text-gray-500">Not specified</p>
                                    )}
                                </ul>
                            </div>
                        </div>

                        {/* Right Content (About Me, Experience & Certifications) */}
                        <div className="col-span-1 lg:col-span-3 overflow-y-auto max-h-[80vh] pr-2">
                            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-6">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">About Me</h2>
                                <p className="text-gray-700 dark:text-gray-300 mb-6">{freelancer.aboutMe || "Not specified"}</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg flex items-center">
                                        <span className="text-blue-500 text-2xl mr-4">
                                            <i className="fas fa-briefcase"></i>
                                        </span>
                                        <div>
                                            <h3 className="font-bold text-gray-800 dark:text-gray-100">I work at</h3>
                                            <p className="text-gray-700 dark:text-gray-300">{freelancer.workAt || "Not Specified"}</p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg flex items-center">
                                        <span className="text-green-500 text-2xl mr-4">
                                            <i className="fas fa-language"></i>
                                        </span>
                                        <div>
                                            <h3 className="font-bold text-gray-800 dark:text-gray-100">Languages</h3>
                                            <p className="text-gray-700 dark:text-gray-300">{freelancer.languages && freelancer.languages.length > 0 ? freelancer.languages.join(", ") : "Not specified"}</p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg flex items-center">
                                        <span className="text-yellow-500 text-2xl mr-4">
                                            <i className="fas fa-calendar-alt"></i>
                                        </span>
                                        <div>
                                            <h3 className="font-bold text-gray-800 dark:text-gray-100">Joined Date</h3>
                                            <p className="text-gray-700 dark:text-gray-300">{freelancer.createdAt ? new Date(freelancer.createdAt).toLocaleDateString() : "Not specified"}</p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg flex items-center">
                                        <span className="text-red-500 text-2xl mr-4">
                                            <i className="fas fa-clock"></i>
                                        </span>
                                        <div>
                                            <h3 className="font-bold text-gray-800 dark:text-gray-100">Availability</h3>
                                            <p className="text-gray-700 dark:text-gray-300">{freelancer.availability || "Not specified"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-6">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Experience</h2>
                                {freelancer.experience && freelancer.experience.length > 0 ? (
                                    freelancer.experience.map((exp, index) => (
                                        <div key={index} className="mb-6">
                                            <div className="flex justify-between">
                                                <span className="text-gray-800 font-bold dark:text-gray-200">{exp.title || "Not specified"}</span>
                                                <p>
                                                    <span className="text-gray-600 dark:text-gray-400 mr-2">at {exp.company || "Not specified"}</span>
                                                    <span className="text-gray-600 dark:text-gray-400">{exp.from || "N/A"} - {exp.to || "Present"}</span>
                                                </p>
                                            </div>
                                            <p className="mt-2 text-gray-700 dark:text-gray-300">{exp.description || "Not specified"}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">Not specified</p>
                                )}
                            </div>

                            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Certifications</h2>
                                {freelancer.certifications && freelancer.certifications.length > 0 ? (
                                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                                        {freelancer.certifications.map((cert, index) => (
                                            <li key={index} className="mb-2">
                                                <strong>{cert.name || "Not specified"}</strong> - {cert.organization || "Not specified"}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">Not specified</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default FreelancerProfile;