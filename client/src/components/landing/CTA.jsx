import AnimateOnScroll from "../AnimateOnScroll";
import Button from "../ui/Button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CTA = () => {
    const navigate = useNavigate();

    return (
        <section
            id="cta"
            className="
                relative
                py-24 sm:py-32
                px-5 sm:px-6
                text-center
                overflow-hidden
                scroll-mt-32
                dark:bg-black
            "
        >
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 to-black pointer-events-none" />
            
            {/* Animated Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[1000px] h-[600px] sm:h-[1000px] bg-indigo-600/20 rounded-full blur-[120px] sm:blur-[180px] pointer-events-none animate-pulse" style={{ animationDuration: '4s' }} />

            <div className="relative z-10 max-w-4xl mx-auto">
                <AnimateOnScroll>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        <span className="text-sm font-medium text-gray-300">Start your journey today</span>
                    </div>

                    <h2
                        className="
                            text-4xl sm:text-6xl md:text-7xl
                            font-bold
                            text-white
                            tracking-tight
                            mb-6 sm:mb-8
                        "
                    >
                        Your identity, <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-white">
                            reimagined.
                        </span>
                    </h2>

                    <p
                        className="
                            text-lg sm:text-xl
                            text-gray-400
                            max-w-2xl
                            mx-auto
                            leading-relaxed
                            mb-10 sm:mb-14
                        "
                    >
                        Join thousands of creators who use Bunchly to control their brand, 
                        share their content, and grow their audience.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button
                            text="Claim your link"
                            icon={ArrowRight}
                            size="xl"
                            variant="primary"
                            onClick={() => navigate("/signup")}
                            className="w-full sm:w-auto shadow-2xl shadow-indigo-500/20 hover:shadow-indigo-500/40"
                        />
                    </div>
                </AnimateOnScroll>
            </div>
        </section>
    );
};

export default CTA;
