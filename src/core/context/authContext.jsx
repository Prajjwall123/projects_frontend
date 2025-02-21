import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            console.log("AuthContext: User logged in:", storedUser);
        }
    }, []);

    const login = (userData) => {
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", userData.token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
    };

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
        <AuthContext.Provider value={{ user, login, logout, isLoggedIn, isAdmin, getUserRole }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
