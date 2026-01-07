import {
    Sparkles,
    Palette,
    BarChart3,
    ShieldCheck,
    Globe,
    Zap,
    Layout,
    Smartphone
} from "lucide-react";
import AnimateOnScroll from "../AnimateOnScroll";
import SpotlightCard from "../ui/SpotlightCard";

const features = [
    {
        icon: Sparkles,
        title: "Premium Presence",
        desc: "Elegant, minimal pages that look professional across every platform.",
        delay: 0
    },
    {
        icon: Palette,
        title: "Themes & Branding",
        desc: "Customize colors, layouts, and styles to match your personal or brand identity.",
        delay: 0.1
    },
    {
        icon: BarChart3,
        title: "Smart Analytics",
        desc: "Understand clicks, engagement, and growth with real-time insights.",
        delay: 0.2
    },
    {
        icon: Globe,
        title: "Custom Domains",
        desc: "Use your own domain to build trust and strengthen credibility.",
        delay: 0.3
    },
    {
        icon: ShieldCheck,
        title: "Secure by Design",
        desc: "Authentication, rate-limiting, and protection built in from day one.",
        delay: 0.4
    },
    {
        icon: Smartphone,
        title: "Mobile Optimized",
        desc: "Lightning-fast performance powered by modern web infrastructure.",
        delay: 0.5
    },
];

const Features = () => {
    return (
        <section
            id="features"
            className="py-16 sm:py-32 px-5 sm:px-6 bg-gray-50 dark:bg-black/50 scroll-mt-32 relative"
        >
            {/* Background elements */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 dark:opacity-5 pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                <AnimateOnScroll>
                    <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-20">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 sm:mb-6">
                            Everything you need to <span className="text-gradient-premium">grow</span>
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                             Powerful features wrapped in a stunning design. Built to help you convert your audience.
                        </p>
                    </div>
                </AnimateOnScroll>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
                    {features.map((f, i) => (
                        <AnimateOnScroll key={f.title} delay={f.delay}>
                            <SpotlightCard className="h-full bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
                                <div className="p-8 h-full flex flex-col items-start">
                                    <div
                                        className="
                                            mb-6
                                            w-12 h-12
                                            rounded-2xl
                                            bg-indigo-50 data-[state=alt]:bg-purple-50
                                            dark:bg-white/5
                                            flex items-center justify-center
                                            border border-indigo-100 dark:border-white/10
                                        "
                                    >
                                        <f.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                    </div>

                                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                                        {f.title}
                                    </h3>

                                    <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {f.desc}
                                    </p>
                                </div>
                            </SpotlightCard>
                        </AnimateOnScroll>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
