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
    const [searchQuery, setSearchQuery] = useState(""); // State for search query

    const { data: projects, isLoading, error } = useQuery({
        queryKey: ["projects", selectedCategory],
        queryFn: () => fetchProjectsByCategory(selectedCategory),
    });

    // Filter projects based on the search query (title match)
    const filteredProjects = projects?.filter((project) =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={`${theme === "dark" ? "bg-gray-900 text-white" : "bg-base-200 text-black"} min-h-screen`}>
            <Navbar theme={theme} toggleTheme={toggleTheme} />
            <Hero theme={theme} />
            <div className="text-5xl font-sans font-bold text-center mt-6">Explore Projects:</div>

            <div className="mt-5 mb-5">
                <SearchBar
                    className="w-3/4 mx-auto"
                    setSelectedCategory={setSelectedCategory}
                    setSearchQuery={setSearchQuery} // Pass search query state
                />
            </div>

            {isLoading ? (
                <div className="text-center text-lg mt-10">Loading projects...</div>
            ) : error ? (
                <div className="text-center text-lg text-red-500 mt-10">Failed to load projects.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {filteredProjects?.length > 0 ? (
                        filteredProjects.map((project) => <Card key={project.projectId} project={project} />)
                    ) : (
                        <div className="text-center text-lg col-span-full">No projects found.</div>
                    )}
                </div>
            )}

            <Footer theme={theme} />
        </div>
    );
};

export default Home;
