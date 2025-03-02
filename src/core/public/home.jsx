import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "../../components/navbar";
import Hero from "../../components/hero";
import Footer from "../../components/footer";
import Card from "../../components/card";
import SearchBar from "../../components/SearchBar";
import { fetchProjectsByCategory } from "../utils/projectHelpers";

const Home = ({ theme, toggleTheme }) => {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const { data: projects, isLoading, error } = useQuery({
        queryKey: ["projects", selectedCategory],
        queryFn: () => fetchProjectsByCategory(selectedCategory),
    });

    const filteredProjects = projects?.filter((project) =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div
            className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
                }`}
        >
            <Navbar theme={theme} toggleTheme={toggleTheme} />
            <Hero theme={theme} />
            <div className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold text-center mt-4 sm:mt-6 md:mt-8 tracking-tight">
                Explore Projects
            </div>

            <div className="mt-4 sm:mt-5 mb-4 sm:mb-5">
                <SearchBar
                    className="w-full sm:w-3/4 mx-auto"
                    setSelectedCategory={setSelectedCategory}
                    setSearchQuery={setSearchQuery}
                    theme={theme}
                />
            </div>

            {isLoading ? (
                <div
                    className={`text-center text-sm sm:text-base md:text-lg mt-6 sm:mt-8 md:mt-10 ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                >
                    Loading projects...
                </div>
            ) : error ? (
                <div className="text-center text-sm sm:text-base md:text-lg text-red-500 mt-6 sm:mt-8 md:mt-10">
                    Failed to load projects.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 p-3 sm:p-4 md:p-6">
                    {filteredProjects?.length > 0 ? (
                        filteredProjects.map((project) => (
                            <Card key={project.projectId} project={project} theme={theme} />
                        ))
                    ) : (
                        <div
                            className={`text-center text-sm sm:text-base md:text-lg col-span-full ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                                }`}
                        >
                            No projects found.
                        </div>
                    )}
                </div>
            )}

            <Footer theme={theme} />
        </div>
    );
};

export default Home;