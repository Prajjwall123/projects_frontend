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

const ChartsSection = () => {
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

    return (
        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white p-6 rounded shadow w-full">
                <h3 className="text-lg font-bold mb-4">Total Project Value</h3>
                <p className="text-xl font-bold">90,000</p>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={staticBarData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#FFA500" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="bg-white p-6 rounded shadow border border-blue-400 w-full">
                <h3 className="text-lg font-bold mb-4">Bids Frequency</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={staticLineData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#007BFF" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ChartsSection;
