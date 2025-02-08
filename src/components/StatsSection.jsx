import React from "react";

const StatsSection = ({ company }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded shadow flex flex-col items-center text-center w-full">
                <p className="text-2xl font-bold">{company ? company.projectsPosted : "75"}</p>
                <p className="text-gray-500 text-sm sm:text-base">Projects Posted</p>
            </div>
            <div className="bg-white p-6 rounded shadow flex flex-col items-center text-center w-full">
                <p className="text-2xl font-bold">{company ? company.projectsAwarded : "50"}</p>
                <p className="text-gray-500 text-sm sm:text-base">Projects Awarded</p>
            </div>
            <div className="bg-white p-6 rounded shadow flex flex-col items-center text-center w-full">
                <p className="text-2xl font-bold">{company ? company.projectsCompleted : "70"}</p>
                <p className="text-gray-500 text-sm sm:text-base">Projects Completed</p>
            </div>
        </div>
    );
};

export default StatsSection;
