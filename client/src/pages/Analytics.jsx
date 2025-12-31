import { useEffect, useMemo, useState } from "react";
import {
    BarChart3,
    TrendingUp,
    Globe,
    Smartphone,
    Monitor,
} from "lucide-react";
import { toast } from "sonner";
import ProPaywall from "../components/paywall/ProPaywall";
import SmartSkeleton from "../components/ui/SmartSkeleton";

/* ======================================================
   ANALYTICS (PRODUCTION – V1)
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
                    `${
                        import.meta.env.VITE_API_URL
                    }/api/analytics?range=${range}`,
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

    const totalBrowserCount = useMemo(() => {
        if (!data?.browserUsage) return 0;
        return data.browserUsage.reduce((sum, b) => sum + b.count, 0);
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
        <div className="max-w-7xl mx-auto px-4 pb-20 space-y-14">
            {/* ================= HEADER ================= */}
            <header className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <BarChart3 className="w-6 h-6 text-indigo-600" />
                        <h1 className="text-2xl font-semibold">Analytics</h1>
                    </div>
                    <p className="text-sm text-neutral-500 mt-1">
                        Insights for your public profile
                    </p>
                </div>

                <DateRangeSelector range={range} onChange={setRange} />
            </header>

            {/* ================= KPIs ================= */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <KpiCard
                    label="Profile Views"
                    value={data.profileViews}
                    hint={`Last ${range} days`}
                />
                <KpiCard
                    label="Link Clicks"
                    value={data.totalClicks}
                    hint={`Last ${range} days`}
                />
            </section>

            {/* ================= TOP LINKS ================= */}
            <Section
                title="Top performing links"
                icon={<TrendingUp className="w-5 h-5 text-indigo-600" />}
            >
                {data.topLinks?.length ? (
                    <CardList>
                        {data.topLinks.map((link) => (
                            <Row
                                key={link._id}
                                title={link.title}
                                subtitle={link.url}
                                value={`${link.clicks} clicks`}
                            />
                        ))}
                    </CardList>
                ) : (
                    <EmptyState text={`No clicks in last ${range} days`} />
                )}
            </Section>

            {/* ================= GEO ================= */}
            <Section
                title="Top countries"
                icon={<Globe className="w-5 h-5 text-indigo-600" />}
            >
                {data.topCountries?.length ? (
                    <CardList>
                        {data.topCountries.map((c) => (
                            <Row
                                key={c._id}
                                title={c._id || "Unknown"}
                                value={`${c.count} views`}
                            />
                        ))}
                    </CardList>
                ) : (
                    <EmptyState text="No location data yet" />
                )}
            </Section>

            {/* ================= DEVICES ================= */}
            <Section
                title="Devices"
                icon={<Smartphone className="w-5 h-5 text-indigo-600" />}
            >
                {totalDeviceCount ? (
                    <StatGrid>
                        {data.deviceBreakdown.map((d) => (
                            <MiniStat
                                key={d._id}
                                label={capitalize(d._id)}
                                value={`${d.count} (${Math.round(
                                    (d.count / totalDeviceCount) * 100
                                )}%)`}
                            />
                        ))}
                    </StatGrid>
                ) : (
                    <EmptyState text="No device data yet" />
                )}
            </Section>

            {/* ================= BROWSERS ================= */}
            <Section
                title="Browsers"
                icon={<Monitor className="w-5 h-5 text-indigo-600" />}
            >
                {totalBrowserCount ? (
                    <StatGrid>
                        {data.browserUsage.map((b) => (
                            <MiniStat
                                key={b._id}
                                label={b._id || "Unknown"}
                                value={`${b.count} (${Math.round(
                                    (b.count / totalBrowserCount) * 100
                                )}%)`}
                            />
                        ))}
                    </StatGrid>
                ) : (
                    <EmptyState text="No browser data yet" />
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
    <div className="flex items-center gap-1 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-1">
        {[7, 30].map((r) => (
            <button
                key={r}
                onClick={() => onChange(r)}
                className={`px-3 py-1.5 text-sm rounded-lg transition ${
                    range === r
                        ? "bg-indigo-600 text-white"
                        : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
            >
                Last {r} days
            </button>
        ))}
    </div>
);

const KpiCard = ({ label, value, hint }) => (
    <div className="rounded-2xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 p-6">
        <p className="text-sm text-neutral-500">{label}</p>
        <p className="mt-2 text-3xl font-semibold">{value}</p>
        <p className="mt-1 text-xs text-neutral-500">{hint}</p>
    </div>
);

const Section = ({ title, icon, children }) => (
    <section className="space-y-4">
        <div className="flex items-center gap-2">
            {icon}
            <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        {children}
    </section>
);

const CardList = ({ children }) => (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        {children}
    </div>
);

const Row = ({ title, subtitle, value }) => (
    <div className="flex items-center justify-between px-5 py-4 border-b last:border-b-0 border-neutral-200 dark:border-neutral-800">
        <div className="min-w-0">
            <p className="font-medium truncate">{title}</p>
            {subtitle && (
                <p className="text-xs text-neutral-500 truncate">{subtitle}</p>
            )}
        </div>
        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {value}
        </span>
    </div>
);

const StatGrid = ({ children }) => (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">{children}</div>
);

const MiniStat = ({ label, value }) => (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-4 text-center">
        <p className="text-sm text-neutral-500">{label}</p>
        <p className="text-lg font-semibold mt-1">{value}</p>
    </div>
);

const EmptyState = ({ text }) => (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 text-center text-sm text-neutral-500">
        {text}
    </div>
);

const capitalize = (str = "") => str.charAt(0).toUpperCase() + str.slice(1);
