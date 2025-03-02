import React, { useEffect, useState } from "react";
import { getCompanyById } from "../core/utils/companyHelpers"; // Ensure correct import path

const StatsSection = ({ companyId, theme }) => {
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("Fetching data for companyId:", companyId);

        if (!companyId) {
            console.error("❌ Error: companyId is missing or invalid!");
            setError("Invalid company ID.");
            setLoading(false);
            return;
        }

        const fetchCompanyData = async () => {
            try {
                const data = await getCompanyById(companyId);
                console.log("✅ Successfully fetched company data:", data);
                setCompany(data);
            } catch (error) {
                console.error("❌ API Error fetching company data:", error.response ? error.response.data : error);
                setError("Failed to load company stats.");
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyData();
    }, [companyId]);


    const getClassNames = (lightClass, darkClass) => {
        return theme === "dark" ? darkClass : lightClass;
    };

    if (loading) return <p className="text-center">Loading company stats...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className={`p-6 rounded shadow flex flex-col items-center text-center w-full ${getClassNames("bg-blue-100 text-blue-800", "bg-blue-600 text-white")}`}>
                <p className="text-2xl font-bold">{company?.projectsPosted ?? "N/A"}</p>
                <p className="text-sm sm:text-base">Projects Posted</p>
            </div>
            <div className={`p-6 rounded shadow flex flex-col items-center text-center w-full ${getClassNames("bg-green-100 text-green-800", "bg-green-600 text-white")}`}>
                <p className="text-2xl font-bold">{company?.projectsAwarded ?? "N/A"}</p>
                <p className="text-sm sm:text-base">Projects Awarded</p>
            </div>
            <div className={`p-6 rounded shadow flex flex-col items-center text-center w-full ${getClassNames("bg-purple-100 text-purple-800", "bg-purple-600 text-white")}`}>
                <p className="text-2xl font-bold">{company?.projectsCompleted ?? "N/A"}</p>
                <p className="text-sm sm:text-base">Projects Completed</p>
            </div>
        </div>
    );
};

export default StatsSection;
