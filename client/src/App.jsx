import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard.jsx";
import NotFound from "./pages/NotFound.jsx";
import Navbar from "./components/Navbar.jsx";
import OAuthCallback from "./pages/OAuthCallback.jsx";
import VerifyEmailSent from "./pages/VerifyEmailSent.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";

const App = () => {
    return (
        <>
            <Toaster richColors position="top-center" />

            {/* Routes */}
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/oauth/callback" element={<OAuthCallback />} />

                <Route path="/signup" element={<Signup />} />
                <Route
                    path="/verify-email-sent"
                    element={<VerifyEmailSent />}
                />
                <Route path="/verify" element={<VerifyEmail />} />
                <Route path="/dashboard" element={<Dashboard />} />

                {/* fallback route */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
};

export default App;
