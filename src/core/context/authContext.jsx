import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        const userId = localStorage.getItem("userId");

        if (token && role && userId) {
            const storedUser = { token, role, userId };
            setUser(storedUser);
            console.log("AuthContext: User logged in:", storedUser);
        }
    }, []);

    const isLoggedIn = () => {
        return user !== null;
    };

    const isAdmin = () => {
        return user?.role === "company";
    };

    const getUserRole = () => {
        return user?.role || "freelancer";
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, isAdmin, getUserRole }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
