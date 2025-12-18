import AnimateOnScroll from "../AnimateOnScroll";
import Button from "../ui/Button";
import { ArrowRight, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
    const navigate = useNavigate();

    return (
        <section className="relative pt-28 sm:pt-36  px-5 sm:px-6 text-center overflow-hidden">
            {/* Subtle background glow (softer on mobile) */}
            <div className="absolute inset-0 -z-10 flex justify-center">
                <div
                    className="
                        w-[420px] h-[420px]
                        sm:w-[600px] sm:h-[600px]
                        bg-indigo-500/10
                        blur-[100px]
                        rounded-full
                    "
                />
            </div>

            <div className="max-w-5xl mx-auto">
                <AnimateOnScroll>
                    <h1
                        className="
                            text-[2.4rem] leading-tight
                            sm:text-5xl md:text-6xl
                            font-extrabold tracking-tight
                            bg-gradient-to-r
                            from-indigo-600 via-purple-600 to-pink-500
                            bg-clip-text text-transparent
                        "
                    >
                        One Link.
                        <span className="block sm:inline">
                            {" "}
                            Every Identity.
                        </span>
                    </h1>
                </AnimateOnScroll>

                <AnimateOnScroll delay={0.1}>
                    <p
                        className="
                            mt-5 sm:mt-6
                            text-base sm:text-lg md:text-xl
                            text-gray-600 dark:text-gray-300
                            max-w-xl sm:max-w-2xl
                            mx-auto
                            leading-relaxed
                        "
                    >
                        Bunchly helps creators, professionals, and brands share
                        everything they do through a single, beautifully crafted
                        link page.
                    </p>
                </AnimateOnScroll>

                <AnimateOnScroll delay={0.2}>
                    <div
                        className="
                            mt-10 sm:mt-12
                            flex flex-col sm:flex-row
                            items-center justify-center
                            gap-4 sm:gap-4

                        "
                    >
                        {/* Primary CTA */}
                        <Button
                            text="Get Started Free"
                            icon={ArrowRight}
                            size="lg"
                            variant="primary"
                            onClick={() => navigate("/signup")}
                            className="sm:w-auto shadow-lg"
                        />

                        {/* Secondary CTA */}
                        <Button
                            text="View Demo"
                            icon={Play}
                            size="lg"
                            variant="outline"
                            onClick={() => navigate("/u/quasim")}
                            className="sm:ws:w-auto"
                        />
                    </div>
                </AnimateOnScroll>

                {/* Trust hint */}
                <AnimateOnScroll delay={0.3}>
                    <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                        Free forever · No credit card required
                    </p>
                </AnimateOnScroll>
            </div>
        </section>
    );
};

export default Hero;
