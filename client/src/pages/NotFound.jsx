import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div
            className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden
            bg-gradient-to-br 
            from-[#f5f7ff] via-[#eef1ff] to-[#e9ecff]
            dark:from-[#0b0d14] dark:via-[#0b0d18] dark:to-[#11121c]"
        >
            {/* Ambient Blobs */}
            <div className="absolute -top-24 -right-16 w-80 h-80 bg-[#7a5cff]/20 dark:bg-[#7a5cff]/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 -left-20 w-96 h-96 bg-[#4d8cff]/20 dark:bg-[#4d8cff]/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 -left-24 w-72 h-72 bg-[#b57bff]/20 dark:bg-[#b57bff]/10 rounded-full blur-3xl"></div>

            {/* Glass Card */}
            <div
                className="relative z-10 w-full max-w-lg rounded-3xl p-12 text-center
                backdrop-blur-2xl
                bg-white/70 dark:bg-white/5
                border border-black/5 dark:border-white/10
                shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)]
                dark:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
            >
                {/* Logo */}
                <img
                    src="/img/Bunchly-dark.png"
                    alt="Bunchly Logo"
                    className="w-36 mx-auto mb-6"
                />

                {/* Title */}
                <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Page Not Found
                </h1>

                {/* Description */}
                <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-400">
                    This Bunchly page may have been removed or never existed.
                    Please check the link or return to the homepage.
                </p>

                {/* Actions */}
                <div className="mt-10 flex flex-col gap-4">
                    <Link
                        to="/"
                        className="px-6 py-3 rounded-xl font-medium text-white
                        bg-gradient-to-r from-[#4d8cff] to-[#7a5cff]
                        shadow-lg hover:shadow-xl
                        hover:from-[#638fff] hover:to-[#8b6dff]
                        transition-all duration-300"
                    >
                        Go Back Home
                    </Link>

                    <Link
                        to="/contact"
                        className="px-6 py-3 rounded-xl font-medium
                        border border-black/10 dark:border-white/10
                        text-gray-700 dark:text-gray-300
                        bg-white/60 dark:bg-white/5
                        hover:bg-white/80 dark:hover:bg-white/10
                        backdrop-blur-md transition-all"
                    >
                        Contact Support
                    </Link>
                </div>

                {/* Footer */}
                <p className="mt-6 text-xs text-gray-500 dark:text-gray-600">
                    Bunchly © {new Date().getFullYear()}
                </p>
            </div>
        </div>
    );
}
