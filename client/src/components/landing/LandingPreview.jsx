import AnimateOnScroll from "../AnimateOnScroll";

const LandingPreview = () => {
    return (
        <section className="pt-24 sm:pt-28 px-5 sm:px-6 bg-gray-50 dark:bg-black">
            <div className="max-w-6xl mx-auto text-center">
                <AnimateOnScroll>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-10 sm:mb-14">
                        See how your page really looks
                    </h2>
                </AnimateOnScroll>

                {/* Preview container */}
                <div
                    className="
                        relative
                        flex flex-col sm:flex-row
                        items-center justify-center
                        gap-8 sm:gap-12
                    "
                >
                    {/* Mobile Preview (primary focus) */}
                    <AnimateOnScroll delay={0.1}>
                        <div
                            className="
                                relative
                                rounded-[2.2rem]
                                bg-white dark:bg-neutral-900
                                border border-gray-200 dark:border-gray-800
                                shadow-xl
                                p-2
                            "
                        >
                            <img
                                src="/img/screenshots/mobile.png"
                                alt="Mobile preview"
                                className="
                                    w-[260px] sm:w-[280px]
                                    rounded-[1.8rem]
                                "
                            />
                        </div>
                    </AnimateOnScroll>

                    {/* Desktop Preview (secondary) */}
                    <AnimateOnScroll delay={0.2}>
                        <div
                            className="
                                relative
                                sm:mt-12
                                rounded-2xl
                                bg-white dark:bg-neutral-900
                                border border-gray-200 dark:border-gray-800
                                shadow-lg
                                p-3
                            "
                        >
                            <img
                                src="/img/screenshots/desktop.png"
                                alt="Desktop preview"
                                className="
                                    w-full
                                    max-w-[520px]
                                    rounded-xl
                                "
                            />
                        </div>
                    </AnimateOnScroll>
                </div>

                {/* Caption */}
                <AnimateOnScroll delay={0.3}>
                    <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
                        Fully responsive · Optimized for mobile and desktop
                    </p>
                </AnimateOnScroll>
            </div>
        </section>
    );
};

export default LandingPreview;
