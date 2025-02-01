import { useState, useEffect } from "react";
import { fetchSkills, uploadImage, registerUser } from "../utils/authHelpers";
import { useNavigate } from 'react-router-dom';


const Register = () => {
    const navigate = useNavigate();
    const [userType, setUserType] = useState("freelancer");
    const [loading, setLoading] = useState(false);
    const [skills, setSkills] = useState([]);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        role: "freelancer",
        freelancerName: "",
        skills: [],
        experienceYears: "",
        availability: "",
        portfolio: "",
        profileImage: null,
        companyName: "",
        companyBio: "",
        employees: "",
        logo: null,
    });

    useEffect(() => {
        if (userType === "freelancer") {
            const getSkills = async () => {
                try {
                    const fetchedSkills = await fetchSkills();
                    setSkills(fetchedSkills);
                } catch (error) {
                    console.error("Error fetching skills:", error);
                }
            };
            getSkills();
        }
    }, [userType]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    };

    const toggleSkill = (skillId) => {
        setFormData((prevData) => {
            const newSkills = prevData.skills.includes(skillId)
                ? prevData.skills.filter((s) => s !== skillId)
                : [...prevData.skills, skillId];
            return { ...prevData, skills: newSkills };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        setLoading(true);

        try {
            let imageUrl = "";
            if (userType === "freelancer" && formData.profileImage) {
                imageUrl = await uploadImage(formData.profileImage);
            } else if (userType === "company" && formData.logo) {
                imageUrl = await uploadImage(formData.logo);
            }

            const dataToSend = userType === "freelancer" ? {
                email: formData.email,
                password: formData.password,
                role: "freelancer",
                freelancerName: formData.freelancerName,
                skills: formData.skills,
                experienceYears: formData.experienceYears,
                availability: formData.availability,
                portfolio: formData.portfolio,
                profileImage: imageUrl,
            } : {
                email: formData.email,
                password: formData.password,
                role: "company",
                companyName: formData.companyName,
                companyBio: formData.companyBio,
                employees: formData.employees,
                logo: imageUrl,
            };

            await registerUser(dataToSend);

            alert("Registration successful!");
            navigate("/verify-otp", { state: { email: formData.email } });

            setFormData({
                email: "",
                password: "",
                confirmPassword: "",
                role: "freelancer",
                freelancerName: "",
                skills: [],
                experienceYears: "",
                availability: "",
                portfolio: "",
                profileImage: null,
                companyName: "",
                companyBio: "",
                employees: "",
                logo: null,
            });
        } catch (error) {
            alert("Registration failed!");
        }

        setLoading(false);
    };


    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-center mb-4">
                <button className={`px-4 py-2 rounded-l ${userType === "freelancer" ? "bg-blue-500 text-white" : "bg-gray-200"}`} onClick={() => setUserType("freelancer")}>Freelancer</button>
                <button className={`px-4 py-2 rounded-r ${userType === "company" ? "bg-blue-500 text-white" : "bg-gray-200"}`} onClick={() => setUserType("company")}>Company</button>
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded mb-2" required />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full p-2 border rounded mb-2" required />
                <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="w-full p-2 border rounded mb-2" required />

                {userType === "freelancer" ? (
                    <>
                        <input type="text" name="freelancerName" placeholder="Freelancer Name" value={formData.freelancerName} onChange={handleChange} className="w-full p-2 border rounded mb-2" required />
                        <div className="w-full p-2 border rounded mb-2 flex flex-wrap gap-2">
                            {skills.map((skill) => (
                                <button
                                    key={skill._id}
                                    type="button"
                                    className={`px-2 py-1 rounded ${formData.skills.includes(skill._id) ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                                    onClick={() => toggleSkill(skill._id)}
                                >
                                    {skill.name}
                                </button>
                            ))}
                        </div>
                        <input type="number" name="experienceYears" placeholder="Experience Years" value={formData.experienceYears} onChange={handleChange} className="w-full p-2 border rounded mb-2" />
                        <input type="text" name="availability" placeholder="Availability" value={formData.availability} onChange={handleChange} className="w-full p-2 border rounded mb-2" />
                        <input type="text" name="portfolio" placeholder="Portfolio URL" value={formData.portfolio} onChange={handleChange} className="w-full p-2 border rounded mb-2" />
                        <input type="file" name="profileImage" onChange={handleFileChange} className="w-full p-2 border rounded mb-2" accept="image/*" />
                    </>
                ) : (
                    <>
                        <input type="text" name="companyName" placeholder="Company Name" value={formData.companyName} onChange={handleChange} className="w-full p-2 border rounded mb-2" required />
                        <textarea name="companyBio" placeholder="Company Bio" value={formData.companyBio} onChange={handleChange} className="w-full p-2 border rounded mb-2" />
                        <input type="number" name="employees" placeholder="Number of Employees" value={formData.employees} onChange={handleChange} className="w-full p-2 border rounded mb-2" />
                        <input type="file" name="logo" onChange={handleFileChange} className="w-full p-2 border rounded mb-2" accept="image/*" />
                    </>
                )}

                <button type="submit" className={`w-full py-2 rounded mt-4 ${loading ? "bg-gray-400" : "bg-blue-500 text-white"}`} disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
        </div>
    );
};

export default Register;
