import { useState, useEffect } from "react";
import { fetchSkills, uploadImage, registerUser } from "../utils/authHelpers";
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../../assets/black-logo.png';


const RegisterSecond = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { email, password } = location.state || {};
    const [userType, setUserType] = useState("freelancer");
    const [loading, setLoading] = useState(false);
    const [skills, setSkills] = useState([]);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        email: email || "",
        password: password || "",
        confirmPassword: password || "",
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
        if (!location.state?.email || !location.state?.password) {
            navigate("/register");
        }
        //console.log(email);
        //console.log(password);
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
        <div className="bg-base-200 font-[sans-serif]">
            <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
                <div className="max-w-md w-full">
                    <a href="javascript:void(0)">
                        <img src={Logo} alt="logo" className="w-80 mb-8 mx-auto block" />
                    </a>

                    {/* Stepper */}
                    <ol className="items-center w-full flex justify-center space-x-8 sm:space-y-0 mb-6">
                        {/* Step 1: Account Info (Inactive step) */}
                        <li className="flex items-center text-gray-500 dark:text-gray-400 space-x-2.5 rtl:space-x-reverse">
                            <span className="flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
                                1
                            </span>
                            <span>
                                <h3 className="font-medium leading-tight">Account Info</h3>

                            </span>
                        </li>

                        {/* Step 2: Profile Info (Active step) */}
                        <li className="flex items-center text-xl text-blue-600 dark:text-blue-500 space-x-2.5 rtl:space-x-reverse">
                            <span className="flex items-center justify-center w-8 h-8 border border-blue-600 rounded-full shrink-0 dark:border-blue-500">
                                2
                            </span>
                            <span>
                                <h3 className="font-medium leading-tight">Profile Info</h3>

                            </span>
                        </li>

                        {/* Step 3: OTP Verification (Inactive step) */}
                        <li className="flex items-center text-gray-500 dark:text-gray-400 space-x-2.5 rtl:space-x-reverse">
                            <span className="flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
                                3
                            </span>
                            <span>
                                <h3 className="font-medium leading-tight">OTP Verification</h3>

                            </span>
                        </li>
                    </ol>

                    <div className="p-8 rounded-2xl bg-white shadow">
                        <h2 className="text-gray-800 text-center text-2xl font-bold mb-6">Register As</h2>

                        {error && <p className="text-red-500 text-center mt-2">{error}</p>}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex justify-center mb-4">
                                <button
                                    className={`px-4 py-2 rounded-l ${userType === "freelancer" ? "bg-black text-white" : "bg-gray-200"}`}
                                    onClick={() => setUserType("freelancer")}
                                >
                                    Freelancer
                                </button>
                                <button
                                    className={`px-4 py-2 rounded-r ${userType === "company" ? "bg-black text-white" : "bg-gray-200"}`}
                                    onClick={() => setUserType("company")}
                                >
                                    Company
                                </button>
                            </div>

                            {userType === "freelancer" ? (
                                <>
                                    <div>
                                        <label className="text-gray-800 text-sm mb-2 block">Freelancer Name</label>
                                        <input
                                            type="text"
                                            name="freelancerName"
                                            placeholder="Freelancer Name"
                                            value={formData.freelancerName}
                                            onChange={handleChange}
                                            className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                                            required
                                        />
                                    </div>

                                    <label className="text-gray-800 text-sm mt-2 block">Select Categories</label>
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
                                    <div>
                                        <label className="text-gray-800 text-sm mb-2 block">Experience Years</label>
                                        <input
                                            type="number"
                                            name="experienceYears"
                                            placeholder="Experience Years"
                                            value={formData.experienceYears}
                                            onChange={handleChange}
                                            className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-gray-800 text-sm mb-2 block">Availability</label>
                                        <input
                                            type="text"
                                            name="availability"
                                            placeholder="Availability"
                                            value={formData.availability}
                                            onChange={handleChange}
                                            className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-gray-800 text-sm mb-2 block">Portfolio URL</label>
                                        <input
                                            type="text"
                                            name="portfolio"
                                            placeholder="Portfolio URL"
                                            value={formData.portfolio}
                                            onChange={handleChange}
                                            className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-gray-800 text-sm mb-2 block">Profile Image</label>
                                        <input
                                            type="file"
                                            name="profileImage"
                                            onChange={handleFileChange}
                                            className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                                            accept="image/*"
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="text-gray-800 text-sm mb-2 block">Company Name</label>
                                        <input
                                            type="text"
                                            name="companyName"
                                            placeholder="Company Name"
                                            value={formData.companyName}
                                            onChange={handleChange}
                                            className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-gray-800 text-sm mb-2 block">Company Bio</label>
                                        <textarea
                                            name="companyBio"
                                            placeholder="Company Bio"
                                            value={formData.companyBio}
                                            onChange={handleChange}
                                            className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-gray-800 text-sm mb-2 block">Number of Employees</label>
                                        <input
                                            type="number"
                                            name="employees"
                                            placeholder="Number of Employees"
                                            value={formData.employees}
                                            onChange={handleChange}
                                            className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-gray-800 text-sm mb-2 block">Company Logo</label>
                                        <input
                                            type="file"
                                            name="logo"
                                            onChange={handleFileChange}
                                            className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-blue-600"
                                            accept="image/*"
                                        />
                                    </div>
                                </>
                            )}

                            <button
                                type="submit"
                                className={`btn bg-black text-white hover:text-black w-full ${loading ? "bg-gray-400" : "bg-black hover:bg-gray-600 hover:text-white"} focus:outline-none`}
                                disabled={loading}
                            >
                                {loading ? "Sending OTP...." : "Send OTP"}
                            </button>

                            <p className="text-gray-800 text-sm text-center mt-6">
                                Already have an account? <a href="/login" className="text-blue-600 hover:underline font-semibold">Sign in here</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default RegisterSecond;
