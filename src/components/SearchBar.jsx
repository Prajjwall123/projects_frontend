import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSkills, fetchProjects } from "../core/utils/projectHelpers";
import { FaSearch } from "react-icons/fa";

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

    const handleSearchChange = (e) => {
        const input = e.target.value;
        setQuery(input);
        setSearchQuery(input);

        if (input.length > 0) {
            const filteredSuggestions = projects?.filter((project) =>
                project.title.toLowerCase().includes(input.toLowerCase())
            );
            setSuggestions(filteredSuggestions || []);
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (title) => {
        setQuery(title);
        setSearchQuery(title);
        setSuggestions([]);
    };

    return (
        <div
            className={`relative flex flex-col sm:flex-row items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl shadow-lg backdrop-blur-md border border-opacity-20 border-white/10 ${theme === "dark" ? "bg-gray-800/90 text-white" : "bg-gray-200/90 text-gray-900"
                } ${className}`}
            style={{
                background: theme === "dark"
                    ? "linear-gradient(145deg, rgba(31, 41, 55, 0.9), rgba(17, 24, 39, 0.7))"
                    : "linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(243, 244, 246, 0.7))",
            }}
        >
            <div className="flex items-center rounded-lg px-2 sm:px-3 py-1 sm:py-2 flex-grow relative">
                <FaSearch
                    className={`h-4 sm:h-5 w-4 sm:w-5 mr-1 sm:mr-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                />
                <input
                    type="text"
                    placeholder="Search by project title..."
                    className={`w-full bg-transparent focus:outline-none text-xs sm:text-sm md:text-base placeholder-gray-500 dark:placeholder-gray-400 ${theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                    value={query}
                    onChange={handleSearchChange}
                />
                {suggestions.length > 0 && (
                    <ul
                        className={`absolute top-12 sm:top-14 left-0 w-full border rounded-md shadow-md max-h-40 overflow-auto z-10 ${theme === "dark"
                                ? "bg-gray-700 text-white border-gray-600"
                                : "bg-white text-gray-900 border-gray-300"
                            }`}
                    >
                        {suggestions.map((project) => (
                            <li
                                key={project._id}
                                className={`p-2 text-xs sm:text-sm hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer transition-all duration-200 ${theme === "dark" ? "hover:text-black" : "hover:text-white"
                                    }`}
                                onClick={() => handleSuggestionClick(project.title)}
                            >
                                {project.title}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="relative w-full sm:w-auto">
                <select
                    className={`w-full sm:w-auto rounded-lg py-1 sm:py-2 px-2 sm:px-3 text-xs sm:text-sm md:text-base focus:outline-none ${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"
                        }`}
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

            <button
                className={`w-full sm:w-auto px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 hover:scale-105 ${theme === "dark"
                        ? "bg-blue-600 text-white hover:bg-blue-500"
                        : "bg-black text-white hover:bg-gray-800"
                    }`}
            >
                Find Project
            </button>
        </div>
    );
};

export default SearchBar;