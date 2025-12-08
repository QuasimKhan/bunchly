import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard.jsx";
import NotFound from "./pages/NotFound.jsx";
import OAuthCallback from "./pages/OAuthCallback.jsx";
import VerifyEmailSent from "./pages/VerifyEmailSent.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import GuestRoute from "./components/GuestRoute.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import Links from "./pages/Links.jsx";
import PublicProfilePage from "./pages/PublicProfilePage.jsx";
import Profile from "./pages/Profile.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import SettingsDashboard from "./pages/SettingsDashboard.jsx";

const App = () => {
    const { user } = useAuth();
    return (
        <>
            <Toaster richColors position="top-center" />

            <Routes>
                {/* Public Route (open for all like Linktree) */}
                <Route path="/" element={<Home />} />
                <Route path="/u/:username" element={<PublicProfilePage />} />

                {/* Guest-only Routes (user must be logged OUT) */}
                <Route element={<GuestRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route
                        path="/verify-email-sent"
                        element={<VerifyEmailSent />}
                    />
                    <Route path="/verify" element={<VerifyEmail />} />
                    <Route path="/oauth/callback" element={<OAuthCallback />} />
                </Route>

                {/* Protected Routes (user must be logged IN) */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<DashboardLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/links" element={<Links />} />
                        <Route
                            path="/profile"
                            element={<Profile user={user} />}
                        />
                        <Route
                            path="/settings"
                            element={<SettingsDashboard user={user} />}
                        />

                        {/* Later add: Links, Appearance, Analytics, Settings */}
                    </Route>
                </Route>

                {/* Fallback route */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
};

export default App;
