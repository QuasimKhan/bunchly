import AnimateOnScroll from "../AnimateOnScroll";

const SocialProof = () => {
    return (
        <section className="py-12 border-b border-gray-100 bg-white dark:bg-[#050505] dark:border-white/5">
            <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
                <AnimateOnScroll>
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-widest text-center mb-8">
                        Powering next-gen creators
                    </p>
                </AnimateOnScroll>

                <AnimateOnScroll delay={0.1}>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale transition-all duration-500 hover:grayscale-0 hover:opacity-100">
                        {["Creators", "Indie Hackers", "Startups", "Agencies", "Influencers"].map((item) => (
                            <span 
                                key={item} 
                                className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white tracking-tight"
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </AnimateOnScroll>
            </div>
        </section>
    );
};

export default SocialProof;
