import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/sidebar/AdminSidebar";
import Topbar from "../components/topbar/Topbar"; // Reuse Topbar for mobile toggle

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="min-h-screen flex overflow-x-hidden bg-[#F5F6FA] dark:bg-[#0F0F14]">
            <AdminSidebar sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                    onClick={closeSidebar}
                />
            )}

            <div className="flex-1 transition-all duration-300 overflow-x-hidden lg:ml-72 flex flex-col">
                <Topbar toggleSidebar={toggleSidebar} />
                <main className="p-6 flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
