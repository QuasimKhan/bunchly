import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api.js";
import FullScreenLoader from "../components/ui/FullScreenLoader.jsx";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authLoading, setAuthLoading] = useState(false);

    // Fetch logged-in user
    const fetchMe = async () => {
        try {
            const res = await api.get("/api/auth/me");
            setUser(res.data?.user ?? null);
        } catch (error) {
            if (error?.response?.status === 401) setUser(null);
            else setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // Helper: normalize backend error to object {message, unverified, status}
    const normalizeError = (error) => {
        const res = error?.response;
        return {
            message:
                res?.data?.message || error?.message || "Something went wrong",
            unverified: res?.data?.unverified || false,
            status: res?.status || 500,
        };
    };

    // Signup
    const signup = async (name, email, password) => {
        try {
            setAuthLoading(true);
            const res = await api.post("/api/auth/signup", {
                name,
                email,
                password,
            });
            return res.data;
        } catch (error) {
            throw normalizeError(error);
        } finally {
            setAuthLoading(false);
        }
    };

    // Login
    const login = async (email, password) => {
        try {
            setAuthLoading(true);
            const res = await api.post("/api/auth/login", {
                email,
                password,
            });
            // fetch user after successful login
            await fetchMe();
            return res.data;
        } catch (error) {
            throw normalizeError(error);
        } finally {
            setAuthLoading(false);
        }
    };

    // Resend verification
    const resendVerification = async (email) => {
        try {
            setAuthLoading(true);
            const res = await api.post("/api/auth/resend-verification", {
                email,
            });
            return res.data?.message;
        } catch (error) {
            throw normalizeError(error);
        } finally {
            setAuthLoading(false);
        }
    };

    const logout = async () => {
        try {
            await api.post("/api/auth/logout");
            setUser(null);
        } catch (err) {
            // ignore
            setUser(null);
        }
    };

    useEffect(() => {
        fetchMe();
    }, []);

    if (loading) return <FullScreenLoader />;

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
