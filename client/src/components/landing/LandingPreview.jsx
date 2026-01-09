import AnimateOnScroll from "../AnimateOnScroll";

const LandingPreview = () => {
    return (
        <section
            id="preview"
            className="py-16 sm:py-32 px-5 sm:px-6 relative overflow-hidden"
        >
             {/* Background Mesh */}
             <div className="absolute inset-0 bg-white dark:bg-black -z-10">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />
             </div>

            <div className="max-w-6xl mx-auto text-center">
                <AnimateOnScroll>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-10 sm:mb-20">
                        See how your page <span className="text-gradient-premium">shines</span>
                    </h2>
                </AnimateOnScroll>

                {/* Preview container */}
                <div
                    className="
                        relative
                        flex flex-col lg:flex-row
                        items-center justify-center
                        gap-10 sm:gap-16
                    "
                >
                    {/* Mobile Preview (primary focus) */}
                    <AnimateOnScroll delay={0.1}>
                        <div className="relative group">
                            {/* Glow behind phone */}
                            <div className="absolute -inset-4 bg-indigo-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition duration-700 rounded-full" />
                            
                            <div
                                className="
                                    relative
                                    rounded-[2.5rem] sm:rounded-[3rem]
                                    bg-gray-100 dark:bg-neutral-800
                                    border-[6px] sm:border-[8px] border-white dark:border-neutral-800
                                    shadow-2xl
                                    w-[260px] h-[520px] sm:w-[300px] sm:h-[600px]
                                    overflow-hidden
                                    rotate-0 sm:-rotate-3 hover:rotate-0 transition-transform duration-500
                                "
                            >
                                {/* Phone Notch */}
                                <div className="absolute top-0 inset-x-0 h-5 sm:h-6 bg-white dark:bg-neutral-800 z-20 flex justify-center">
                                    <div className="w-16 sm:w-20 h-3 sm:h-4 bg-black rounded-b-xl" />
                                </div>
                                
                                <img
                                    src="/img/screenshots/mobile.png"
                                    alt="Mobile preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </AnimateOnScroll>

                    {/* Desktop Preview (secondary) */}
                    <AnimateOnScroll delay={0.2} className="block mt-[-40px] sm:mt-0 z-0 sm:z-auto">
                         <div className="relative group perspective-1000">
                             <div className="absolute -inset-4 bg-purple-500/20 blur-3xl opacity-0 group-hover:opacity-100 transition duration-700" />
                             
                            <div
                                className="
                                    relative
                                    rounded-xl
                                    bg-white dark:bg-neutral-900
                                    border border-gray-200 dark:border-gray-800
                                    shadow-2xl
                                    p-2
                                    w-[280px] sm:w-[500px]
                                    rotate-6 sm:rotate-2 hover:rotate-0 transition-transform duration-500
                                    glass-panel
                                "
                            >
                                {/* Browser Dots */}
                                <div className="flex gap-1.5 mb-2 px-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                                </div>
                                
                                <img
                                    src="/img/screenshots/desktop.png"
                                    alt="Desktop preview"
                                    className="
                                        w-full
                                        rounded-lg
                                        shadow-inner
                                    "
                                />
                            </div>
                        </div>
                    </AnimateOnScroll>
                </div>

                {/* Caption */}
                <AnimateOnScroll delay={0.3}>
                    <p className="mt-12 text-sm text-gray-400 uppercase tracking-widest font-medium">
                        Fully responsive · Optimized for every device
                    </p>
                </AnimateOnScroll>
            </div>
        </section>
    );
};

export default LandingPreview;
