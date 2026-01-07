import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
    LayoutDashboard, 
    Users, 
    Settings, 
    LogOut, 
    ChevronLeft,
    Shield,
    DollarSign
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../ThemeToggle";

const AdminSidebar = ({ sidebarOpen, closeSidebar }) => {
    const location = useLocation();
    const { logout } = useAuth();

    const navItems = [
        {
            label: "Overview",
            href: "/admin",
            icon: LayoutDashboard,
        },
        {
            label: "User Management",
            href: "/admin/users",
            icon: Users,
        },
        {
            label: "Payments",
            href: "/admin/payments",
            icon: DollarSign,
        },
    ];

    return (
        <aside
            className={`
                fixed inset-y-0 left-0 z-50
                w-64 bg-white dark:bg-[#15151A] 
                border-r border-neutral-200 dark:border-white/5
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                flex flex-col
            `}
        >
            {/* Header */}
            <div className="h-16 flex items-center px-6 border-b border-neutral-200 dark:border-white/5">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xl">
                    <Shield className="w-6 h-6" />
                    <span>Admin Panel</span>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            to={item.href}
                            onClick={closeSidebar}
                            className={`
                                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                                ${isActive 
                                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400" 
                                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-white/5"
                                }
                            `}
                        >
                            <Icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-neutral-200 dark:border-white/5 space-y-2">
                <Link
                    to="/dashboard"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-white/5 transition-all"
                >
                    <ChevronLeft className="w-5 h-5" />
                    Back to App
                </Link>
                
                <div className="flex items-center justify-between px-3 pt-2">
                    <ThemeToggle />
                    <button 
                        onClick={logout}
                        className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default AdminSidebar;
