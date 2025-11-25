import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FullScreenLoader from "../components/ui/FullScreenLoader";

const GuestRoute = () => {
    const { user, loading } = useAuth();

    // While checking session
    if (loading) {
        return <FullScreenLoader />;
    }

    // Already logged in → send to dashboard (ignore redirect param)
    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    // User is NOT logged in → allow guest pages (login/signup)
    return <Outlet />;
};

export default GuestRoute;
