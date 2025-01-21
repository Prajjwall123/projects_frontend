import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOTP } from "../utils/authHelpers";

const VerifyOTPPage = () => {
    const [otp, setOTP] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    const handleInputChange = (value, index) => {
        if (/^\d*$/.test(value)) {
            const updatedOTP = [...otp];
            updatedOTP[index] = value;
            setOTP(updatedOTP);

            if (value && index < otp.length - 1) {
                document.getElementById(`otp-${index + 1}`).focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const updatedOTP = [...otp];
            updatedOTP[index - 1] = "";
            setOTP(updatedOTP);
            document.getElementById(`otp-${index - 1}`).focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpCode = otp.join("");
        try {
            const payload = { email: location.state.email, otp: otpCode };
            await verifyOTP(payload);
            navigate("/login");
        } catch (err) {
            setError(err.message || "OTP verification failed");
        }
    };

    return (
        <main className="bg-base-200 font-[sans-serif] relative   min-h-screen flex flex-col justify-center overflow-hidden">
            <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-24">
                <div className="flex justify-center">
                    <div className="max-w-md mx-auto text-center bg-white px-4 sm:px-8 py-10 rounded-xl shadow">
                        <header className="mb-8">
                            <h1 className="text-2xl font-bold mb-1">
                                Email Address Verification
                            </h1>
                            <p className="text-[15px] text-slate-500">
                                Enter the 6-digit verification code that was sent to your email address.
                            </p>
                        </header>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        <form onSubmit={handleSubmit}>
                            <div className="flex items-center justify-center gap-3">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        className="w-14 h-14 text-center text-2xl font-extrabold text-slate-900 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded p-4 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                        maxLength="1"
                                        value={digit}
                                        onChange={(e) => handleInputChange(e.target.value, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                    />
                                ))}
                            </div>
                            <div className="max-w-[260px] mx-auto mt-4">
                                <button
                                    type="submit"
                                    className="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                                >
                                    Verify Account
                                </button>
                            </div>
                        </form>
                        <div className="text-sm text-slate-500 mt-4">
                            Didn't receive code?{" "}
                            <a
                                className="font-medium text-blue-600 hover:text-blue-700"
                                href="#0"
                            >
                                Resend
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default VerifyOTPPage;
