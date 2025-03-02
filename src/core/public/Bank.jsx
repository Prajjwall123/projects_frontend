import React, { useEffect, useState } from "react";
import { getWalletBalance, loadWallet } from "../utils/paymentHelpers";
import khaltiLogo from "../../assets/khalti-icon.png";
import { FaTimes, FaWallet } from "react-icons/fa";

const Bank = ({ freelancerId, theme }) => {
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
    <div
      className={`max-w-md mx-auto p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border ${
        theme === "dark"
          ? "bg-gray-800 border-gray-700 text-gray-100"
          : "bg-gray-50 border-gray-200 text-gray-900"
      }`}
    >
      <div className="flex justify-center items-center mb-3 sm:mb-4 md:mb-6">
        <img src={khaltiLogo} alt="Khalti Logo" className="w-12 sm:w-14 md:w-16 h-auto" />
      </div>

      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 text-center flex items-center justify-center">
        <FaWallet className="mr-2 text-teal-500 dark:text-teal-400" />
        Wallet Balance
      </h2>
      <p
        className={`text-gray-500 dark:text-gray-400 text-xs sm:text-sm md:text-base mb-3 sm:mb-4 md:mb-6 text-center`}
      >
        Manage your Khalti balance easily
      </p>

      {loading ? (
        <p
          className={`text-center text-sm sm:text-base md:text-lg font-medium animate-pulse ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Loading...
        </p>
      ) : error ? (
        <p className="text-red-500 text-sm sm:text-base md:text-lg font-medium text-center">
          {error}
        </p>
      ) : (
        <>
          <p
            className={`text-lg sm:text-xl md:text-2xl font-bold text-center mb-4 sm:mb-6 md:mb-8 ${
              theme === "dark" ? "text-gray-100" : "text-gray-900"
            }`}
          >
            Balance: <span className="text-green-500 dark:text-green-400">NPR {balance}</span>
          </p>

          <button
            className={`w-full px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base md:text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-md ${
              theme === "dark"
                ? "bg-teal-600 text-white hover:bg-teal-700"
                : "bg-teal-500 text-white hover:bg-teal-600"
            }`}
            onClick={() => setIsModalOpen(true)}
          >
            Load Wallet
          </button>
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4 md:p-6 overflow-y-auto">
          <div
            className={`relative p-4 sm:p-6 md:p-8 rounded-xl shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-md max-h-[90vh] overflow-y-auto border ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-gray-50 border-gray-200 text-gray-900"
            }`}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className={`absolute top-3 sm:top-4 right-3 sm:right-4 text-lg sm:text-xl font-bold transition-all duration-200 ${
                theme === "dark" ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FaTimes />
            </button>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 md:mb-6 text-center tracking-tight">
              Load Wallet
            </h3>

            <input
              type="number"
              placeholder="Enter amount (NPR)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full p-2 sm:p-3 border rounded-lg text-xs sm:text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200 ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-100 border-gray-300 text-gray-900"
              }`}
            />

            <div className="flex justify-between mt-3 sm:mt-4 md:mt-6 gap-2 sm:gap-3">
              <button
                className={`w-full px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm md:text-base font-semibold transition-all duration-200 hover:scale-105 ${
                  theme === "dark"
                    ? "bg-gray-600 text-white hover:bg-gray-500"
                    : "bg-gray-300 text-gray-800 hover:bg-gray-400"
                }`}
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className={`w-full px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm md:text-base font-semibold transition-all duration-200 hover:scale-105 ${
                  theme === "dark"
                    ? "bg-teal-600 text-white hover:bg-teal-500"
                    : "bg-teal-500 text-white hover:bg-teal-600"
                }`}
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