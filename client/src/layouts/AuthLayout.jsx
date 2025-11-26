import ThemeToggle from "../components/ThemeToggle";

//it is not using at the time but we will use it in future may be

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen grid lg:grid-cols-2 relative">
            {/* Theme Toggle */}
            <div className="absolute top-4 right-4 z-50">
                <ThemeToggle />
            </div>

            {/* LEFT BRANDING PANEL */}
            <div
                className="hidden lg:flex flex-col justify-between relative 
                bg-[#0F0F14] dark:bg-black px-12 py-16 overflow-hidden"
            >
                {/* Background Glows */}
                <div className="absolute inset-0">
                    <div
                        className="absolute -top-40 -left-40 w-96 h-96 
                        bg-indigo-500/20 rounded-full blur-3xl animate-pulse"
                    ></div>
                    <div
                        className="absolute -bottom-40 -right-40 w-[450px] h-[450px] 
                        bg-purple-600/20 rounded-full blur-3xl animate-pulse-slow"
                    ></div>
                </div>

                {/* Logo */}
                <div className="relative z-20 flex items-center animate-fade-in">
                    <img
                        src="/img/linkhub_light.png"
                        className="w-44 drop-shadow-2xl dark:hidden"
                        alt="LinkHub"
                    />
                    <img
                        src="/img/linkhub_dark.png"
                        className="w-44 drop-shadow-2xl hidden dark:block"
                        alt="LinkHub"
                    />
                </div>

                {/* Marketing Content */}
                <div className="relative z-20 mt-10 animate-slide-up">
                    <h1 className="text-4xl font-bold text-white leading-snug">
                        Build Your{" "}
                        <span className="text-indigo-400">Smart Profile</span>
                        <br />
                        In Minutes 🚀
                    </h1>

                    <p className="text-gray-300 text-lg mt-4 max-w-sm">
                        Share a single link and showcase your entire digital
                        identity.
                    </p>

                    <div className="mt-6 space-y-4">
                        <div className="flex items-center gap-3 text-gray-300">
                            <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
                            Customize your profile easily
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                            <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                            Track clicks & engagement
                        </div>
                        <div className="flex items-center gap-3 text-gray-300">
                            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                            Share anywhere with one link
                        </div>
                    </div>
                </div>

                {/* Mockup Preview */}
                <div className="relative z-20 mt-10 flex justify-center animate-float">
                    <img
                        src="/img/mockup_phone.png"
                        alt="Preview"
                        className="w-56 drop-shadow-2xl rounded-3xl border border-white/10"
                    />
                </div>

                {/* Footer */}
                <div className="relative z-20 text-gray-400 text-sm mt-auto">
                    © {new Date().getFullYear()} LinkHub. All rights reserved.
                </div>
            </div>

            {/* RIGHT CONTENT PANEL (dynamic children) */}
            <div className="flex items-center justify-center p-6">
                {children}
            </div>
        </div>
    );
}
