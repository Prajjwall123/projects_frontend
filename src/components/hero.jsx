import React from "react";
import hero from "../assets/hero.png";

const Hero = ({ theme }) => {
    const isDark = theme === "dark";

    const containerStyle = {
        backgroundColor: isDark ? "#000000" : "#939EA8",
        color: isDark ? "#E5E7EB" : "#1A202C",
        borderRadius: "20px",
        transform: "skew(-10deg) translateX(-150px)",
    };

    const buttonClass = isDark
        ? "btn bg-blue-600 text-white hover:bg-blue-700"
        : "btn bg-black text-white hover:bg-gray-800";

    const outlineButtonClass = isDark
        ? "btn btn-outline border-gray-300 text-gray-300 hover:bg-gray-300 hover:text-black"
        : "btn btn-outline border-black text-black hover:bg-black hover:text-white";

    return (
        <div className={`hero ${isDark ? "bg-gray-900" : "bg-base-200"} min-h-screen`}>
            <div className="hero-content flex-col lg:flex-row-reverse">
                <img
                    src={hero}
                    className="max-w-sm rounded-lg"
                    alt="Hero Illustration"
                />
                <div className="p-10 skewed-container font-sans" style={containerStyle}>
                    <div style={{ transform: "skew(10deg)" }}>
                        <h1 className="text-7xl font-bold">Browse..</h1>
                        <h1 className="text-7xl font-bold">Bid..</h1>
                        <h1 className="text-7xl font-bold">Build..</h1>
                        <p className="py-6 text-xl">
                            Discover projects you love, build the career you deserve.
                        </p>
                        <div className="flex gap-4">
                            <button className={buttonClass}>
                                <a href="/register">I am a freelancer</a>
                            </button>
                            <button className={outlineButtonClass}>
                                <a href="/register">I am an enterprise</a>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
