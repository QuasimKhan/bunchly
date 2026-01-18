import AnimateOnScroll from "../AnimateOnScroll";
import Button from "../ui/Button";
import { ArrowRight, Play, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";


const Hero = () => {
    const navigate = useNavigate();

    return (
        <section className="relative pt-24 pb-12 sm:pt-40 sm:pb-32 px-5 sm:px-6 text-center overflow-hidden">
            {/* Premium Aurora Background */}
            <div className="absolute inset-0 -z-10 bg-white dark:bg-[#050505]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] sm:h-[800px] opacity-40 dark:opacity-20 pointer-events-none">
                     <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/20 via-purple-500/10 to-transparent blur-3xl" />
                </div>
                 {/* Orbs - reduced size on mobile */}
                <div className="absolute top-[10%] left-[10%] w-48 h-48 sm:w-72 sm:h-72 bg-indigo-500/30 rounded-full blur-[80px] sm:blur-[100px] mix-blend-screen animate-float" />
                <div className="absolute top-[20%] right-[10%] w-60 h-60 sm:w-96 sm:h-96 bg-purple-500/20 rounded-full blur-[90px] sm:blur-[120px] mix-blend-screen animate-float" style={{ animationDelay: "2s" }} />
            </div>

            <div className="max-w-7xl mx-auto flex flex-col items-center">
                {/* Badge */}
                <AnimateOnScroll>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-sm backdrop-blur-sm mb-6 sm:mb-8 transition-transform hover:scale-105 cursor-default">
                        <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                        <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                             v2.0 - Live
                        </span>
                    </div>
                </AnimateOnScroll>

                <AnimateOnScroll delay={0.1}>
                    <h1
                        className="
                            text-4xl sm:text-6xl md:text-7xl lg:text-8xl
                            font-bold tracking-tight
                            text-gray-900 dark:text-white
                            max-w-5xl mx-auto
                            leading-[1.1]
                            mb-4 sm:mb-6
                        "
                    >
                        One Link. <br className="hidden sm:block" />
                        <span className="text-gradient-premium block sm:inline mt-1 sm:mt-0">Every Identity.</span>
                    </h1>
                </AnimateOnScroll>

                <AnimateOnScroll delay={0.2}>
                    <p
                        className="
                            text-base sm:text-xl md:text-2xl
                            text-gray-600 dark:text-gray-400
                            max-w-2xl mx-auto
                            leading-relaxed
                            mb-8 sm:mb-10
                            px-2
                        "
                    >
                        Bunchly is the premium link-in-bio built for professionals. 
                        Share your world with a stunning, customizable page.
                    </p>
                </AnimateOnScroll>

                <AnimateOnScroll delay={0.3}>
                    <div
                        className="
                            flex flex-col sm:flex-row
                            items-center justify-center
                            gap-3 sm:gap-4 w-full sm:w-auto
                        "
                    >
                        <Button
                            text="Claim your link"
                            icon={ArrowRight}
                            size="lg"
                            variant="primary"
                            onClick={() => navigate("/signup")}
                            className="w-full sm:w-auto shadow-xl shadow-indigo-500/20 transition-all"
                        />

                        <Button
                            text="View Demo"
                            icon={Play}
                            size="lg"
                            variant="outline"
                            onClick={() => navigate("/bunchly")}
                            className="w-full sm:w-auto bg-white/50 dark:bg-white/5 backdrop-blur-md border-gray-200 dark:border-gray-800"
                        />
                    </div>
                </AnimateOnScroll>

            </div>
        </section>
    );
};

export default Hero;
