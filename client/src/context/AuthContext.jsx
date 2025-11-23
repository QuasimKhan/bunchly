import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Me loader
    const [authLoading, setAuthLoading] = useState(false); // Button loader

    // -------- FETCH LOGGED IN USER --------
    const fetchMe = async () => {
        try {
            const res = await api.get("/api/auth/me");
            setUser(res.data?.user);
        } catch (error) {
            if (error.response?.status === 401) setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // -------- SIGNUP --------
    const signup = async (name, email, password) => {
        try {
            setAuthLoading(true);

            const res = await api.post("/api/auth/signup", {
                name,
                email,
                password,
            });

            return res.data; // important for success handling
        } catch (error) {
            // return complete metadata
            throw {
                message: error?.response?.data?.message || "Signup failed",
                unverified: error?.response?.data?.unverified || false,
                status: error?.response?.status || 400,
            };
        } finally {
            setAuthLoading(false);
        }
    };

    // -------- LOGIN --------
    const login = async (email, password) => {
        try {
            setAuthLoading(true);

            const res = await api.post("/api/auth/login", { email, password });

            await fetchMe();

            return res.data;
        } catch (error) {
            throw {
                message: error?.response?.data?.message || "Login failed",
                unverified: error?.response?.data?.unverified || false,
                status: error?.response?.status || 400,
            };
        } finally {
            setAuthLoading(false);
        }
    };

    // -------- RESEND VERIFICATION --------
    const resendVerification = async (email) => {
        try {
            setAuthLoading(true);
            const res = await api.post("/api/auth/resend-verification", {
                email,
            });
            return res.data?.message;
        } catch (error) {
            throw {
                message:
                    error?.response?.data?.message ||
                    "Failed to resend verification",
                status: error?.response?.status || 400,
            };
        } finally {
            setAuthLoading(false);
        }
    };

    // -------- LOGOUT --------
    const logout = async () => {
        await api.post("/api/auth/logout");
        setUser(null);
    };

    useEffect(() => {
        fetchMe();
    }, []);

    if (loading)
        return (
            <div className="text-center py-8">
                <span className="loading loading-ball loading-xs"></span>
            </div>
        );

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                authLoading,
                signup,
                login,
                resendVerification,
                logout,
                fetchMe,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
