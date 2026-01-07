import { useEffect, useMemo, useState } from "react";
import {
    BarChart3,
    TrendingUp,
    Globe,
    Smartphone,
    Monitor,
    Calendar,
    ArrowUpRight
} from "lucide-react";
import { toast } from "sonner";
import ProPaywall from "../components/paywall/ProPaywall";
import SmartSkeleton from "../components/ui/SmartSkeleton";
import { ClicksChart, DonutChart } from "../components/analytics/AnalyticsCharts";

/* ======================================================
   ANALYTICS
====================================================== */

const Analytics = () => {
    const [range, setRange] = useState(7);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            setError(null);

            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/analytics?range=${range}`,
                    { credentials: "include" }
                );

                const result = await res.json();

                if (!result.success) {
                    if (result.code === "PRO_REQUIRED") {
                        setError("PRO_REQUIRED");
                    } else {
                        throw new Error();
                    }
                } else {
                    setData(result.data);
                }
            } catch {
                setError("FAILED");
                toast.error("Failed to load analytics");
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [range]);

    /* ---------------- DERIVED DATA ---------------- */
    const totalDeviceCount = useMemo(() => {
        if (!data?.deviceBreakdown) return 0;
        return data.deviceBreakdown.reduce((sum, d) => sum + d.count, 0);
    }, [data]);

    /* ---------------- LOADING ---------------- */
    if (loading) {
        return (
            <div className="p-6">
                <SmartSkeleton variant="analytics" />
            </div>
        );
    }

    /* ---------------- PAYWALL ---------------- */
    if (error === "PRO_REQUIRED") {
        return (
            <ProPaywall
                title="Analytics is a Pro feature"
                description="Understand how people interact with your profile and links."
            />
        );
    }

    if (!data) return null;

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-20">
            {/* ================= HEADER ================= */}
            <header className="flex items-start justify-between flex-wrap gap-4 bg-white dark:bg-[#0A0A0A] p-6 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
                             <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 ml-1">
                        Track your growth and audience engagement.
                    </p>
                </div>

                <DateRangeSelector range={range} onChange={setRange} />
            </header>

            {/* ================= KPIs ================= */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 <KpiCard
                    label="Total Clicks"
                    value={data.totalClicks}
                    icon={TrendingUp}
                    trend="+12%" // Mock trend for now or calculate if previous period data exists
                    positive
                />
                <KpiCard
                    label="Profile Views"
                    value={data.profileViews}
                    icon={Monitor}
                    trend="Stable"
                    color="blue"
                />
                <KpiCard
                    label="Click-Through Rate"
                    value={data.profileViews ? Math.round((data.totalClicks / data.profileViews) * 100) + '%' : '0%'}
                    icon={ArrowUpRight}
                    trend="High"
                    color="purple"
                    positive
                />
            </section>

             {/* ================= MAIN CHART ================= */}
             <section className="bg-white dark:bg-[#0A0A0A] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm p-6 sm:p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Performance</h2>
                        <p className="text-sm text-gray-500">Clicks over time</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="w-4 h-4" />
                        Last {range} Days
                    </div>
                </div>
                <ClicksChart data={data.clicksOverTime} range={range} />
             </section>

             {/* ================= BREAKDOWNS (Expanded) ================= */}
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 {/* Devices */}
                 <section className="bg-white dark:bg-[#0A0A0A] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-50 dark:bg-purple-500/10 rounded-lg">
                            <Smartphone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Devices</h2>
                    </div>
                    <DonutChart data={data.deviceBreakdown} />
                 </section>

                 {/* OS */}
                 <section className="bg-white dark:bg-[#0A0A0A] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-pink-50 dark:bg-pink-500/10 rounded-lg">
                            <Monitor className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">OS</h2>
                    </div>
                    <DonutChart data={data.osBreakdown} />
                 </section>

                 {/* Top Referrers */}
                 <section className="bg-white dark:bg-[#0A0A0A] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm p-6 overflow-hidden">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-orange-50 dark:bg-orange-500/10 rounded-lg">
                            <Globe className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Sources</h2>
                    </div>
                     <div className="space-y-4 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                        {data.referrerBreakdown?.map((r, i) => (
                             <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                                <span className="font-medium text-sm text-gray-700 dark:text-gray-200 truncate max-w-[70%]">
                                    {r._id === 'Direct' ? 'Direct / Unknown' : r._id.replace('https://', '').replace('www.', '').split('/')[0]}
                                </span>
                                <span className="text-sm font-bold text-gray-900 dark:text-white">{r.count}</span>
                            </div>
                        ))}
                         {!data.referrerBreakdown?.length && <p className="text-sm text-gray-500 text-center py-6">No data available</p>}
                    </div>
                 </section>
             </div>

             {/* ================= LOCATIONS ================= */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {/* Countries */}
                 <section className="bg-white dark:bg-[#0A0A0A] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Top Countries</h2>
                    <div className="space-y-3">
                        {data.topCountries?.slice(0,5).map((c, i) => (
                            <ListRow key={i} label={c._id || 'Unknown'} value={c.count} />
                        ))}
                        {!data.topCountries?.length && <EmptyPlaceholder />}
                    </div>
                 </section>

                 {/* Cities */}
                 <section className="bg-white dark:bg-[#0A0A0A] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Top Cities</h2>
                    <div className="space-y-3">
                        {data.cityBreakdown?.slice(0,5).map((c, i) => (
                            <ListRow key={i} label={c._id || 'Unknown'} value={c.count} />
                        ))}
                        {!data.cityBreakdown?.length && <EmptyPlaceholder />}
                    </div>
                 </section>
             </div>

            {/* ================= TOP LINKS ================= */}
            <Section
                title="Top Performing Links"
                icon={<TrendingUp className="w-5 h-5 text-indigo-600" />}
            >
                {data.topLinks?.length ? (
                    <div className="bg-white dark:bg-[#0A0A0A] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
                        {data.topLinks.map((link, i) => (
                            <Row
                                key={link._id}
                                index={i + 1}
                                title={link.title}
                                subtitle={link.url}
                                value={`${link.clicks} clicks`}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState text={`No clicks in last ${range} days`} />
                )}
            </Section>
        </div>
    );
};

export default Analytics;

/* ======================================================
   UI COMPONENTS
====================================================== */

const DateRangeSelector = ({ range, onChange }) => (
    <div className="flex items-center gap-1 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 p-1">
        {[7, 30].map((r) => (
            <button
                key={r}
                onClick={() => onChange(r)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    range === r
                        ? "bg-white dark:bg-neutral-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
            >
                {r} Days
            </button>
        ))}
    </div>
);

const KpiCard = ({ label, value, icon: Icon, trend, positive, color = "indigo" }) => {
    const colorClasses = {
        indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
        blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
        purple: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400"
    };

    return (
        <div className="rounded-2xl bg-white dark:bg-[#0A0A0A] border border-gray-100 dark:border-white/5 p-6 shadow-sm relative overflow-hidden group hover:border-indigo-100 dark:hover:border-indigo-500/20 transition-colors">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${colorClasses[color]}`}>
                <Icon className="w-5 h-5" />
            </div>
            
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
            <div className="flex items-end gap-3 mt-1">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
                {/* <span className={`text-xs font-semibold px-2 py-1 rounded-full mb-1 ${positive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {trend}
                </span> */}
            </div>
        </div>
    );
};

const Section = ({ title, icon, children }) => (
    <section className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            {title}
        </h2>
        {children}
    </section>
);

const Row = ({ index, title, subtitle, value }) => (
    <div className="flex items-center justify-between px-6 py-4 border-b last:border-b-0 border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
        <div className="flex items-center gap-4 min-w-0">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-xs font-bold text-gray-500">
                {index}
            </span>
            <div className="min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white truncate">{title}</p>
                {subtitle && (
                    <p className="text-xs text-gray-500 truncate">{subtitle}</p>
                )}
            </div>
        </div>
        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
            {value}
        </span>
    </div>
);

const ListRow = ({ label, value }) => (
    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
        <span className="font-medium text-sm text-gray-700 dark:text-gray-200">{label}</span>
        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{value}</span>
    </div>
);

const EmptyPlaceholder = () => (
    <p className="text-sm text-gray-500 text-center py-6">No data available yet</p>
);

const EmptyState = ({ text }) => (
    <div className="rounded-2xl border border-dashed border-gray-200 dark:border-white/10 p-12 text-center">
        <div className="mx-auto w-12 h-12 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
            <BarChart3 className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-sm text-gray-500">{text}</p>
    </div>
);
