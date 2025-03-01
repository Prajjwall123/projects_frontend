import React, { useEffect, useState } from "react";
import { getWalletBalance, loadWallet } from "../utils/paymentHelpers";
import khaltiLogo from '../../assets/khalti-icon.png';

const Bank = ({ freelancerId }) => {
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [amount, setAmount] = useState("");


    useEffect(() => {
        const fetchWalletBalance = async () => {
            localStorage.setItem("freelancerId", freelancerId);

            try {
                setLoading(true);
                const userId = localStorage.getItem("userId");

                if (!userId) {
                    throw new Error("User ID not found. Please log in.");
                }

                const params = { freelancerId };
                // if (freelancerId) params.freelancerId = freelancerId;
                // if (companyId) params.companyId = companyId;

                const data = await getWalletBalance(params);
                setBalance(data.balance || 0);
            } catch (err) {
                setError(err.message || "Failed to fetch wallet balance");
            } finally {
                setLoading(false);
            }
        };

        fetchWalletBalance();
    }, [freelancerId]);

    const handleLoadWallet = async () => {
        if (!amount || isNaN(amount) || parseInt(amount, 10) <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        try {
            const data = await loadWallet(parseInt(amount, 10));
            if (data.payment_url) {
                window.location.href = data.payment_url;
            }
        } catch (error) {
            alert(error.message || "Failed to initiate wallet load.");
        }
        setIsModalOpen(false);
        setAmount("");
    };


    return (
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-8 text-center border border-gray-200 transform transition-all duration-300 hover:shadow-2xl hover:scale-105">
            <div className="flex justify-center items-center mb-4">
                <img src={khaltiLogo} alt="Khalti Logo" className="w-16 h-auto " />
            </div>

            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Wallet Balance</h2>
            <p className="text-gray-500 text-sm mb-4"> Manage your Khalti balance</p>

            {loading ? (
                <p className="text-gray-600 text-lg font-medium animate-pulse">Loading...</p>
            ) : error ? (
                <p className="text-red-500 text-lg font-medium">{error}</p>
            ) : (
                <>
                    <p className="text-2xl font-bold text-gray-900 mb-6">
                        Balance: <span className="text-green-600">NPR {balance}</span>
                    </p>

                    <button
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-md transform hover:scale-105"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Load Wallet
                    </button>

                </>
            )}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Load Wallet</h3>

                        <input
                            type="number"
                            placeholder="Enter amount (NPR)"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />

                        <div className="flex justify-between mt-4">
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                                onClick={handleLoadWallet}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
};

export default Bank;
