import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
    LayoutDashboard, 
    Users, 
    Settings, 
    LogOut, 
    ChevronLeft,
    Shield,
    DollarSign,
    Banknote,
    Tag,
    Megaphone
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../ThemeToggle";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

const AdminSidebar = ({ sidebarOpen, closeSidebar }) => {
    const location = useLocation();
    const { logout, user } = useAuth();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = () => {
        logout();
        setShowLogoutModal(false);
    };

    const navItems = [
        { label: "Overview", href: "/admin", icon: LayoutDashboard },
        { label: "Revenue", href: "/admin/revenue", icon: Banknote },
        { label: "User Management", href: "/admin/users", icon: Users },
        { label: "Payments", href: "/admin/payments", icon: DollarSign },
        { label: "Coupons", href: "/admin/coupons", icon: Tag },
        { label: "Marketing", href: "/admin/marketing", icon: Megaphone },
    ];

    return (
        <>
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50
                    w-64 bg-white/90 dark:bg-[#0C0C0E]/90 backdrop-blur-xl
                    border-r border-neutral-200 dark:border-white/10
                    transform transition-all duration-300 ease-out
                    ${sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0 lg:shadow-none"}
                    flex flex-col
                `}
            >
                {/* Header */}
                <div className="h-16 flex items-center px-6 border-b border-neutral-200/50 dark:border-white/5">
                    <Link to="/admin" className="flex items-center gap-3 group cursor-pointer" onClick={closeSidebar}>
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div className="block">
                            <img
                                src="/img/Bunchly-light.png"
                                className="w-24 dark:hidden"
                                alt="Bunchly"
                            />
                            <img
                                src="/img/Bunchly-dark.png"
                                className="w-24 hidden dark:block"
                                alt="Bunchly"
                            />
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800">
                    <div className="px-2 mb-2 text-xs font-semibold text-neutral-400 uppercase tracking-widest">Dashboards</div>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                onClick={closeSidebar}
                                className={`
                                    flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group cursor-pointer
                                    ${isActive 
                                        ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 shadow-sm ring-1 ring-indigo-500/20" 
                                        : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white"
                                    }
                                `}
                            >
                                <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300"}`} />
                                {item.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-neutral-200/50 dark:border-white/5 space-y-3 bg-neutral-50/50 dark:bg-white/5 mx-2 mb-2 rounded-2xl">
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:bg-white dark:hover:bg-white/10 hover:shadow-sm transition-all cursor-pointer"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Return to App
                    </Link>
                    
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-3 overflow-hidden">
                            {user?.image ? (
                                <img 
                                    src={user.image} 
                                    alt="Admin" 
                                    className="w-9 h-9 rounded-full object-cover ring-2 ring-white dark:ring-[#15151A]"
                                />
                            ) : (
                                <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm ring-2 ring-white dark:ring-[#15151A]">
                                    {user?.username?.charAt(0).toUpperCase() || 'A'}
                                </div>
                            )}
                            <div className="flex flex-col min-w-0">
                                <span className="text-xs font-bold text-neutral-900 dark:text-white truncate max-w-[80px] sm:max-w-[100px]">{user?.name || user?.username}</span>
                                <span className="text-[10px] text-neutral-500 truncate">Administrator</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <ThemeToggle />
                            <button 
                                onClick={() => setShowLogoutModal(true)}
                                className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors cursor-pointer"
                                title="Logout"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
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
                        Are you sure you want to sign out of the Admin Panel?
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

export default AdminSidebar;
