import API from './api';

export const initiatePayment = async (paymentData) => {
    try {
        const response = await API.post("payments/initiate", paymentData);
        console.log(response);
        return response.data;
    } catch (error) {
        console.error("Error initiating payment:", error);
        throw error.response ? error.response.data : { message: "Network error" };
    }
};
export const getWalletBalance = async ({ userId, freelancerId }) => {
    try {
        let endpoint = "";

        if (freelancerId) {
            endpoint = `wallets/balance/freelancer/${freelancerId}`;
            console.log(endpoint);
        } else if (userId) {
            endpoint = `wallets/balance/${userId}`;
            console.log(endpoint);
        } else {
            throw new Error("Either userId or freelancerId is required.");
        }

        const response = await API.get(endpoint);
        console.log(response);
        return response.data;
    } catch (error) {
        console.error("Error fetching wallet balance:", error);
        throw error.response ? error.response.data : { message: "Network error" };
    }
};

export const loadWallet = async (amount) => {
    try {
        const userId = localStorage.getItem("userId");

        if (!userId) {
            throw new Error("User ID not found. Please log in.");
        }

        const paymentData = {
            userId,
            amount,
            paymentGateway: "Khalti",
        };

        const response = await API.post("payments/initiate", paymentData);
        console.log("Wallet Load Response:", response.data);

        if (response.data.transactionId) {
            localStorage.setItem("transactionId", response.data.transactionId);
            console.log("Transaction ID saved:", response.data.transactionId);
        }

        localStorage.setItem("response", JSON.stringify(response.data));

        return response.data;
    } catch (error) {
        console.error("Error loading wallet:", error);
        throw error.response ? error.response.data : { message: "Network error" };
    }
};


export const verifyWalletTransaction = async (pidx, transactionId) => {

    try {
        const requestData = {
            pidx,
            transaction_id: transactionId,
        };

        const response = await API.post("payments/verify", requestData);
        return response.data;
    } catch (error) {
        console.error("Error verifying wallet transaction:", error);
        throw error.response ? error.response.data : { message: "Network error" };
    }
};

export const transferMoney = async (senderId, freelancerId, amount) => {
    try {
        const requestData = { senderId, freelancerId, amount };

        const response = await API.post("wallets/transfer", requestData);

        return response.data;
    } catch (error) {
        console.error("Error transferring money:", error);
        throw error.response ? error.response.data : { message: "Network error" };
    }
};