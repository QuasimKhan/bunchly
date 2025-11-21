import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchMe = async () => {
        try {
            const res = await api.get("/api/auth/me");
            setUser(res.data?.user);
        } catch (error) {
            if (error.response?.status === 401) {
                setUser(null);
                return;
            }
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        await api.post("/api/auth/login", { email, password });
        await fetchMe(); // important
    };

    const logout = async () => {
        await api.post("/api/auth/logout");
        setUser(null);
    };

    useEffect(() => {
        fetchMe();
    }, []);

    if (loading) return <div className="text-center py-8">Loading...</div>;

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
