import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getFreelancerById } from "../core/utils/freelancerHelpers";
import { fetchSkills } from "../core/utils/authHelpers";
import UpdateProfileModal from "./updateProfileModal";
import {
    FaBriefcase,
    FaLanguage,
    FaCalendarAlt,
    FaClock,
} from "react-icons/fa";

function FreelancerProfile() {
    const { freelancerId } = useParams();
    const theme = localStorage.getItem("theme") || "light";
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [freelancer, setFreelancer] = useState(null);

    const { data, isLoading: freelancerLoading, error: freelancerError } = useQuery({
        queryKey: ["freelancerProfile", freelancerId],
        queryFn: () => getFreelancerById(freelancerId),
        enabled: !!freelancerId,
        retry: false,
    });

    const { data: allSkills, isLoading: skillsLoading, error: skillsError } = useQuery({
        queryKey: ["skills"],
        queryFn: fetchSkills,
        retry: false,
    });

    useEffect(() => {
        if (data) {
            setFreelancer(data);
            console.log(data.skills);
        }
    }, [data]);

    const freelancerSkills = freelancer?.skills?.map((skill) => skill.name) || [];

    if (freelancerLoading || skillsLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-lg text-gray-600 dark:text-gray-400">
                Loading freelancer profile...
            </div>
        );
    }

    if (freelancerError || skillsError || !freelancer) {
        return (
            <div className="flex items-center justify-center min-h-screen text-lg text-red-500">
                Failed to load freelancer profile.
            </div>
        );
    }

    return (
        <div
            className={`min-h-screen py-6 sm:py-8 transition-all duration-300 ${theme === "dark" ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-900"
                }`}
        >
            <div className="container mx-auto px-3 sm:px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
                    <div className="col-span-1 lg:col-span-2 space-y-4 sm:space-y-6 sticky top-4 sm:top-8 h-fit">
                        <div
                            className={`shadow-lg rounded-xl p-4 sm:p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"
                                }`}
                        >
                            <h2 className="text-base sm:text-lg md:text-xl font-bold uppercase mb-3 sm:mb-4 tracking-tight">
                                Profile
                            </h2>
                            <div className="flex flex-col items-center">
                                <img
                                    src={
                                        freelancer.profileImage
                                            ? `http://localhost:3000/${freelancer.profileImage}`
                                            : "/defaultProfile.png"
                                    }
                                    alt={freelancer.freelancerName || "Not specified"}
                                    className="w-24 sm:w-28 h-24 sm:h-28 rounded-full bg-gray-300 mb-3 sm:mb-4 object-cover border-4 border-blue-500 dark:border-blue-400"
                                />
                                <h1 className="text-lg sm:text-xl md:text-2xl font-bold">
                                    {freelancer.freelancerName || "Not specified"}
                                </h1>
                                <p className="mt-1 sm:mt-2 text-sm sm:text-base">
                                    <strong>Profession:</strong> {freelancer.profession || "Not specified"}
                                </p>
                                <p className="text-sm sm:text-base">
                                    <strong>Location:</strong> {freelancer.location || "Not specified"}
                                </p>
                                <p className="text-sm sm:text-base">
                                    <strong>Experience:</strong>{" "}
                                    {freelancer.experienceYears
                                        ? `${freelancer.experienceYears} years`
                                        : "Not specified"}
                                </p>

                                {freelancer.portfolio && (
                                    <a
                                        href={
                                            freelancer.portfolio.startsWith("http")
                                                ? freelancer.portfolio
                                                : `http://${freelancer.portfolio}`
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`mt-3 sm:mt-4 px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base font-semibold transition-all duration-200 hover:scale-105 ${theme === "dark"
                                            ? "bg-blue-600 text-white hover:bg-blue-500"
                                            : "bg-blue-500 text-white hover:bg-blue-600"
                                            }`}
                                    >
                                        View Portfolio
                                    </a>
                                )}
                            </div>
                        </div>

                        <div
                            className={`shadow-lg rounded-xl p-4 sm:p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"
                                }`}
                        >
                            <h2 className="text-base sm:text-lg md:text-xl font-bold uppercase mb-3 sm:mb-4 tracking-tight">
                                Skills
                            </h2>
                            {freelancerSkills.length > 0 ? (
                                <ul className="flex flex-wrap gap-2 sm:gap-3">
                                    {freelancerSkills.map((skillName, index) => (
                                        <li
                                            key={index}
                                            className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium ${theme === "dark"
                                                ? "bg-gray-700 text-gray-200"
                                                : "bg-gray-200 text-gray-800"
                                                }`}
                                        >
                                            {skillName}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                                    Not specified
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="col-span-1 lg:col-span-3 space-y-4 sm:space-y-6">
                        <div
                            className={`shadow-lg rounded-xl p-4 sm:p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"
                                }`}
                        >
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 tracking-tight">
                                About Me
                            </h2>
                            <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6">
                                {freelancer.aboutMe || "Not specified"}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                {[
                                    {
                                        icon: <FaBriefcase className="text-blue-500 dark:text-blue-400" />,
                                        title: "I work at",
                                        value: freelancer.workAt || "Not Specified",
                                    },
                                    {
                                        icon: <FaLanguage className="text-green-500 dark:text-green-400" />,
                                        title: "Languages",
                                        value: freelancer.languages?.length
                                            ? freelancer.languages.join(", ")
                                            : "Not specified",
                                    },
                                    {
                                        icon: <FaCalendarAlt className="text-yellow-500 dark:text-yellow-400" />,
                                        title: "Joined Date",
                                        value: freelancer.createdAt
                                            ? new Date(freelancer.createdAt).toLocaleDateString()
                                            : "Not specified",
                                    },
                                    {
                                        icon: <FaClock className="text-red-500 dark:text-red-400" />,
                                        title: "Availability",
                                        value: freelancer.availability || "Not specified",
                                    },
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        className={`p-4 sm:p-5 rounded-lg flex items-center transition-all duration-300 hover:scale-[1.02] ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                                            } shadow-md`}
                                    >
                                        <span className="text-2xl sm:text-3xl mr-3 sm:mr-5">{item.icon}</span>
                                        <div>
                                            <h3 className="text-sm sm:text-base md:text-lg font-bold">{item.title}</h3>
                                            <p className="text-xs sm:text-sm md:text-base">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div
                            className={`shadow-lg rounded-xl p-4 sm:p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"
                                }`}
                        >
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 tracking-tight">
                                Experience
                            </h2>
                            {freelancer.experience?.length > 0 ? (
                                freelancer.experience.map((exp, index) => (
                                    <div
                                        key={index}
                                        className={`mb-4 sm:mb-6 p-4 rounded-lg shadow-md transition-all duration-300 hover:scale-[1.02] ${theme === "dark" ? "bg-gray-700 text-gray-200" : "bg-gray-50 text-gray-800"
                                            }`}
                                    >
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                                            <span className="text-sm sm:text-base md:text-lg font-bold">
                                                {exp.title || "Not specified"}
                                            </span>
                                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                                <span className="mr-1 sm:mr-2">at {exp.company || "Not specified"}</span> |{" "}
                                                <span className="ml-1 sm:ml-2">
                                                    {exp.from || "N/A"} - {exp.to || "Present"}
                                                </span>
                                            </p>
                                        </div>
                                        <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base">
                                            {exp.description || "Not specified"}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                                    Not specified
                                </p>
                            )}
                        </div>

                        <div
                            className={`shadow-lg rounded-xl p-4 sm:p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"
                                }`}
                        >
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 tracking-tight">
                                Certifications
                            </h2>
                            {freelancer.certifications?.length > 0 ? (
                                <ul className="list-disc list-inside space-y-2 sm:space-y-3 text-sm sm:text-base md:text-lg">
                                    {freelancer.certifications.map((cert, index) => (
                                        <li key={index} className="mb-2">
                                            <strong>{cert.name || "Not specified"}</strong> -{" "}
                                            {cert.organization || "Not specified"}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                                    Not specified
                                </p>
                            )}
                        </div>

                        <div className="flex justify-center mt-6 sm:mt-8 md:mt-10">
                            <button
                                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base md:text-lg font-semibold transition-all duration-200 hover:scale-105 ${theme === "dark"
                                    ? "bg-blue-600 text-white hover:bg-blue-500"
                                    : "bg-blue-500 text-white hover:bg-blue-600"
                                    }`}
                                onClick={() => setIsModalOpen(true)}
                            >
                                Update Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <UpdateProfileModal
                    freelancer={freelancer}
                    onClose={() => setIsModalOpen(false)}
                    onUpdate={(updatedData) => setFreelancer(updatedData)}
                />
            )}
        </div>
    );
}

export default FreelancerProfile;