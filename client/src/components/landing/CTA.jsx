import AnimateOnScroll from "../AnimateOnScroll";
import Button from "../ui/Button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CTA = () => {
    const navigate = useNavigate();

    return (
        <section
            id="cta"
            className="
                relative
                py-20 sm:py-24
                px-5 sm:px-6
                text-center
                overflow-hidden
                scroll-mt-32
                bg-neutral-950
            "
        >
            {/* Background glow */}
            <div className="absolute inset-0 -z-10 flex justify-center">
                <div
                    className="
                        w-[520px] h-[520px]
                        sm:w-[700px] sm:h-[700px]
                        bg-indigo-500/25
                        blur-[160px]
                        rounded-full
                    "
                />
            </div>

            <AnimateOnScroll>
                <h2
                    className="
                        text-2xl sm:text-3xl md:text-4xl
                        font-bold
                        text-white
                        leading-tight
                    "
                >
                    Build your digital identity today
                </h2>

                <p
                    className="
                        mt-4
                        max-w-xl
                        mx-auto
                        text-sm sm:text-base
                        text-gray-300
                        leading-relaxed
                    "
                >
                    Join Bunchly and create a link page that truly represents
                    you—clean, fast, and beautifully designed.
                </p>

                {/* CTA Button */}
                <div className="mt-8 flex justify-center">
                    <div className="w-full max-w-xs sm:max-w-none">
                        <Button
                            text="Create your page"
                            icon={ArrowRight}
                            size="lg"
                            variant="primary"
                            onClick={() => navigate("/signup")}
                            className="shadow-lg"
                        />
                    </div>
                </div>
            </AnimateOnScroll>
        </section>
    );
};

export default CTA;
