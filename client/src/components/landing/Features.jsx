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
             {/* Premium Aurora Background */}
            <div className="absolute inset-0 -z-10 bg-white dark:bg-[#050505]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] sm:h-[800px] opacity-40 dark:opacity-20 pointer-events-none">
                     <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/20 via-purple-500/10 to-transparent blur-3xl" />
                </div>
                 {/* Orbs - reduced size on mobile */}
                <div className="absolute top-[10%] left-[10%] w-48 h-48 sm:w-72 sm:h-72 bg-indigo-500/30 rounded-full blur-[80px] sm:blur-[100px] mix-blend-screen animate-float" />
                <div className="absolute top-[20%] right-[10%] w-60 h-60 sm:w-96 sm:h-96 bg-purple-500/20 rounded-full blur-[90px] sm:blur-[120px] mix-blend-screen animate-float" style={{ animationDelay: "2s" }} />
            </div>

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
