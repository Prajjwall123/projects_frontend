import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFreelancerById } from "../utils/freelancerHelpers";
import { fetchSkills } from "../utils/authHelpers";

function ProfilePage() {
    const { freelancerId } = useParams();
    const navigate = useNavigate();
    const [freelancer, setFreelancer] = useState(null);
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log(freelancerId);
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
        // } else {
        //     navigate("/");
        // }
    }, [freelancerId, navigate]);

    return (
        <div>
            {loading ? (
                <p>Loading profile...</p>
            ) : freelancer ? (
                <div>
                    <h1>{freelancer.freelancerName}'s Profile</h1>
                    <img
                        src={`http://localhost:3000/images/${freelancer.profileImage}`}
                        alt="Profile"
                        style={{ width: '150px', height: '150px', borderRadius: '50%' }}
                    />
                    <p><strong>Availability:</strong> {freelancer.availability}</p>
                    <p><strong>Experience:</strong> {freelancer.experienceYears} years</p>
                    <p><strong>Portfolio:</strong> <a href={freelancer.portfolio} target="_blank" rel="noopener noreferrer">View Portfolio</a></p>
                    <h3>Skills:</h3>
                    <ul>
                        {skills.map(skill => (
                            <li key={skill._id}>{skill.name}</li>
                        ))}
                    </ul>
                    <p><strong>Projects Completed:</strong> {freelancer.projectsCompleted}</p>
                </div>
            ) : (
                <p>Freelancer profile not found.</p>
            )}
        </div>
    );
}

export default ProfilePage;
