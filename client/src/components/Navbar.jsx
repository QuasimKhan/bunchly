import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Button from "./ui/Button";
import ThemeToggle from "./ThemeToggle";

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
                <NavItem to="/features" label="Features" />
                <NavItem to="/pricing" label="Pricing" />
                <NavItem to="/templates" label="Templates" />
                <NavItem to="/support" label="Support" />
            </ul>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-3">
                {/* Theme toggle desktop */}
                <div className="hidden md:block">
                    <ThemeToggle />
                </div>

                {!user && <Button text="Join" onClick={handleLogin} />}

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
                                        text="Dashboard"
                                        fullWidth
                                        size="sm"
                                        onClick={() => navigate("/dashboard")}
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

const NavItem = ({ to, label }) => (
    <Link
        to={to}
        className="hover:text-indigo-500 dark:hover:text-indigo-400 font-medium transition"
    >
        {label}
    </Link>
);

export default Navbar;
