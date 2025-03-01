import React, { useEffect, useState } from "react";
import { getWalletBalance, loadWallet } from "../../../utils/paymentHelpers";

const Wallet = ({ companyId, freelancerId }) => {
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWalletBalance = async () => {
            localStorage.setItem("companyId", companyId);

            try {
                setLoading(true);
                const userId = localStorage.getItem("userId");

                if (!userId) {
                    throw new Error("User ID not found. Please log in.");
                }

                const params = { userId };
                if (freelancerId) params.freelancerId = freelancerId;
                if (companyId) params.companyId = companyId;

                const data = await getWalletBalance(params);
                setBalance(data.balance || 0);
            } catch (err) {
                setError(err.message || "Failed to fetch wallet balance");
            } finally {
                setLoading(false);
            }
        };

        fetchWalletBalance();
    }, [companyId, freelancerId]);

    // Function to handle wallet loading
    const handleLoadWallet = async () => {
        const amount = prompt("Enter the amount to load into your wallet:");

        if (!amount || isNaN(amount) || amount <= 0) {
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
    };

    return (
        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Wallet Balance</h2>

            {loading ? (
                <p className="text-gray-600">Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <>
                    <p className="text-lg font-semibold text-gray-800 mb-4">
                        Balance: <span className="text-green-600">NPR {balance}</span>
                    </p>

                    {/* Load Wallet Button */}
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                        onClick={handleLoadWallet}
                    >
                        Load Wallet
                    </button>
                </>
            )}
        </div>
    );
};

export default Wallet;
