import AnimateOnScroll from "../AnimateOnScroll";
import SpotlightCard from "../ui/SpotlightCard";
import { Users, Code, Briefcase } from "lucide-react";

const UseCases = () => (
    <section className="py-20 sm:py-32 max-w-7xl mx-auto px-6 bg-white dark:bg-[#050505]">
        <AnimateOnScroll>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 sm:mb-20">
                Built for <span className="text-gradient-premium">everyone</span>
            </h2>
        </AnimateOnScroll>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <UseCard
                icon={Users}
                title="Creators"
                desc="Consolidate Instagram, YouTube, and TikTok links in one beautiful page."
                delay={0}
            />
            <UseCard
                icon={Code}
                title="Developers"
                desc="Showcase your GitHub, portfolio, projects, and resume effortlessly."
                delay={0.1}
            />
            <UseCard
                icon={Briefcase}
                title="Businesses"
                desc="Create landing pages for campaigns, sales, and contact info in seconds."
                delay={0.2}
            />
        </div>
    </section>
);

const UseCard = ({ icon: Icon, title, desc, delay }) => (
    <AnimateOnScroll delay={delay}>
        <SpotlightCard className="h-full bg-white dark:bg-neutral-900 border-gray-200 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="p-8 h-full flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-white/5 flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-400">
                    <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm sm:text-base">{desc}</p>
            </div>
        </SpotlightCard>
    </AnimateOnScroll>
);

export default UseCases;
