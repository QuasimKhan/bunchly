import React from "react";
import { Menu } from "lucide-react";
import ThemeToggle from "../ThemeToggle";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";

const Topbar = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();

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
                <ThemeToggle />

                {/* Avatar */}
                <div
                    className="
                        w-9 h-9 flex items-center justify-center
                        rounded-full bg-indigo-500 text-white
                        font-medium uppercase shadow-md font-serif
                    "
                >
                    {user?.name?.[0] || user?.email?.[0] || "U"}
                </div>

                <Button
                    onClick={logout}
                    className="text-sm bg-red-500 dark:bg-red-800"
                    text="Logout"
                />
            </div>
        </header>
    );
};

export default Topbar;
