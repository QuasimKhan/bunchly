import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import Topbar from "../components/topbar/Topbar";
import { useAuth } from "../context/AuthContext";
import UpgradeModal from "../components/dashboard/UpgradeModal";
import ExpirationBanner from "../components/dashboard/ExpirationBanner";

const DashboardLayout = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    // Popup States
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [daysToExpiry, setDaysToExpiry] = useState(null);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    useEffect(() => {
        if (!user) return;

        // Upgrade Modal Logic (Free Users)
        if (user.plan === "free") {
            // Check if already shown in this session
            const hasSeenModal = sessionStorage.getItem("hasSeenUpgradeModal");
            
            // Show modal if not seen yet
            if (!hasSeenModal) {
                // Small delay for better UX
                const timer = setTimeout(() => {
                    setShowUpgradeModal(true);
                    sessionStorage.setItem("hasSeenUpgradeModal", "true");
                }, 2000);
                return () => clearTimeout(timer);
            }
        }

        // Expiration Logic (Pro Users)
        if (user.plan === "pro" && user.planExpiresAt) {
            const expiryDate = new Date(user.planExpiresAt);
            const today = new Date();
            const timeDiff = expiryDate - today;
            const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

            if (daysLeft <= 7 && daysLeft >= 0) {
                setDaysToExpiry(daysLeft);
            }
        }

    }, [user, location.pathname]); // Re-check on route change if needed? Actually session check prevents spam.

    return (
        <div className="min-h-screen flex overflow-x-hidden bg-[#F5F6FA] dark:bg-[#0F0F14]">
            {/* Alerts & Modals */}
            <UpgradeModal 
                isOpen={showUpgradeModal} 
                onClose={() => setShowUpgradeModal(false)} 
            />

            {/* Sidebar (mobile + desktop) */}
            <Sidebar sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />

            {/* Dark Overlay when mobile sidebar is open */}
            {sidebarOpen && (
                <div
                    className="
                        fixed inset-0 z-40 
                        bg-black/50 backdrop-blur-sm 
                        lg:hidden
                    "
                    onClick={closeSidebar}
                />
            )}

            {/* Main Content Area */}
            <div className="flex-1 transition-all overflow-x-hidden lg:ml-64 flex flex-col">
                {/* Expiration Banner shows at the very top of content area or above topbar? 
                    Usually above Topbar is best for visibility. 
                */}
                {daysToExpiry !== null && (
                    <ExpirationBanner daysRemaining={daysToExpiry} />
                )}

                <Topbar toggleSidebar={toggleSidebar} />

                <main className="flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
