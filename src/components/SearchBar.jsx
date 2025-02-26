import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSkills } from "../core/utils/projectHelpers";

const SearchBar = ({ className = "", setSelectedCategory, setSearchQuery }) => {
    const { data: skills, isLoading, error } = useQuery({
        queryKey: ["skills"],
        queryFn: fetchSkills,
        retry: false,
    });

    const handleCategoryChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedCategory(selectedValue === "" ? "" : selectedValue);
    };

    return (
        <div className={`flex items-center space-x-4 p-4 bg-white rounded-md shadow ${className}`}>
            <div className="flex items-center rounded-md px-2 py-1 flex-grow">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>
                <input
                    type="text"
                    placeholder="Search by project title..."
                    className="w-full border-none focus:outline-none text-gray-700"
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="relative">
                <select
                    className="rounded-md py-2 px-3 text-gray-700 bg-white focus:outline-none"
                    onChange={handleCategoryChange}
                >
                    <option value="">All</option>
                    {isLoading ? (
                        <option>Loading...</option>
                    ) : error ? (
                        <option>Error loading categories</option>
                    ) : (
                        skills?.map((skill) => (
                            <option key={skill._id} value={skill._id}>
                                {skill.name}
                            </option>
                        ))
                    )}
                </select>
            </div>

            <button className="bg-black text-white py-2 px-4 rounded-md shadow">
                Find Project
            </button>
        </div>
    );
};

export default SearchBar;
