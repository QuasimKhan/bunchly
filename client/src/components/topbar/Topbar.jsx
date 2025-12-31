import { Menu } from "lucide-react";
import ThemeToggle from "../ThemeToggle";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";
import UserMenu from "../ui/UserMenu";

const Topbar = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const menuItems = [
        { label: "Home", action: () => navigate("/") },
        { label: "Profile", action: () => navigate("/dashboard/profile") },
        { label: "Settings", action: () => navigate("/dashboard/settings") },
        { label: "Logout", action: logout, variant: "danger" },
    ];

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

                {/* User Menu */}

                {user && <UserMenu user={user} items={menuItems} />}
            </div>
        </header>
    );
};

export default Topbar;
