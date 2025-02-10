import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";

const BiddersList = ({ projectId, theme }) => {
    const [bidders, setBidders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBidders = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`http://localhost:3000/api/biddings/project/${projectId}`);
                if (response.ok) {
                    const data = await response.json();
                    setBidders(data.data);
                } else {
                    const errorData = await response.json();
                    setError(errorData.message || "Failed to load bidders.");
                }
            } catch (err) {
                console.error("Error fetching bidders:", err);
                setError("Failed to load bidders.");
            } finally {
                setLoading(false);
            }
        };

        fetchBidders();
    }, [projectId]);

    if (loading) return <p className="text-gray-600">Loading bidders...</p>;
    if (error) return <p className="text-red-600">{error}</p>;
    if (bidders.length === 0) return <p className="text-gray-600">No bidders found for this project.</p>;

    const listItemClass = theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-black";
    const borderClass = theme === "dark" ? "border-gray-700" : "border-gray-300";

    return (
        <div className={`p-6 rounded shadow-md ${listItemClass}`}>
            <h2 className="text-2xl font-bold mb-4">Bidders</h2>
            <ul className={`divide-y ${borderClass}`}>
                {bidders.map((bid) => (
                    <li key={bid._id} className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300">
                                {bid.freelancer.profileImage ? (
                                    <img
                                        src={`http://localhost:3000/${bid.freelancer.profileImage}`}
                                        alt="Freelancer"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <FaUserCircle className="text-4xl text-gray-500" />
                                )}
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold">{bid.freelancer.freelancerName || "Unknown Freelancer"}</h3>
                                <p className="text-sm text-gray-500">{bid.freelancer.skills?.join(", ") || "No skills listed"}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-bold">NRs {bid.amount}</p>
                            <p className="text-sm text-gray-500">Bidding Amount</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BiddersList;
