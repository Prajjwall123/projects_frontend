import React, { useState, useEffect, useRef } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const staticBarData = [
    { name: 'Jan', value: 1000 },
    { name: 'Feb', value: 2000 },
    { name: 'Mar', value: 1500 },
    { name: 'Apr', value: 2500 },
    { name: 'May', value: 1800 },
    { name: 'Jun', value: 2200 },
];

const staticLineData = [
    { name: 'Sunday', value: 100 },
    { name: 'Monday', value: 400 },
    { name: 'Tuesday', value: 300 },
    { name: 'Wednesday', value: 200 },
    { name: 'Thursday', value: 250 },
    { name: 'Friday', value: 150 },
    { name: 'Saturday', value: 400 },
];

const ChartsSection = ({ theme }) => {
    const containerRef = useRef(null);
    const [chartWidth, setChartWidth] = useState(400);

    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setChartWidth(containerRef.current.offsetWidth);
            }
        };

        updateWidth();
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, []);

    const cardClass = theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black";
    const gridColor = theme === "dark" ? "#666" : "#ccc";
    const barColor = theme === "dark" ? "#FFA500" : "#FF5733";
    const lineColor = theme === "dark" ? "#4CAF50" : "#007BFF";

    return (
        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className={`p-6 rounded shadow w-full ${cardClass}`}>
                <h3 className="text-lg font-bold mb-4">Total Project Value</h3>
                <p className="text-xl font-bold">90,000</p>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={staticBarData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis dataKey="name" stroke={theme === "dark" ? "#FFF" : "#000"} />
                        <YAxis stroke={theme === "dark" ? "#FFF" : "#000"} />
                        <Tooltip contentStyle={{ backgroundColor: theme === "dark" ? "#333" : "#FFF", color: theme === "dark" ? "#FFF" : "#000" }} />
                        <Bar dataKey="value" fill={barColor} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className={`p-6 rounded shadow w-full border ${theme === "dark" ? "border-blue-500" : "border-blue-400"} ${cardClass}`}>
                <h3 className="text-lg font-bold mb-4">Bids Frequency</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={staticLineData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                        <XAxis dataKey="name" stroke={theme === "dark" ? "#FFF" : "#000"} />
                        <YAxis stroke={theme === "dark" ? "#FFF" : "#000"} />
                        <Tooltip contentStyle={{ backgroundColor: theme === "dark" ? "#333" : "#FFF", color: theme === "dark" ? "#FFF" : "#000" }} />
                        <Line type="monotone" dataKey="value" stroke={lineColor} strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ChartsSection;
