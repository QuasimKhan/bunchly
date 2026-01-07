import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { navItems } from "../../constants/navItems";
import ThemeToggle from "../ThemeToggle";
import { useAuth } from "../../context/AuthContext";
import { LogOut, User as UserIcon, Zap } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

const Sidebar = ({ sidebarOpen, closeSidebar }) => {
    const location = useLocation();
    const { user, logout } = useAuth();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = () => {
        logout();
        setShowLogoutModal(false);
    };

    return (
        <>
            <aside
                className={`
                    fixed top-0 left-0 z-50
                    h-screen w-0 lg:w-64
                    bg-white dark:bg-[#0F0F14]
                    border-r border-neutral-200 dark:border-white/5
                    flex flex-col
                    transition-all duration-300
                    ${sidebarOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full lg:translate-x-0 lg:w-64"}
                    overflow-hidden
                `}
            >
                {/* 1. Header / Logo */}
                <div className="h-20 flex items-center px-6 shrink-0 border-b border-neutral-100 dark:border-white/5">
                    <Link to={"/"} className="block">
                        <img
                            src="/img/Bunchly-light.png"
                            className="w-28 dark:hidden"
                            alt="Bunchly"
                        />
                        <img
                            src="/img/Bunchly-dark.png"
                            className="w-28 hidden dark:block"
                            alt="Bunchly"
                        />
                    </Link>
                </div>

                {/* 2. Navigation Items */}
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.href}
                                to={item.href}
                                onClick={closeSidebar}
                                className={`
                                    group flex items-center gap-3 px-3.5 py-2.5 rounded-xl
                                    transition-all duration-200 font-medium text-sm
                                    ${
                                        isActive
                                            ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/10 dark:text-indigo-400"
                                            : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-white/5 dark:hover:text-neutral-200"
                                    }
                                `}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-neutral-400 group-hover:text-neutral-600 dark:text-neutral-500 dark:group-hover:text-neutral-300"}`} />
                                {item.label}
                            </NavLink>
                        );
                    })}
                </div>

                {/* 3. Pro Upsell (if free) */}
                {user?.plan === "free" && (
                    <div className="px-4 pb-4">
                        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-4 text-white shadow-lg shadow-indigo-500/20">
                            <div className="flex items-start justify-between mb-3">
                                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                    <Zap className="w-5 h-5 text-white" fill="currentColor" />
                                </div>
                            </div>
                            <h4 className="font-bold text-sm mb-1">Upgrade to Pro</h4>
                            <p className="text-xs text-indigo-100 mb-3 leading-relaxed">
                                Unlock analytics, themes, and unlimited links.
                            </p>
                            <Link 
                                to="/dashboard/upgrade"
                                onClick={closeSidebar}
                                className="block w-full py-2 bg-white text-indigo-600 text-xs font-bold text-center rounded-lg hover:bg-indigo-50 transition-colors"
                            >
                                Upgrade Plan
                            </Link>
                        </div>
                    </div>
                )}

                {/* 4. User Section */}
                <div className="p-4 border-t border-neutral-200 dark:border-white/5 bg-neutral-50/50 dark:bg-white/[0.02]">
                    <Link 
                        to="/dashboard/profile" 
                        onClick={closeSidebar}
                        className="flex items-center gap-3 p-2 rounded-xl border border-transparent hover:border-neutral-200 dark:hover:border-white/10 hover:bg-white dark:hover:bg-white/5 transition-all group cursor-pointer relative"
                    >
                        {/* User Avatar */}
                        {user?.image ? (
                            <img 
                                src={user.image} 
                                alt="User" 
                                className="w-9 h-9 rounded-full object-cover ring-2 ring-white dark:ring-neutral-800"
                            />
                        ) : (
                            <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm ring-2 ring-white dark:ring-neutral-800">
                                {user?.username?.charAt(0).toUpperCase()}
                            </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                                {user?.username}
                            </p>
                            <p className="text-xs text-neutral-500 font-medium truncate">
                                {user?.email}
                            </p>
                        </div>
                    </Link>

                    <div className="flex items-center justify-between gap-1 mt-2">
                        <ThemeToggle className="w-full justify-center bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 h-9 rounded-lg" />
                         <button
                            onClick={() => setShowLogoutModal(true)}
                            className="flex-1 flex items-center justify-center gap-2 h-9 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 border border-red-100 dark:border-red-900/20 rounded-lg transition-colors"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Logout Modal */}
            <Modal open={showLogoutModal} onClose={() => setShowLogoutModal(false)}>
                <div className="text-center">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 dark:text-red-400">
                        <LogOut className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                        Sign Out
                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
                        Are you sure you want to sign out of your account?
                    </p>
                    <div className="flex items-center gap-3">
                        <Button 
                            text="Cancel"
                            variant="secondary"
                            onClick={() => setShowLogoutModal(false)}
                            fullWidth
                        />
                        <Button 
                            text="Sign Out"
                            onClick={handleLogout}
                            className="!bg-red-600 hover:!bg-red-700 text-white border-none shadow-lg shadow-red-500/20"
                            fullWidth
                        />
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default Sidebar;
