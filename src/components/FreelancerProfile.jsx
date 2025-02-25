import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getFreelancerById } from "../core/utils/freelancerHelpers";
import { fetchSkills } from "../core/utils/authHelpers";
import UpdateProfileModal from "./updateProfileModal";

function FreelancerProfile() {
    const { freelancerId } = useParams();
    const theme = localStorage.getItem("theme") || "light";
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [freelancer, setFreelancer] = useState(null);

    // Fetch freelancer data
    const { data, isLoading: freelancerLoading, error: freelancerError } = useQuery({
        queryKey: ["freelancerProfile", freelancerId],
        queryFn: () => getFreelancerById(freelancerId),
        enabled: !!freelancerId,
        retry: false,
    });

    // Fetch all skills
    const { data: allSkills, isLoading: skillsLoading, error: skillsError } = useQuery({
        queryKey: ["skills"],
        queryFn: fetchSkills,
        retry: false,
    });

    // Update the freelancer state when data is available
    useEffect(() => {
        if (data) {
            setFreelancer(data);
            console.log(data.skills);
        }
    }, [data]);

    // Extract freelancer skills based on the new format
    const freelancerSkills = freelancer?.skills?.map(skill => skill.name) || [];

    if (freelancerLoading || skillsLoading) {
        return <div className="text-center p-6">Loading freelancer profile...</div>;
    }

    if (freelancerError || skillsError || !freelancer) {
        return <div className="text-center p-6 text-red-500">Failed to load freelancer profile.</div>;
    }



    return (
        <>
            <div className={`min-h-screen py-8 transition-all duration-300 ${theme === "dark" ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-900"}`}>
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 px-6">

                        {/* Left Sidebar (Profile & Skills) - Made Wider */}
                        <div className="col-span-1 lg:col-span-2 space-y-6 sticky top-8 h-fit">
                            <div className={`shadow-lg rounded-lg p-6 ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"}`}>
                                <h2 className="text-lg font-bold uppercase mb-4">Profile</h2>
                                <div className="flex flex-col items-center">
                                    <img
                                        src={freelancer.profileImage ? `http://localhost:3000/${freelancer.profileImage}` : "/defaultProfile.png"}
                                        alt={freelancer.freelancerName || "Not specified"}
                                        className="w-28 h-28 rounded-full bg-gray-300 mb-4 object-cover border-4 border-blue-500"
                                    />
                                    <h1 className="text-2xl font-bold">{freelancer.freelancerName || "Not specified"}</h1>
                                    <p className="mt-2">
                                        <strong>Profession:</strong> {freelancer.profession || "Not specified"}
                                    </p>
                                    <p>
                                        <strong>Location:</strong> {freelancer.location || "Not specified"}
                                    </p>
                                    <p>
                                        <strong>Experience:</strong> {freelancer.experienceYears ? `${freelancer.experienceYears} years` : "Not specified"}
                                    </p>

                                    {/* View Portfolio Button */}
                                    {freelancer.portfolio && (
                                        <a
                                            href={freelancer.portfolio.startsWith("http") ? freelancer.portfolio : `http://${freelancer.portfolio}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                                        >
                                            View Portfolio
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Skills Section */}
                            <div className={`shadow-lg rounded-lg p-6 ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"}`}>
                                <h2 className="text-lg font-bold uppercase mb-4">Skills</h2>
                                {freelancerSkills.length > 0 ? (
                                    <ul className="list-disc list-inside space-y-2">
                                        {freelancerSkills.map((skillName, index) => (
                                            <li key={index} className="mb-2">{skillName}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">Not specified</p>
                                )}
                            </div>

                        </div>

                        {/* Right Content (About Me, Experience & Certifications) */}
                        <div className="col-span-1 lg:col-span-3 pr-2">
                            {/* About Me Section */}
                            <div className={`shadow-lg rounded-lg p-6 mb-6 ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"}`}>
                                <h2 className="text-2xl font-bold mb-4">About Me</h2>
                                <p className="text-lg mb-6">{freelancer.aboutMe || "Not specified"}</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        { icon: "fas fa-briefcase", title: "I work at", value: freelancer.workAt || "Not Specified", color: "text-blue-500" },
                                        { icon: "fas fa-language", title: "Languages", value: freelancer.languages?.length ? freelancer.languages.join(", ") : "Not specified", color: "text-green-500" },
                                        { icon: "fas fa-calendar-alt", title: "Joined Date", value: freelancer.createdAt ? new Date(freelancer.createdAt).toLocaleDateString() : "Not specified", color: "text-yellow-500" },
                                        { icon: "fas fa-clock", title: "Availability", value: freelancer.availability || "Not specified", color: "text-red-500" }
                                    ].map((item, index) => (
                                        <div key={index} className={`p-5 rounded-lg flex items-center ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"} shadow-md`}>
                                            <span className={`text-3xl mr-5 ${item.color}`}>
                                                <i className={item.icon}></i>
                                            </span>
                                            <div>
                                                <h3 className="text-lg font-bold">{item.title}</h3>
                                                <p className="text-md">{item.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Experience Section */}
                            <div className={`shadow-lg rounded-lg p-6 mb-6 ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-gray-50 text-gray-900"}`}>
                                <h2 className="text-2xl font-bold mb-4">Experience</h2>
                                {freelancer.experience?.length > 0 ? (
                                    freelancer.experience.map((exp, index) => (
                                        <div key={index} className={`mb-6 p-4 rounded-lg shadow-md ${theme === "dark" ? "bg-gray-700 text-gray-200" : "bg-white text-gray-800 border border-gray-300"}`}>
                                            <div className="flex justify-between items-center">
                                                <span className="text-lg font-bold">{exp.title || "Not specified"}</span>
                                                <p className="text-md text-gray-600 dark:text-gray-400">
                                                    <span className="mr-2">at {exp.company || "Not specified"}</span> |
                                                    <span className="ml-2">{exp.from || "N/A"} - {exp.to || "Present"}</span>
                                                </p>
                                            </div>
                                            <p className="mt-3 text-md">{exp.description || "Not specified"}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">Not specified</p>
                                )}
                            </div>


                            {/* Certifications Section */}
                            <div className={`shadow-lg rounded-lg p-6 ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"}`}>
                                <h2 className="text-2xl font-bold mb-4">Certifications</h2>
                                {freelancer.certifications?.length > 0 ? (
                                    <ul className="list-disc list-inside text-lg">
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

                            {/* Update Profile Button (Now Positioned at the Bottom) */}
                            <div className="flex justify-center mt-10">
                                <button
                                    className="bg-blue-500 text-white px-6 py-3 text-lg rounded-lg hover:bg-blue-600 transition"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    Update Profile
                                </button>
                            </div>

                            {/* Render the modal only when isModalOpen is true */}
                            {isModalOpen && (
                                <UpdateProfileModal
                                    freelancer={freelancer}
                                    onClose={() => setIsModalOpen(false)}
                                    onUpdate={(updatedData) => setFreelancer(updatedData)}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>



        </>
    );
}

export default FreelancerProfile;