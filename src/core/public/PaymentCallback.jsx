import React, { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { verifyWalletTransaction } from "../utils/paymentHelpers";

const PaymentCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const hasRun = useRef(false);

    useEffect(() => {
        const handlePaymentVerification = async () => {
            if (hasRun.current) return;
            hasRun.current = true;

            const pidx = searchParams.get("pidx");
            const status = searchParams.get("status");
            const trans_ID = localStorage.getItem("transactionId");
            const companyId = localStorage.getItem("companyId");

            console.log("Payment Callback Logs:");
            console.log("Transaction ID:", trans_ID);
            console.log("Company ID:", companyId);
            console.log("pidx:", pidx);
            console.log("status:", status);

            if (!companyId) {
                console.error("Company ID not found in local storage!");
                toast.error("Company ID is missing. Redirecting to home.");
                navigate("/");
                return;
            }

            if (status === "Completed" && pidx) {
                try {
                    const response = await verifyWalletTransaction(pidx, trans_ID);
                    if (response.success) {
                        toast.success("Payment verified and wallet updated!");
                    } else {
                        toast.error("Payment verification failed.");
                    }
                } catch (error) {
                    console.error("Error verifying transaction:", error.message);
                    toast.error("Failed to verify payment.");
                }
            } else if (status === "User canceled") {
                toast.error("Payment was canceled by the user.");
            } else {
                toast.error("Payment failed or incomplete.");
            }

            navigate(`/company/${companyId}`);
            localStorage.removeItem("transactionId");
            localStorage.removeItem("companyId");
            localStorage.removeItem("response");
        };

        handlePaymentVerification();
    }, [searchParams, navigate]);

    return (
        <div className="flex items-center justify-center h-screen">
            <p>Processing your payment...</p>
        </div>
    );
};

export default PaymentCallback;
