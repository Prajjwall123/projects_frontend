import React, { useEffect, useState } from "react";
import { getCompanyById } from "../core/utils/companyHelpers";
import { FaFolder, FaAward, FaCheckCircle } from "react-icons/fa";

const StatsSection = ({ companyId, theme }) => {
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("Fetching data for companyId:", companyId);

        if (!companyId) {
            console.error(" Error: companyId is missing or invalid!");
            setError("Invalid company ID.");
            setLoading(false);
            return;
        }

        const fetchCompanyData = async () => {
            try {
                const data = await getCompanyById(companyId);
                console.log("Successfully fetched company data:", data);
                setCompany(data);
            } catch (error) {
                console.error(" API Error fetching company data:", error.response ? error.response.data : error);
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

    if (loading) return <p className="text-center p-4">Loading company stats...</p>;
    if (error) return <p className="text-center p-4 text-red-500">{error}</p>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div
                className={`p-4 sm:p-6 rounded-lg shadow-lg flex flex-col items-center text-center w-full transform transition-all duration-300 hover:scale-105 ${getClassNames(
                    "bg-blue-100 text-blue-800",
                    "bg-blue-600 text-white"
                )}`}
            >
                <FaFolder className="text-3xl sm:text-4xl mb-2" />
                <p className="text-2xl sm:text-3xl font-bold">{company?.projectsPosted ?? "N/A"}</p>
                <p className="text-sm sm:text-base mt-1">Projects Posted</p>
            </div>
            <div
                className={`p-4 sm:p-6 rounded-lg shadow-lg flex flex-col items-center text-center w-full transform transition-all duration-300 hover:scale-105 ${getClassNames(
                    "bg-green-100 text-green-800",
                    "bg-green-600 text-white"
                )}`}
            >
                <FaAward className="text-3xl sm:text-4xl mb-2" />
                <p className="text-2xl sm:text-3xl font-bold">{company?.projectsAwarded ?? "N/A"}</p>
                <p className="text-sm sm:text-base mt-1">Projects Awarded</p>
            </div>
            <div
                className={`p-4 sm:p-6 rounded-lg shadow-lg flex flex-col items-center text-center w-full transform transition-all duration-300 hover:scale-105 ${getClassNames(
                    "bg-purple-100 text-purple-800",
                    "bg-purple-600 text-white"
                )}`}
            >
                <FaCheckCircle className="text-3xl sm:text-4xl mb-2" />
                <p className="text-2xl sm:text-3xl font-bold">{company?.projectsCompleted ?? "N/A"}</p>
                <p className="text-sm sm:text-base mt-1">Projects Completed</p>
            </div>
        </div>
    );
};

export default StatsSection;