import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOTP } from "../utils/authHelpers";

const VerifyOTPPage = () => {
    const [otp, setOTP] = useState("");
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { email: location.state.email, otp };
            await verifyOTP(payload);
            navigate("/login");
        } catch (err) {
            setError(err.message || "OTP verification failed");
        }
    };

    return (
        <div>
            <h1>Verify OTP</h1>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    name="otp"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOTP(e.target.value)}
                    required
                />
                <button type="submit">Verify OTP</button>
            </form>
        </div>
    );
};

export default VerifyOTPPage;
