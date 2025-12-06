import React, { useRef, useState } from "react";
import { Menu } from "lucide-react";
import ThemeToggle from "../ThemeToggle";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";

const Topbar = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = useState(false);

    const menuRef = useRef(null);

    return (
        <header
            className="
                sticky top-0 z-30
                w-full px-6 py-3
                bg-white/10 dark:bg-black/20
                backdrop-blur-xl border-b border-white/10
                flex items-center justify-between
                shadow-sm
            "
        >
            {/* Left side */}
            <div className="flex items-center gap-3">
                {/* Hamburger for mobile */}
                <Button
                    className="
                        lg:hidden p-2 rounded-lg 
                        bg-white/10 dark:bg-white/5 
                        backdrop-blur-md border border-white/10
                    "
                    onClick={toggleSidebar}
                    text={
                        <Menu className="w-6 h-6 text-gray-900 dark:text-gray-100" />
                    }
                />

                <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Dashboard
                </h1>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
                <div className="hidden lg:block">
                    <ThemeToggle />
                </div>

                {/* Avatar */}
                {user && (
                    <div ref={menuRef} className="relative">
                        <div
                            onClick={() => setOpenMenu((p) => !p)}
                            className="cursor-pointer active:scale-95"
                        >
                            {user.image ? (
                                <img
                                    src={user.image}
                                    className="w-10 h-10 rounded-full object-cover border shadow"
                                />
                            ) : (
                                <div
                                    className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 
                                                flex items-center justify-center text-white font-bold uppercase"
                                >
                                    {user?.name?.[0] || user?.email?.[0]}
                                </div>
                            )}
                        </div>

                        {openMenu && (
                            <div
                                className="absolute top-12 right-0 w-48 p-3 bg-white dark:bg-gray-900 
                                            rounded-xl shadow-xl border animate-scaleIn z-50"
                            >
                                <p className="font-semibold">
                                    {user?.name || user?.email}
                                </p>
                                <hr className="my-3 opacity-30" />
                                <div className="flex flex-col gap-2">
                                    <Button
                                        text="Home"
                                        fullWidth
                                        size="sm"
                                        onClick={() => navigate("/")}
                                    />
                                    <Button
                                        text="Logout"
                                        fullWidth
                                        size="sm"
                                        variant="danger"
                                        onClick={logout}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
};

export default Topbar;
