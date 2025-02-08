import React from "react";

const StatsSection = ({ company, theme }) => {
    const getClassNames = (lightClass, darkClass) => {
        return theme === "dark" ? lightClass : darkClass;
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className={`p-6 rounded shadow flex flex-col items-center text-center w-full ${getClassNames("bg-blue-600 text-white", "bg-blue-100 text-blue-800")}`}>
                <p className="text-2xl font-bold">{company ? company.projectsPosted : "75"}</p>
                <p className="text-sm sm:text-base">Projects Posted</p>
            </div>
            <div className={`p-6 rounded shadow flex flex-col items-center text-center w-full ${getClassNames("bg-green-600 text-white", "bg-green-100 text-green-800")}`}>
                <p className="text-2xl font-bold">{company ? company.projectsAwarded : "50"}</p>
                <p className="text-sm sm:text-base">Projects Awarded</p>
            </div>
            <div className={`p-6 rounded shadow flex flex-col items-center text-center w-full ${getClassNames("bg-purple-600 text-white", "bg-purple-100 text-purple-800")}`}>
                <p className="text-2xl font-bold">{company ? company.projectsCompleted : "70"}</p>
                <p className="text-sm sm:text-base">Projects Completed</p>
            </div>
        </div>
    );
};

export default StatsSection;
