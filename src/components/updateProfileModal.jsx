import React, { useState } from "react";
import { updateFreelancerById } from "../core/utils/freelancerHelpers";
import { uploadImage } from "../core/utils/authHelpers";

function UpdateProfileModal({ freelancer, onClose, onUpdate }) {
    const [formData, setFormData] = useState({
        freelancerName: freelancer.freelancerName || "",
        profession: freelancer.profession || "",
        location: freelancer.location || "",
        aboutMe: freelancer.aboutMe || "",
        availability: freelancer.availability || "",
        workAt: freelancer.workAt || "",
        languages: freelancer.languages ? freelancer.languages.join(", ") : "",
        portfolio: freelancer.portfolio || "",
        experienceYears: freelancer.experienceYears || "",
        profileImage: freelancer.profileImage || "",
        projectsCompleted: freelancer.projectsCompleted || 0,
        skills: freelancer.skills ? freelancer.skills.join(", ") : "",
        experience: freelancer.experience || [],
        certifications: freelancer.certifications || [],
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleArrayChange = (e, field) => {
        setFormData({ ...formData, [field]: e.target.value.split(",").map(item => item.trim()) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedData = {
                ...formData,
                languages: Array.isArray(formData.languages)
                    ? formData.languages
                    : formData.languages.split(",").map(lang => lang.trim()),

                skills: Array.isArray(formData.skills)
                    ? formData.skills
                    : formData.skills.split(",").map(skill => skill.trim()),
            };

            await updateFreelancerById(freelancer._id, updatedData);
            onUpdate(updatedData);
            onClose();

            setTimeout(() => {
                window.location.reload();
            }, 500);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };



    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-[600px] max-h-[85vh] overflow-y-auto">
                <h2 className="text-2xl font-bold text-black mb-6 text-center">Update Profile</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="flex flex-col items-center space-y-3">
                        <label htmlFor="profileImageUpload" className="cursor-pointer group">
                            <div className="relative w-32 h-32 rounded-full border-4 border-blue-500 overflow-hidden shadow-lg transition-transform transform group-hover:scale-105">
                                <img
                                    src={formData.profileImage ? `http://localhost:3000/${formData.profileImage}` : "/defaultProfile.png"}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <p className="text-white text-sm">Change Photo</p>
                                </div>
                            </div>
                        </label>

                        <input
                            type="file"
                            id="profileImageUpload"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    try {
                                        const uploadedImageUrl = await uploadImage(file);
                                        setFormData({ ...formData, profileImage: uploadedImageUrl });
                                    } catch (error) {
                                        console.error("Error uploading image:", error);
                                    }
                                }
                            }}
                        />

                        <p className="text-gray-600 text-sm">Click to update your profile picture</p>
                    </div>

                    <div>
                        <label className="block text-black font-semibold mb-1">Full Name</label>
                        <input type="text" name="freelancerName" value={formData.freelancerName}
                            onChange={handleChange} placeholder="Enter your name"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400" />
                    </div>

                    <div>
                        <label className="block text-black font-semibold mb-1">Profession</label>
                        <input type="text" name="profession" value={formData.profession}
                            onChange={handleChange} placeholder="Enter your profession"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400" />
                    </div>

                    <div>
                        <label className="block text-black font-semibold mb-1">Location</label>
                        <input type="text" name="location" value={formData.location}
                            onChange={handleChange} placeholder="Enter your location"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400" />
                    </div>

                    <div>
                        <label className="block text-black font-semibold mb-1">About Me</label>
                        <textarea name="aboutMe" value={formData.aboutMe}
                            onChange={handleChange} placeholder="Tell us about yourself..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"></textarea>
                    </div>

                    <div>
                        <label className="block text-black font-semibold mb-1">Availability</label>
                        <input type="text" name="availability" value={formData.availability}
                            onChange={handleChange} placeholder="e.g., Full-time, Part-time"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400" />
                    </div>

                    <div>
                        <label className="block text-black font-semibold mb-1">Current Workplace</label>
                        <input type="text" name="workAt" value={formData.workAt}
                            onChange={handleChange} placeholder="Enter your workplace"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400" />
                    </div>

                    <div>
                        <label className="block text-black font-semibold mb-1">Years of Experience</label>
                        <input type="number" name="experienceYears" value={formData.experienceYears}
                            onChange={handleChange} placeholder="Enter years of experience"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                            min="0" max="100" />
                    </div>

                    <div>
                        <label className="block text-black font-semibold mb-1">Languages</label>
                        <input type="text" name="languages" value={formData.languages}
                            onChange={(e) => handleArrayChange(e, "languages")}
                            placeholder="Enter languages (comma-separated)"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400" />
                    </div>

                    <div>
                        <label className="block text-black font-semibold mb-1">Portfolio URL</label>
                        <input type="url" name="portfolio" value={formData.portfolio}
                            onChange={handleChange} placeholder="Enter your portfolio link"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400" />
                    </div>


                    <div>
                        <h3 className="text-lg font-bold text-black mb-2">Experience</h3>
                        {formData.experience.map((exp, index) => (
                            <div key={index} className="mb-4 p-4 bg-gray-100 rounded-lg shadow-sm">
                                <label className="block text-black font-semibold mb-1">Job Title</label>
                                <input type="text" name={`expTitle${index}`} value={exp.title || ""}
                                    onChange={(e) => {
                                        let newExp = [...formData.experience];
                                        newExp[index] = { ...newExp[index], title: e.target.value };
                                        setFormData({ ...formData, experience: newExp });
                                    }} placeholder="Job Title"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400" />

                                <label className="block text-black font-semibold mt-2">Company Name</label>
                                <input type="text" name={`expCompany${index}`} value={exp.company || ""}
                                    onChange={(e) => {
                                        let newExp = [...formData.experience];
                                        newExp[index] = { ...newExp[index], company: e.target.value };
                                        setFormData({ ...formData, experience: newExp });
                                    }} placeholder="Company Name"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400" />

                                <div className="flex gap-2 mt-3">
                                    <div className="w-1/2">
                                        <label className="block text-black font-semibold">From Year</label>
                                        <input type="number" name={`expFrom${index}`} value={exp.from || ""}
                                            onChange={(e) => {
                                                let newExp = [...formData.experience];
                                                newExp[index] = { ...newExp[index], from: e.target.value };
                                                setFormData({ ...formData, experience: newExp });
                                            }} placeholder="From Year"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400" min="1900" max={new Date().getFullYear()} />
                                    </div>

                                    <div className="w-1/2">
                                        <label className="block text-black font-semibold">To Year</label>
                                        <input type="number" name={`expTo${index}`} value={exp.to || ""}
                                            onChange={(e) => {
                                                let newExp = [...formData.experience];
                                                newExp[index] = { ...newExp[index], to: e.target.value };
                                                setFormData({ ...formData, experience: newExp });
                                            }} placeholder="To Year"
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400" min="1900" max={new Date().getFullYear()} />
                                    </div>
                                </div>

                                <label className="block text-black font-semibold mt-2">Job Description</label>
                                <textarea name={`expDescription${index}`} value={exp.description || ""}
                                    onChange={(e) => {
                                        let newExp = [...formData.experience];
                                        newExp[index] = { ...newExp[index], description: e.target.value };
                                        setFormData({ ...formData, experience: newExp });
                                    }} placeholder="Describe your role and responsibilities"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"></textarea>

                                {formData.experience.length > 1 && (
                                    <button
                                        className="bg-red-500 text-white px-3 py-1 mt-3 rounded-md"
                                        onClick={() => {
                                            setFormData({ ...formData, experience: formData.experience.filter((_, i) => i !== index) });
                                        }}
                                    >
                                        Remove Experience
                                    </button>
                                )}
                            </div>
                        ))}

                        <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-3"
                            onClick={() => setFormData({
                                ...formData,
                                experience: [...formData.experience, { title: "", company: "", from: "", to: "", description: "" }]
                            })}>
                            + Add Experience
                        </button>
                    </div>


                    <div>
                        <h3 className="text-lg font-bold text-black mb-2">Certifications</h3>

                        {formData.certifications.map((cert, index) => (
                            <div key={index} className="mb-4 p-4 bg-gray-100 rounded-lg shadow-sm">
                                <label className="block text-black font-semibold mb-1">Certification Name</label>
                                <input type="text" name={`certName${index}`} value={cert.name || ""}
                                    onChange={(e) => {
                                        let newCerts = [...formData.certifications];
                                        newCerts[index] = { ...newCerts[index], name: e.target.value };
                                        setFormData({ ...formData, certifications: newCerts });
                                    }} placeholder="Enter certification name"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400" />

                                <label className="block text-black font-semibold mt-2">Issuing Organization</label>
                                <input type="text" name={`certOrg${index}`} value={cert.organization || ""}
                                    onChange={(e) => {
                                        let newCerts = [...formData.certifications];
                                        newCerts[index] = { ...newCerts[index], organization: e.target.value };
                                        setFormData({ ...formData, certifications: newCerts });
                                    }} placeholder="Enter issuing organization"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400" />

                                {formData.certifications.length > 1 && (
                                    <button
                                        className="bg-red-500 text-white px-3 py-1 mt-3 rounded-md"
                                        onClick={() => {
                                            setFormData({ ...formData, certifications: formData.certifications.filter((_, i) => i !== index) });
                                        }}
                                    >
                                        Remove Certification
                                    </button>
                                )}
                            </div>
                        ))}

                        <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-3"
                            onClick={() => setFormData({
                                ...formData,
                                certifications: [...formData.certifications, { name: "", organization: "" }]
                            })}>
                            + Add Certification
                        </button>
                    </div>


                    <div className="flex justify-end space-x-3">
                        <button type="button" className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-md" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>

    );
}

export default UpdateProfileModal;
