import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
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
import Analytics from "./pages/Analytics.jsx";
import Upgrade from "./pages/Upgrade.jsx";
import Billing from "./pages/Billing.jsx";
import Checkout from "./pages/Checkout.jsx";
import { useCookieConsent } from "./hooks/useCookieConsent.js";
import { loadAnalytics } from "./lib/analytics.js";
import ConsentBanner from "./components/ConsentBanner.jsx";
import Policy from "./pages/Policy.jsx";
import Contact from "./pages/Contact.jsx";
import AdminRoute from "./components/auth/AdminRoute.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import AdminRevenue from "./pages/admin/AdminRevenue";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminUserDetail from "./pages/admin/AdminUserDetail.jsx";
import AdminCoupons from "./pages/admin/AdminCoupons.jsx";
import Appearance from "./pages/Appearance.jsx";
import AdminPayments from "./pages/admin/AdminPayments.jsx";
import AdminMarketing from "./pages/admin/AdminMarketing.jsx";
import AdminFeedback from "./pages/admin/AdminFeedback.jsx";
import AdminRefunds from "./pages/admin/AdminRefunds.jsx";
import AdminReports from "./pages/admin/AdminReports.jsx";
import AdminAnalytics from "./pages/admin/AdminAnalytics.jsx";

const App = () => {
    const { user } = useAuth();
    const { consent } = useCookieConsent();

    useEffect(() => {
        if (consent === "accepted") {
            loadAnalytics();
        }
    }, [consent]);
    return (
        <>
            <ConsentBanner />
            <Toaster richColors position="top-center" />

            <Routes>
                {/* Public Route (open for all like Linktree) */}
                <Route path="/" element={<Home />} />
                <Route path="/:username" element={<PublicProfilePage />} />
                <Route path="/policy" element={<Policy />} />
                <Route path="/privacy" element={<Policy />} />
                <Route path="/terms" element={<Policy />} />
                <Route path="/refund-policy" element={<Policy />} />
                <Route path="/contact" element={<Contact />} />


                {/* Guest-only Routes (user must be logged OUT) */}
                <Route element={<GuestRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
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
                        <Route
                            path="/dashboard/upgrade"
                            element={<Upgrade />}
                        />
                        <Route
                            path="/dashboard/checkout"
                            element={<Checkout />}
                        />

                        <Route path="/dashboard/links" element={<Links />} />
                        <Route
                            path="/dashboard/appearance"
                            element={<Appearance />}
                        />
                        <Route
                            path="/dashboard/profile"
                            element={<Profile user={user} />}
                        />
                        <Route
                            path="/dashboard/analytics"
                            element={<Analytics />}
                        />
                        <Route
                            path="/dashboard/billing"
                            element={<Billing />}
                        />

                        <Route
                            path="/dashboard/settings"
                            element={<SettingsDashboard user={user} />}
                        />
                    </Route>

                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminRoute />}>
                    <Route element={<AdminLayout />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="revenue" element={<AdminRevenue />} />
                        <Route path="users" element={<AdminUsers />} />
                        <Route path="users/:id" element={<AdminUserDetail />} />
                        <Route path="payments" element={<AdminPayments />} />
                        <Route path="refunds" element={<AdminRefunds />} />
                        <Route path="coupons" element={<AdminCoupons />} />
                        <Route path="marketing" element={<AdminMarketing />} />
                        <Route path="feedback" element={<AdminFeedback />} />
                        <Route path="reports" element={<AdminReports />} />
                        <Route path="analytics" element={<AdminAnalytics />} />
                    </Route>
                </Route>
                </Route>

                {/* Fallback route */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
};

export default App;
