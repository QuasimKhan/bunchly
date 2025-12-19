import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Button from "./ui/Button";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./ui/UserMenu";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);

    const menuRef = useRef(null);

    useEffect(() => {
        const close = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target))
                setOpenMenu(false);
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, []);

    const handleLogin = () => navigate("/login");

    const menuItems = [
        { label: "Profile", action: () => navigate("/profile") },
        { label: "Dashboard", action: () => navigate("/dashboard") },
        { label: "Settings", action: () => navigate("/settings") },
        { label: "Logout", action: logout, variant: "danger" },
    ];

    return (
        <nav
            className="w-[85%] mx-auto backdrop-blur-xl border border-white/20 dark:border-white/10 
                        bg-white/50 dark:bg-black/30 rounded-2xl shadow-lg px-6 py-3 flex justify-between 
                        items-center sticky top-10 z-50"
        >
            {/* LOGO */}
            <Link
                to="/"
                className="flex items-center gap-2 active:scale-95 transition"
            >
                <img
                    src="/img/Bunchly-dark.png"
                    className="h-6 md:h-10 hidden dark:block"
                    alt="logo"
                />
                <img
                    src="/img/Bunchly-light.png"
                    className="h-6 md:h-10 dark:hidden"
                    alt="logo"
                />
            </Link>

            {/* DESKTOP MENU */}
            <ul className="hidden md:flex items-center gap-8 text-sm font-medium">
                <NavItem to="#features" label="Features" />
                <NavItem to="#pricing" label="Pricing" />
                <NavItem to="#preview" label="Preview" />
                <NavItem to="#cta" label="Get Started" />
            </ul>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-3">
                {/* Theme toggle desktop */}
                <div className="hidden md:block">
                    <ThemeToggle />
                </div>

                {!user && <Button text="Join" onClick={handleLogin} />}

                {user && <UserMenu user={user} items={menuItems} />}

                {/* Mobile toggle */}
                {!mobileMenu && (
                    <Menu
                        className="w-7 h-7 md:hidden cursor-pointer"
                        onClick={() => setMobileMenu(true)}
                    />
                )}
                {mobileMenu && (
                    <div>
                        <X
                            className="w-7 h-7 md:hidden cursor-pointer"
                            onClick={() => setMobileMenu(false)}
                        />

                        <div
                            className="absolute right-4 top-[72px] w-48 bg-white dark:bg-gray-900 p-6 rounded-xl 
                                        shadow-2xl flex flex-col items-center gap-4 animate-scaleIn border"
                        >
                            <NavItem to="/features" label="Features" />
                            <NavItem to="/pricing" label="Pricing" />
                            <NavItem to="/templates" label="Templates" />
                            <NavItem to="/support" label="Support" />
                            <ThemeToggle />
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

const NavItem = ({ to, label, onClick }) => {
    const handleClick = (e) => {
        if (to.startsWith("#")) {
            e.preventDefault(); // 🔴 critical
            const target = document.querySelector(to);

            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        }

        onClick?.();
    };

    return (
        <a
            href={to}
            onClick={handleClick}
            className="hover:text-indigo-500 dark:hover:text-indigo-400 font-medium transition"
        >
            {label}
        </a>
    );
};

export default Navbar;
