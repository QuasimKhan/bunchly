import AnimateOnScroll from "../AnimateOnScroll";
import { Check, X } from "lucide-react";

const ComparisonTable = () => {
    return (
        <section
            id="comparison"
            className="py-20 sm:py-32 px-5 sm:px-6 relative bg-white dark:bg-black"
        >
            <div className="max-w-4xl mx-auto">
                <AnimateOnScroll>
                    <h2 className="text-3xl sm:text-5xl font-bold text-center mb-12 sm:mb-20">
                        Why creators choose <span className="text-gradient-premium">Bunchly</span>
                    </h2>
                </AnimateOnScroll>

                <AnimateOnScroll delay={0.1}>
                    <div className="relative overflow-hidden rounded-3xl border border-gray-100 dark:border-white/10 shadow-2xl bg-white dark:bg-[#0A0A0A]">
                        {/* Table Header */}
                        <div className="grid grid-cols-3 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                            <div className="px-6 py-6 font-semibold text-gray-500 dark:text-gray-400">Feature</div>
                            <div className="px-6 py-6 font-bold text-center text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/10">Bunchly</div>
                            <div className="px-6 py-6 font-semibold text-center text-gray-500 dark:text-gray-400">Others</div>
                        </div>

                        {/* Table Body */}
                        <div className="divide-y divide-gray-100 dark:divide-white/5">
                            {[
                                ["Unlimited links", true, false],
                                ["Custom themes", true, false],
                                ["Analytics", true, "Paid Only"],
                                ["No Branding", true, false],
                                ["SEO Optimized", true, "Limited"],
                            ].map(([feature, bunchly, others], i) => (
                                <div key={i} className="grid grid-cols-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                    <div className="px-6 py-5 flex items-center font-medium text-gray-900 dark:text-gray-200">
                                        {feature}
                                    </div>
                                    <div className="px-6 py-5 flex justify-center items-center bg-indigo-50/30 dark:bg-indigo-500/5 group-hover:bg-indigo-50/50 dark:group-hover:bg-indigo-500/10 transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                            <Check className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="px-6 py-5 flex justify-center items-center text-gray-400 text-sm font-medium">
                                        {others === true ? (
                                            <Check className="w-5 h-5" />
                                        ) : others === false ? (
                                            <X className="w-5 h-5 opacity-30" />
                                        ) : (
                                            <span>{others}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </AnimateOnScroll>
            </div>
        </section>
    );
};

export default ComparisonTable;
