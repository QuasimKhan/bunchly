import {
    Sparkles,
    Palette,
    BarChart3,
    ShieldCheck,
    Globe,
    Zap,
} from "lucide-react";
import AnimateOnScroll from "../AnimateOnScroll";

const features = [
    {
        icon: Sparkles,
        title: "Premium Presence",
        desc: "Elegant, minimal pages that look professional across every platform.",
    },
    {
        icon: Palette,
        title: "Themes & Branding",
        desc: "Customize colors, layouts, and styles to match your personal or brand identity.",
    },
    {
        icon: BarChart3,
        title: "Smart Analytics",
        desc: "Understand clicks, engagement, and growth with real-time insights.",
    },
    {
        icon: Globe,
        title: "Custom Domains",
        desc: "Use your own domain to build trust and strengthen credibility.",
    },
    {
        icon: ShieldCheck,
        title: "Secure by Design",
        desc: "Authentication, rate-limiting, and protection built in from day one.",
    },
    {
        icon: Zap,
        title: "Fast & Optimized",
        desc: "Lightning-fast performance powered by modern web infrastructure.",
    },
];

const Features = () => {
    return (
        <section
            id="features"
            className="py-24 sm:py-28 px-5 sm:px-6 bg-white dark:bg-black scroll-mt-32"
        >
            <div className="max-w-6xl mx-auto">
                <AnimateOnScroll>
                    <h2 className="text-3xl sm:text-4xl font-bold text-center mb-14 sm:mb-16">
                        Why choose Bunchly?
                    </h2>
                </AnimateOnScroll>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {features.map((f, i) => (
                        <AnimateOnScroll key={f.title} delay={i * 0.05}>
                            <div
                                className="
                                    group
                                    h-full
                                    rounded-2xl
                                    border border-gray-200 dark:border-gray-800
                                    bg-gray-50/70 dark:bg-gray-900/60
                                    p-6 sm:p-8
                                    transition-all duration-300
                                    hover:-translate-y-1
                                    hover:shadow-lg
                                "
                            >
                                {/* Icon container */}
                                <div
                                    className="
                                        mb-4
                                        w-11 h-11
                                        rounded-xl
                                        bg-indigo-600/10
                                        flex items-center justify-center
                                        group-hover:bg-indigo-600/15
                                        transition
                                    "
                                >
                                    <f.icon className="w-5 h-5 text-indigo-600" />
                                </div>

                                <h3 className="text-lg sm:text-xl font-semibold mb-2">
                                    {f.title}
                                </h3>

                                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {f.desc}
                                </p>
                            </div>
                        </AnimateOnScroll>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
