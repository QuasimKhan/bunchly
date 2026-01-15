import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
    LogOut, 
    ChevronLeft,
    Shield,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../ThemeToggle";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { adminNavItems } from "../../constants/adminNav";

const AdminSidebar = ({ sidebarOpen, closeSidebar }) => {
    const location = useLocation();
    const { logout, user } = useAuth();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = () => {
        logout();
        setShowLogoutModal(false);
    };

    return (
        <>
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50
                    w-72 bg-white/80 dark:bg-[#0C0C0E]/80 backdrop-blur-2xl
                    border-r border-neutral-200/60 dark:border-white/5
                    transform transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1)
                    ${sidebarOpen ? "translate-x-0 shadow-2xl shadow-black/5" : "-translate-x-full lg:translate-x-0 lg:shadow-none"}
                    flex flex-col select-none
                `}
            >
                {/* Header */}
                <div className="h-20 flex items-center px-8 border-b border-neutral-200/50 dark:border-white/5 bg-gradient-to-b from-white/50 to-transparent dark:from-white/[0.02] dark:to-transparent">
                    <Link to="/admin" className="flex items-center gap-4 group cursor-pointer" onClick={closeSidebar}>
                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-xl" />
                            <div className="relative w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300 ring-1 ring-white/20">
                                <Shield className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="block flex-1">
                            <img
                                src="/img/Bunchly-light.png"
                                className="w-28 dark:hidden opacity-90 group-hover:opacity-100 transition-opacity"
                                alt="Bunchly"
                            />
                            <img
                                src="/img/Bunchly-dark.png"
                                className="w-28 hidden dark:block opacity-90 group-hover:opacity-100 transition-opacity"
                                alt="Bunchly"
                            />
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto px-4 py-8 space-y-2 scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800 hover:scrollbar-thumb-neutral-300 dark:hover:scrollbar-thumb-neutral-700">
                    <div className="px-4 mb-4 flex items-center gap-3">
                        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-200 dark:via-white/10 to-transparent"></span>
                        <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.2em]">Menu</span>
                        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-200 dark:via-white/10 to-transparent"></span>
                    </div>
                    
                    {adminNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                onClick={closeSidebar}
                                className={`
                                    relative flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 group overflow-hidden
                                    ${isActive 
                                        ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-500/10 shadow-sm ring-1 ring-indigo-500/10 dark:ring-indigo-400/20" 
                                        : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white"
                                    }
                                `}
                            >
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent dark:from-indigo-400/5 pointer-events-none" />
                                )}
                                <Icon 
                                    className={`
                                        w-5 h-5 transition-all duration-300
                                        ${isActive 
                                            ? "text-indigo-600 dark:text-indigo-400 scale-110" 
                                            : "text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 group-hover:scale-105"
                                        }
                                    `} 
                                    strokeWidth={isActive ? 2 : 1.5}
                                />
                                <span className="relative z-10">{item.label}</span>
                                {isActive && (
                                    <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Footer Actions */}
                <div className="p-4 mx-2 mb-2">
                    <div className="p-4 rounded-3xl bg-neutral-50/80 dark:bg-white/5 border border-neutral-100 dark:border-white/5 backdrop-blur-sm space-y-4 shadow-sm">
                         <div className="flex items-center gap-3">
                            <div className="relative">
                                {user?.image ? (
                                    <img 
                                        src={user.image} 
                                        alt="Admin" 
                                        className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-[#15151A] shadow-md"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-indigo-900/40 dark:to-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm ring-2 ring-white dark:ring-[#15151A] shadow-md">
                                        {user?.username?.charAt(0).toUpperCase() || 'A'}
                                    </div>
                                )}
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-[#15151A] shadow-sm" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-bold text-neutral-900 dark:text-white truncate max-w-[120px]">{user?.name || user?.username}</span>
                                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-500/20 px-2 py-0.5 rounded-full w-fit mt-0.5">Admin</span>
                            </div>
                        </div>

                        <div className="h-px bg-neutral-200 dark:bg-white/10" />

                        <div className="flex items-center justify-between gap-2">
                             <Link
                                to="/dashboard"
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-white dark:hover:bg-white/10 hover:text-neutral-900 dark:hover:text-white hover:shadow-sm transition-all border border-transparent hover:border-neutral-200 dark:hover:border-white/10"
                                title="Go to App"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" />
                                <span>App</span>
                            </Link>

                            <div className="w-px h-6 bg-neutral-200 dark:bg-white/10" />

                            <div className="flex items-center gap-1">
                                <div className="hover:bg-white dark:hover:bg-white/10 p-1.5 rounded-xl transition-all cursor-pointer hover:shadow-sm border border-transparent hover:border-neutral-200 dark:hover:border-white/10">
                                    <ThemeToggle />
                                </div>
                                <button 
                                    onClick={() => setShowLogoutModal(true)}
                                    className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-white dark:hover:bg-red-500/10 rounded-xl transition-all cursor-pointer hover:shadow-sm border border-transparent hover:border-red-100 dark:hover:border-red-500/10"
                                    title="Logout"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Logout Modal */}
            <Modal open={showLogoutModal} onClose={() => setShowLogoutModal(false)}>
                <div className="text-center p-2">
                    <div className="w-16 h-16 bg-red-50 dark:bg-red-900/10 rounded-2xl flex items-center justify-center mx-auto mb-6 ring-8 ring-red-50/50 dark:ring-red-900/5">
                        <LogOut className="w-8 h-8 text-red-600 dark:text-red-400" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                        Sign Out
                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8 max-w-[240px] mx-auto leading-relaxed">
                        Are you sure you want to sign out of the Admin Panel? You'll need to log in again to access these features.
                    </p>
                    <div className="flex items-center gap-3">
                        <Button 
                            text="Cancel"
                            variant="secondary"
                            onClick={() => setShowLogoutModal(false)}
                            className="!rounded-xl !py-3 !font-semibold"
                            fullWidth
                        />
                        <Button 
                            text="Sign Out"
                            onClick={handleLogout}
                            className="!bg-red-600 hover:!bg-red-700 text-white border-none shadow-lg shadow-red-500/20 !rounded-xl !py-3 !font-semibold"
                            fullWidth
                        />
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default AdminSidebar;
