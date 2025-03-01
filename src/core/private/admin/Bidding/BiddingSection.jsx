import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getBidById } from "../../../utils/projectHelpers";
import { getFreelancerById } from "../../../utils/freelancerHelpers";
import { fetchSkills } from "../../../utils/projectHelpers";
import { toast } from "react-toastify";
import { updateProjectStatus, deleteBid } from "../../../utils/projectHelpers";

const BiddingSection = ({ bidId, theme, onClose }) => {

    const { data: bid, isLoading, error } = useQuery({
        queryKey: ["bidDetails", bidId],
        queryFn: () => getBidById(bidId),
        retry: false,
    });

    const freelancerId = bid?.data?.freelancer?._id;
    const projectId = bid?.data?.project?._id;

    const { data: freelancer, isLoading: freelancerLoading, error: freelancerError } = useQuery({
        queryKey: ["freelancerDetails", freelancerId],
        queryFn: () => getFreelancerById(freelancerId),
        enabled: !!freelancerId,
        retry: false,
    });

    const handleApproveBid = async () => {
        toast.success(freelancerId, projectId);

        if (!freelancerId || !projectId) {
            toast.error("Missing freelancer id or bid id");
            return;
        }
        try {
            const updatedProject = await updateProjectStatus(projectId, freelancerId);
            toast.error("Project awarded successfully");

        } catch (error) {
            toast.error(" Failed to approve bid. Please try again.");
        }
    };


    const handleRejectBid = async (bidId) => {
        try {
            await deleteBid(bidId);
        } catch (error) {
            console.error("Failed to reject bid:", error);
        }
    };


    const { data: allSkills, isLoading: skillsLoading, error: skillsError } = useQuery({
        queryKey: ["skills"],
        queryFn: fetchSkills,
        retry: false,
    });

    if (isLoading || freelancerLoading || skillsLoading) {
        return <div className="text-center p-6 text-gray-600">Loading bid and freelancer details...</div>;
    }

    if (error || freelancerError || skillsError) {
        return <div className="text-center p-6 text-red-500">Failed to load data. Please try again.</div>;
    }

    const { project, amount, message, fileName, createdAt } = bid?.data || {};
    const freelancerSkills = allSkills && freelancer?.skills
        ? allSkills.filter(skill => freelancer.skills.includes(skill._id))
        : [];

    return (
        <div className={`p-8 rounded-lg shadow-xl space-y-8 transition-all ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
            <div className="flex justify-between items-center border-b pb-4 border-gray-300 dark:border-gray-700">
                <h3 className="text-3xl font-bold">Bid Details</h3>
                <button
                    onClick={onClose}
                    className={`px-4 py-2 rounded-lg font-semibold shadow-md transition ${theme === "dark" ? "bg-gray-600 hover:bg-gray-500 text-white" : "bg-gray-200 hover:bg-gray-300 text-black"}`}
                >
                    Close
                </button>
            </div>

            <div className={`min-h-screen py-8 transition-all duration-300 ${theme === "dark" ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-900"}`}>
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 px-6">

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

                            <div className={`shadow-lg rounded-lg p-6 ${theme === "dark" ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"}`}>
                                <h2 className="text-lg font-bold uppercase mb-4">Skills</h2>
                                <ul className="list-disc list-inside">
                                    {freelancerSkills.length > 0 ? (
                                        freelancerSkills.map((skill, index) => (
                                            <li key={index} className="mb-2">{skill.name}</li>
                                        ))
                                    ) : (
                                        <p className="text-gray-500">Not specified</p>
                                    )}
                                </ul>
                            </div>
                        </div>

                        <div className="col-span-1 lg:col-span-3 pr-2">
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
                        </div>
                    </div>
                </div>
            </div>

            <div className={`rounded-lg p-6 shadow-xl border ${theme === "dark" ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}>
                <h4 className="text-2xl font-bold mb-5 text-center"> Bid Information</h4>

                <div className="space-y-4">
                    <div className={`flex items-center justify-between p-4 rounded-lg shadow-md border ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-black"}`}>
                        <span className="font-semibold">Bid Amount:</span>
                        <span className="text-xl font-bold text-blackdark:text-white">NRs {amount}</span>
                    </div>

                    <div className={`flex items-center justify-between p-4 rounded-lg shadow-md border ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-black"}`}>
                        <span className="font-semibold">Bid Date:</span>
                        <span className="text-md">{new Date(createdAt).toLocaleString()}</span>
                    </div>

                    <div className={`p-5 rounded-lg shadow-md border ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-black"}`}>
                        <h4 className="text-lg font-semibold mb-2 flex items-center">
                        </h4>
                        <p className="text-md italic">{message || "No additional message provided."}</p>
                    </div>

                    {fileName && (
                        <div className={`p-5 rounded-lg shadow-md border ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"}`}>
                            <h4 className="text-lg font-semibold mb-3 flex items-center">
                                Attachment
                            </h4>
                            <a
                                href={`http://localhost:3000/uploads/${fileName}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center px-6 py-3 rounded-md shadow-md transition-all ${theme === "dark" ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-blue-500 text-white hover:bg-blue-600"}`}
                            >
                                View Attached PDF
                            </a>
                        </div>
                    )}

                    <div />
                    <div className="flex justify-center mt-6 space-x-4">
                        <button
                            className="bg-green-500 text-white px-6 py-3 text-lg font-bold rounded-lg hover:bg-green-600 transition"
                            onClick={handleApproveBid}
                        >
                            Approve Bid
                        </button>
                        <button
                            className="bg-red-500 text-white px-6 py-3 text-lg font-bold rounded-lg hover:bg-red-600 transition"
                            onClick={() => handleRejectBid(bidId)}
                        >
                            Reject Bid
                        </button>
                    </div>

                </div>
            </div>


        </div>

    );
};

export default BiddingSection;
