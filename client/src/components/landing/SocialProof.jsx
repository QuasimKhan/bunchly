import AnimateOnScroll from "../AnimateOnScroll";

const SocialProof = () => {
    return (
        <section className="py-16 sm:py-20 px-6">
            <AnimateOnScroll>
                <p
                    className="
                        text-center
                        text-xs sm:text-sm
                        uppercase tracking-[0.25em]
                        text-gray-400
                        mb-6 sm:mb-8
                    "
                >
                    Used by creators and growing teams
                </p>
            </AnimateOnScroll>

            <AnimateOnScroll delay={0.1}>
                <div
                    className="
                        flex flex-wrap justify-center
                        gap-x-6 gap-y-3 sm:gap-x-10
                        text-gray-500 dark:text-gray-400
                        text-sm sm:text-base
                        font-medium
                    "
                >
                    <span>Creators</span>
                    <span>Developers</span>
                    <span>Startups</span>
                    <span>Freelancers</span>
                    <span>Agencies</span>
                </div>
            </AnimateOnScroll>

            {/* Subtle divider */}
            <AnimateOnScroll delay={0.15}>
                <div className="mt-10 flex justify-center">
                    <div className="h-px w-32 bg-gray-200 dark:bg-gray-800" />
                </div>
            </AnimateOnScroll>
        </section>
    );
};

export default SocialProof;
