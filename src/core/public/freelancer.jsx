import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFreelancerById } from "../utils/freelancerHelpers";
import { fetchSkills } from "../utils/authHelpers";

function ProfilePage({ theme }) {
    const { freelancerId } = useParams();
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

    const staticBio = "I am a highly skilled and motivated software developer with expertise in web and mobile applications. I am passionate about creating scalable solutions and delivering high-quality products.";
    const staticPrice = "NRs 2,000 per short-term project";

    return (
        <div className={`p-8 rounded shadow-lg space-y-8 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
            {/* Header Section */}
            <div className="flex items-center space-x-6">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500">
                    <img
                        src={`http://localhost:3000/images/${freelancer.profileImage}`}
                        alt={freelancer.freelancerName}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">{freelancer.freelancerName}</h1>
                    <p className="text-sm text-gray-400">Joined: {new Date(freelancer.createdAt).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-400">Availability: {freelancer.availability}</p>
                    <a
                        href={freelancer.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline mt-2 inline-block"
                    >
                        View Portfolio
                    </a>
                </div>
            </div>

            {/* Bio Section */}
            <div className={`p-6 rounded-lg shadow-md ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                <h2 className="text-2xl font-semibold mb-4">Bio</h2>
                <p className="text-gray-600 dark:text-gray-300">{staticBio}</p>
            </div>

            {/* Skills Section */}
            <div className={`p-6 rounded-lg shadow-md ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                <h2 className="text-2xl font-semibold mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                    {skills.length > 0 ? (
                        skills.map((skill, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm dark:bg-blue-900 dark:text-blue-300"
                            >
                                {skill.name}
                            </span>
                        ))
                    ) : (
                        <p className="text-gray-500">No skills listed.</p>
                    )}
                </div>
            </div>

            {/* Pricing Section */}
            <div className={`p-6 rounded-lg shadow-md ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                <h2 className="text-2xl font-semibold mb-4">Pricing</h2>
                <p className="text-lg text-gray-700 dark:text-gray-300">{staticPrice}</p>
            </div>
        </div>
    );
}

export default ProfilePage;
