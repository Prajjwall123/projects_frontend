import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCompanyById } from "../utils/companyHelpers";

function Company() {
    const location = useLocation();
    const navigate = useNavigate();

    const [companyId, setCompanyId] = useState(null);
    const [company, setCompany] = useState(null);

    useEffect(() => {
        if (location.state && location.state.companyId) {
            setCompanyId(location.state.companyId);
        } else {
            navigate("/");
        }
    }, [location, navigate]);

    useEffect(() => {
        if (!companyId) return;

        const fetchCompanyData = async () => {
            try {
                const companyData = await getCompanyById(companyId);
                setCompany(companyData);
            } catch (error) {
                console.error('Error fetching company data:', error);
            }
        };

        fetchCompanyData();
    }, [companyId]);

    return (
        <div>
            {company ? (
                <div>
                    <h1>{company.companyName}</h1>
                    <img
                        src={`http://localhost:3000/${company.logo}`}
                        alt="Company Logo"
                        style={{ width: '150px', height: '150px', borderRadius: '10%' }}
                    />
                    <p><strong>Bio:</strong> {company.companyBio}</p>
                    <p><strong>Employees:</strong> {company.employees}</p>
                    <p><strong>Posted:</strong> {company.projectsPosted}</p>
                    <p><strong>Awarded:</strong> {company.projectsAwarded}</p>
                    <p><strong>Completed:</strong> {company.projectsCompleted}</p>
                </div>
            ) : (
                <p>Loading company profile...</p>
            )}
        </div>
    );
}

export default Company;