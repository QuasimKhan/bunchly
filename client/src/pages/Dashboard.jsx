import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import SmartSkeleton from "../components/ui/SmartSkeleton";
import { buildUrl } from "../lib/seo";
import { useSEO } from "../hooks/useSEO";
import { WelcomeHeader, QuickStats, RecentLinks, DetailedAnalytics } from "../components/dashboard/DashboardWidgets";
import LivePreview from "../components/preview/LivePreview";
import { getLinks } from "../services/linkService";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
    useSEO({
        title: "Dashboard – Bunchly",
        description: "Manage your Bunchly account.",
        noIndex: true,
        url: buildUrl("/dashboard"),
    });

    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [statsLoading, setStatsLoading] = useState(true);
    
    const [links, setLinks] = useState([]);
    const [analytics, setAnalytics] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Parallel fetch
                const [linksData, analyticsRes] = await Promise.allSettled([
                    getLinks(),
                    fetch(`${import.meta.env.VITE_API_URL}/api/analytics?range=30`, { credentials: 'include' }).then(r => r.json())
                ]);

                if (linksData.status === 'fulfilled') {
                    setLinks(linksData.value);
                }

                if (analyticsRes.status === 'fulfilled' && analyticsRes.value.success) {
                    setAnalytics(analyticsRes.value.data);
                }
            } catch (err) {
                console.error("Dashboard fetch error", err);
            } finally {
                setLoading(false);
                setStatsLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <SmartSkeleton variant="dashboard" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 pb-20 pt-6">
            
            {/* 1. Header Area */}
            <WelcomeHeader user={user} />

            <div className="flex flex-col lg:flex-row gap-8">
                
                {/* 2. Main Content (Left) */}
                <div className="flex-1 space-y-8">
                    
                    {/* Stats Row */}
                    <section>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-amber-500" />
                            Performance <span className="text-xs font-normal text-gray-500 bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded-full">Last 30 Days</span>
                        </h2>
                        <QuickStats analytics={analytics} loading={statsLoading} />
                        <DetailedAnalytics analytics={analytics} loading={statsLoading} />
                    </section>

                    {/* Action Grid */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <ActionCard 
                            title="Customize Appearance"
                            desc="Make your page pop with themes & colors."
                            icon="🎨"
                            to="/dashboard/appearance"
                            color="bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400"
                        />
                        {user?.plan !== "pro" && (
                             <ActionCard 
                                title="Upgrade Plan"
                                desc="Unlock verified checkmark & remove ads."
                                icon="💎"
                                to="/dashboard/upgrade"
                                color="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                            />
                        )}
                    </section>
                    
                    {/* Recent Content */}
                    <RecentLinks links={links} />

                </div>

                {/* 3. Live Preview (Right) - Sticky Desktop */}
                <div className="lg:w-[400px] shrink-0">
                    <div className="sticky top-24">
                        <div className="flex items-center justify-between mb-4 px-2">
                             <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-indigo-500" />
                                Live Preview
                            </h2>
                            <a href={`/${user.username}`} target="_blank" rel="noreferrer" className="text-xs font-medium text-indigo-600 hover:underline">
                                Open Page
                            </a>
                        </div>

                        {/* iPhone Frame */}
                        <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
                            <div className="h-[32px] w-[3px] bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
                            <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
                            <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
                            <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>
                            
                            <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white dark:bg-black relative">
                                <LivePreview user={user} links={links} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

function ActionCard({ title, desc, icon, to, color }) {
    return (
        <Link 
            to={to} 
            className={`block p-6 rounded-2xl border border-neutral-100 dark:border-white/5 transition-all hover:-translate-y-1 hover:shadow-lg ${color}`}
        >
            <div className="flex items-start justify-between">
                <div className="space-y-3">
                    <span className="inline-block text-2xl">{icon}</span>
                    <div>
                        <h3 className="font-bold">{title}</h3>
                        <p className="text-sm opacity-80 leading-relaxed mt-1">{desc}</p>
                    </div>
                </div>
                <ArrowRight className="w-5 h-5 opacity-50" />
            </div>
        </Link>
    );
}

export default Dashboard;
