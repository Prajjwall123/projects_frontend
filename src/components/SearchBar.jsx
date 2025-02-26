import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSkills, fetchProjects } from "../core/utils/projectHelpers";

const SearchBar = ({ className = "", setSelectedCategory, setSearchQuery, theme }) => {
    const { data: skills, isLoading, error } = useQuery({
        queryKey: ["skills"],
        queryFn: fetchSkills,
        retry: false,
    });

    const { data: projects } = useQuery({
        queryKey: ["projects"],
        queryFn: fetchProjects,
        retry: false,
    });

    const [suggestions, setSuggestions] = useState([]);
    const [query, setQuery] = useState("");

    const handleCategoryChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedCategory(selectedValue === "" ? "" : selectedValue);
    };

    // Handle input change and provide suggestions
    const handleSearchChange = (e) => {
        const input = e.target.value;
        setQuery(input);
        setSearchQuery(input); // Pass query to Home component

        if (input.length > 0) {
            const filteredSuggestions = projects?.filter((project) =>
                project.title.toLowerCase().includes(input.toLowerCase())
            );
            setSuggestions(filteredSuggestions || []);
        } else {
            setSuggestions([]);
        }
    };

    // Handle clicking on a suggestion
    const handleSuggestionClick = (title) => {
        setQuery(title);
        setSearchQuery(title);
        setSuggestions([]); // Hide suggestions
    };

    return (
        <div className={`relative flex flex-col space-y-2 p-4 rounded-md shadow ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"} ${className}`}>
            <div className="flex items-center space-x-4">
                <div className="flex items-center rounded-md px-2 py-1 flex-grow relative">
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
                        className={`w-full border-none focus:outline-none ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}
                        value={query}
                        onChange={handleSearchChange}
                    />
                    {/* Suggestions dropdown */}
                    {suggestions.length > 0 && (
                        <ul className={`absolute top-12 left-0 w-full border rounded-md shadow-md max-h-40 overflow-auto z-10 ${theme === "dark" ? "bg-gray-700 text-black" : "bg-white text-gray-900"}`}>
                            {suggestions.map((project) => (
                                <li
                                    key={project._id}
                                    className="p-2 hover:bg-gray-300 cursor-pointer"
                                    onClick={() => handleSuggestionClick(project.title)}
                                >
                                    {project.title}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="relative">
                    <select
                        className={`rounded-md py-2 px-3 focus:outline-none ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-900"}`}
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
        </div>
    );
};

export default SearchBar;
