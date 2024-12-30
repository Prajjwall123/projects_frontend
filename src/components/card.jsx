import React from "react";
import avatar from '../assets/avatar.png';

const Card = () => {
    return (
        <div className="card bg-white w-96 shadow-xl p-4 rounded-md border border-gray-200">
            <div className="flex items-center mb-4">
                <img
                    src={avatar}
                    alt="Company Logo"
                    className="w-12 h-12 rounded-full"
                />
                <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-800">Technergy Global Pvt. Ltd.</h3>
                </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-2">
                E-Commerce Mobile Application
            </h2>

            <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center border border-gray-300 rounded-full px-3 py-1 text-gray-600 text-sm">

                    Posted Yesterday
                </div>
                <div className="flex items-center border border-gray-300 rounded-full px-3 py-1 text-gray-600 text-sm">

                    4-6 Months
                </div>
            </div>

            <div className="mb-4">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                    Mobile Development
                </span>
            </div>

            <p className="text-gray-700 text-sm mb-4">
                We are looking for a skilled Flutter developer to compile and upload our
                Flutter app to the App Store. The selected candidate will be required...
            </p>

            <hr className="border-gray-300 mb-4" />

            <div className="text-center">
                <button className="bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800">
                    View Details
                </button>
            </div>
        </div>
    );
};

export default Card;
