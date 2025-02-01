import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOTP } from "../utils/authHelpers";
import Logo from '../../assets/black-logo.png';

const VerifyOTPPage = () => {
    const [otp, setOTP] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (!location.state?.email) {
            navigate("/register");
        }
    }, [location.state?.email, navigate]);


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
            await verifyOTP(payload, navigate);
            navigate("/login");
        } catch (err) {
            setError(err.message || "OTP verification failed");
        }
    };

    return (
        <main className="bg-base-200 font-[sans-serif] relative min-h-screen flex flex-col justify-center items-center overflow-hidden">
            <div className="w-full max-w-12xl mx-auto px-4 md:px-6 py-24">
                <div className="flex flex-col justify-center items-center">

                    {/* Logo */}
                    <header className="mb-8">
                        <img src={Logo} alt="logo" className="w-80 mb-4 mx-auto block" />
                    </header>

                    {/* Stepper (Outside the widget) */}
                    <ol className="items-center w-full flex justify-center space-x-8 sm:space-y-0 mb-6">
                        {/* Step 1: Account Info (Inactive) */}
                        <li className="flex items-center text-gray-500 dark:text-gray-400 space-x-2.5 rtl:space-x-reverse">
                            <span className="flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
                                1
                            </span>
                            <span>
                                <h3 className="font-medium leading-tight">Account Info</h3>
                            </span>
                        </li>

                        {/* Step 2: Profile Info (Inactive) */}
                        <li className="flex items-center text-gray-500 dark:text-gray-400 space-x-2.5 rtl:space-x-reverse">
                            <span className="flex items-center justify-center w-8 h-8 border border-gray-500 rounded-full shrink-0 dark:border-gray-400">
                                2
                            </span>
                            <span>
                                <h3 className="font-medium leading-tight">Profile Info</h3>
                            </span>
                        </li>

                        {/* Step 3: OTP Verification (Active) */}
                        <li className="flex items-center text-xl text-blue-600 dark:text-blue-500 space-x-2.5 rtl:space-x-reverse">
                            <span className="flex items-center justify-center w-8 h-8 border border-blue-600 rounded-full shrink-0 dark:border-blue-500">
                                3
                            </span>
                            <span>
                                <h3 className="font-medium leading-tight">OTP Verification</h3>
                            </span>
                        </li>
                    </ol>

                    <div className="max-w-md mx-auto text-center bg-white px-4 sm:px-8 py-10 rounded-xl shadow">
                        {/* Header with OTP instructions */}
                        <header className="mb-8">
                            <h1 className="text-2xl font-bold mb-1">Email Address Verification</h1>
                            <p className="text-[15px] text-slate-500">
                                Enter the 6-digit verification code that was sent to your email address.
                            </p>
                        </header>

                        {/* OTP Form */}
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
                                    className="btn bg-black text-white hover:text-black w-full "
                                >
                                    Verify Account
                                </button>
                            </div>
                        </form>

                        {/* Resend OTP link */}
                        <div className="text-sm text-slate-500 mt-4">
                            Didn't receive the code?{" "}
                            <a className="font-medium text-blue-600 hover:text-blue-700" href="#0">
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
