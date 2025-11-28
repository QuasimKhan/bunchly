import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import Topbar from "../components/topbar/Topbar";

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="min-h-screen flex overflow-x-hidden bg-[#F5F6FA] dark:bg-[#0F0F14]">
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
            <div className="flex-1 transition-all overflow-x-hidden lg:ml-64">
                <Topbar toggleSidebar={toggleSidebar} />

                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
