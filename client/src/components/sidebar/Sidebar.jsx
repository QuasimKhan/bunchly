import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { navItems } from "../../constants/navItems";
import ThemeToggle from "../ThemeToggle";

const Sidebar = ({ sidebarOpen, closeSidebar }) => {
    const location = useLocation();

    return (
        <aside
            className={`
                fixed top-0 left-0 z-50
                h-screen w-64 
                bg-white/10 dark:bg-black/20
                backdrop-blur-xl border-r border-white/10
                flex flex-col py-6 px-4
                transition-transform duration-300

                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                lg:translate-x-0
            `}
        >
            {/* Logo (desktop + mobile) */}
            <Link to={"/"} className="flex items-center justify-center mb-10">
                <img
                    src="/img/Bunchly-light.png"
                    className="w-40 dark:hidden"
                    alt="Bunchly"
                />
                <img
                    src="/img/Bunchly-dark.png"
                    className="w-40 hidden dark:block"
                    alt="Bunchly"
                />
            </Link>

            {/* Navigation */}
            <nav className="flex flex-col gap-2">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.href}
                            to={item.href}
                            onClick={closeSidebar}
                            className="
                                relative flex items-center gap-3 px-4 py-2
                                rounded-xl text-gray-800 dark:text-gray-200
                                hover:bg-white/20 dark:hover:bg-white/10
                                transition-all duration-300
                            "
                        >
                            {/* Glowing active background */}
                            {isActive && (
                                <div
                                    className="
                                        absolute inset-0 bg-indigo-500/20
                                        dark:bg-indigo-400/20
                                        rounded-xl blur-[2px]
                                        ring-1 ring-indigo-500/30
                                        animate-pulse
                                    "
                                ></div>
                            )}

                            <Icon className="w-5 h-5 relative z-10" />
                            <span className="relative z-10 font-medium">
                                {item.label}
                            </span>
                        </NavLink>
                    );
                })}
                <div className="mx-auto lg:hidden">
                    <ThemeToggle />
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;
