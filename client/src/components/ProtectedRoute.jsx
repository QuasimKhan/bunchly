import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FullScreenLoader from "../components/ui/FullScreenLoader";

const ProtectedRoute = () => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // 1. While loading session (initial /auth/me)
    if (loading) {
        return <FullScreenLoader />;
    }

    // 2. Not logged in → redirect to login with redirect param
    if (!user) {
        const redirectUrl = location.pathname + location.search;
        return (
            <Navigate
                to={`/login?redirect=${encodeURIComponent(redirectUrl)}`}
                replace
            />
        );
    }

    // 3. Logged in → allow access
    return <Outlet />;
};

export default ProtectedRoute;
