// AuthProvider -  JWT context: store user, token, login/logout
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const admin = JSON.parse(localStorage.getItem("admin"));
        if (token && admin) {
            setAdmin(admin);
        }
    }, []);

    const login = (admin, token) => {
        localStorage.setItem("token", token);
        localStorage.setItem("admin", JSON.stringify(admin));
        setAdmin(admin);
    }

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("admin");
        setAdmin(null);
    }

    return (
        <AuthContext.Provider value={{ admin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);