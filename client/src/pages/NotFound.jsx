import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function NotFound() {
    return (
        <div
            className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden bg-gradient-to-br from-[#f8f9ff] via-[#f3f4fa] to-[#eef0ff] 
            dark:from-[#0b0d14] dark:via-[#0b0d18] dark:to-[#11121c]"
        >
            {/* Floating Bunchly Blobs */}
            <div className="absolute -top-20 -right-10 w-72 h-72 bg-[#7a5cff]/20 dark:bg-[#7a5cff]/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 -left-10 w-96 h-96 bg-[#4d8cff]/20 dark:bg-[#4d8cff]/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/2 -left-20 w-64 h-64 bg-[#b57bff]/20 dark:bg-[#b57bff]/10 rounded-full blur-3xl"></div>

            {/* Glass Card */}
            <div
                className="relative z-10 backdrop-blur-xl bg-white/30 dark:bg-white/5 
                border border-white/40 dark:border-white/10 shadow-2xl 
                rounded-3xl p-12 max-w-lg w-full text-center"
            >
                {/* Bunchly Logo */}
                <img
                    src="/img/Bunchly-dark.png"
                    alt="Bunchly Logo"
                    className="w-36 mx-auto mb-6 drop-shadow-sm"
                />

                {/* Header */}
                <h1 className="text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
                    Page Not Found
                </h1>

                {/* Subtext */}
                <p className="mt-4 text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                    This Bunchly page may have been removed or never existed.
                    Check the link or return to the homepage.
                </p>

                {/* Buttons */}
                <div className="mt-10 flex flex-col gap-4">
                    {/* Primary CTA */}
                    <Link
                        to="/"
                        className="px-6 py-3 rounded-xl font-medium text-white shadow-lg
                        bg-gradient-to-r from-[#4d8cff] to-[#7a5cff]
                        hover:shadow-xl hover:from-[#638fff] hover:to-[#8b6dff] transition-all duration-300"
                    >
                        Go Back Home
                    </Link>

                    {/* Secondary CTA */}
                    <Link
                        to="/contact"
                        className="px-6 py-3 rounded-xl font-medium border 
                        border-white/40 dark:border-white/10
                        text-gray-700 dark:text-gray-300
                        backdrop-blur-md bg-white/40 dark:bg-white/5 
                        hover:bg-white/50 dark:hover:bg-white/10 
                        transition-all"
                    >
                        Contact Support
                    </Link>
                </div>

                <p className="mt-6 text-xs text-gray-500 dark:text-gray-600">
                    Bunchly © {new Date().getFullYear()}
                </p>
            </div>
        </div>
    );
}
