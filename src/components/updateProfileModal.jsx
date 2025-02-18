import React, { useState } from "react";
import { updateFreelancerById } from "../core/utils/freelancerHelpers";

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
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Update Profile</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="freelancerName" value={formData.freelancerName} onChange={handleChange} placeholder="Your Name" className="w-full p-2 border rounded" />
                    <input type="text" name="profession" value={formData.profession} onChange={handleChange} placeholder="Profession" className="w-full p-2 border rounded" />
                    <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location" className="w-full p-2 border rounded" />
                    <textarea name="aboutMe" value={formData.aboutMe} onChange={handleChange} placeholder="Tell us about yourself..." className="w-full p-2 border rounded" />
                    <input type="text" name="availability" value={formData.availability} onChange={handleChange} placeholder="Availability (e.g., Full-time, Part-time)" className="w-full p-2 border rounded" />
                    <input type="text" name="workAt" value={formData.workAt} onChange={handleChange} placeholder="Where do you work?" className="w-full p-2 border rounded" />
                    <input type="text" name="languages" value={formData.languages} onChange={(e) => handleArrayChange(e, "languages")} placeholder="Languages (comma-separated)" className="w-full p-2 border rounded" />
                    <input type="text" name="portfolio" value={formData.portfolio} onChange={handleChange} placeholder="Portfolio URL" className="w-full p-2 border rounded" />
                    <input type="text" name="profileImage" value={formData.profileImage} onChange={handleChange} placeholder="Profile Image URL" className="w-full p-2 border rounded" />
                    <input type="number" name="projectsCompleted" value={formData.projectsCompleted} onChange={handleChange} placeholder="Projects Completed" className="w-full p-2 border rounded" />
                    <input type="text" name="skills" value={formData.skills} onChange={(e) => handleArrayChange(e, "skills")} placeholder="Skills (comma-separated)" className="w-full p-2 border rounded" />

                    {/* Experience Section */}
                    <div>
                        <h3 className="font-bold text-gray-800 dark:text-gray-100">Experience</h3>
                        {(formData.experience.length > 0 ? formData.experience : [{ title: "", company: "", from: "", to: "", description: "" }]).map((exp, index) => (
                            <div key={index} className="mb-2">
                                <input type="text" name={`expTitle${index}`} value={exp.title || ""} onChange={(e) => {
                                    let newExp = [...formData.experience];
                                    newExp[index] = { ...newExp[index], title: e.target.value };
                                    setFormData({ ...formData, experience: newExp });
                                }} placeholder="Job Title" className="w-full p-2 border rounded" />

                                <input type="text" name={`expCompany${index}`} value={exp.company || ""} onChange={(e) => {
                                    let newExp = [...formData.experience];
                                    newExp[index] = { ...newExp[index], company: e.target.value };
                                    setFormData({ ...formData, experience: newExp });
                                }} placeholder="Company Name" className="w-full p-2 border rounded" />

                                <input type="text" name={`expYears${index}`} value={`${exp.from || ""} - ${exp.to || ""}`} placeholder="From - To" className="w-full p-2 border rounded" />

                                <textarea name={`expDescription${index}`} value={exp.description || ""} onChange={(e) => {
                                    let newExp = [...formData.experience];
                                    newExp[index] = { ...newExp[index], description: e.target.value };
                                    setFormData({ ...formData, experience: newExp });
                                }} placeholder="Description" className="w-full p-2 border rounded" />
                            </div>
                        ))}
                    </div>

                    {/* Certifications Section */}
                    <div>
                        <h3 className="font-bold text-gray-800 dark:text-gray-100">Certifications</h3>
                        {(formData.certifications.length > 0 ? formData.certifications : [{ name: "", organization: "" }]).map((cert, index) => (
                            <div key={index} className="mb-2">
                                <input type="text" name={`certName${index}`} value={cert.name || ""} onChange={(e) => {
                                    let newCerts = [...formData.certifications];
                                    newCerts[index] = { ...newCerts[index], name: e.target.value };
                                    setFormData({ ...formData, certifications: newCerts });
                                }} placeholder="Certification Name" className="w-full p-2 border rounded" />

                                <input type="text" name={`certOrg${index}`} value={cert.organization || ""} onChange={(e) => {
                                    let newCerts = [...formData.certifications];
                                    newCerts[index] = { ...newCerts[index], organization: e.target.value };
                                    setFormData({ ...formData, certifications: newCerts });
                                }} placeholder="Issuing Organization" className="w-full p-2 border rounded" />
                            </div>
                        ))}
                    </div>


                    <div className="flex justify-end space-x-2">
                        <button type="button" className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UpdateProfileModal;
