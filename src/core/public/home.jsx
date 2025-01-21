import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import Hero from "../../components/hero";
import Footer from "../../components/footer";
import Card from "../../components/card";
import SearchBar from "../../components/SearchBar";
import { fetchProjects } from "../utils/projectHelpers";

function Home() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const data = await fetchProjects();
                setProjects(data);
            } catch (error) {
                console.error("Failed to load projects:", error);
            } finally {
                setLoading(false);
            }
        };

        loadProjects();
    }, []);

    return (
        <div className="bg-base-200 min-h-screen">
            <Navbar />
            <Hero />
            <div className="text-5xl font-sans font-bold bg-base-200 text-center mt-6">
                Explore Projects:
            </div>
            <div className="mt-5 mb-5">
                <SearchBar />
            </div>

            {loading ? (
                <div className="text-center text-lg text-gray-500 mt-10">
                    Loading projects...
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {projects.length > 0 ? (
                        projects.map((project) => (
                            <Card key={project._id} project={project} />
                        ))
                    ) : (
                        <div className="text-center text-lg text-gray-500 col-span-full">
                            No projects found.
                        </div>
                    )}
                </div>
            )}

            <Footer />
        </div>
    );
}

export default Home;
