import { useEffect, useState } from "react";
import { BarChart3, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import ProPaywall from "../components/paywall/ProPaywall";
import SmartSkeleton from "../components/ui/SmartSkeleton";

const Analytics = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/analytics`,
                    { credentials: "include" }
                );

                const result = await res.json();

                if (!result.success) {
                    if (result.code === "PRO_REQUIRED") {
                        setError("PRO_REQUIRED");
                    } else {
                        setError("FAILED");
                        toast.error("Failed to load analytics");
                    }
                } else {
                    setData(result.data);
                }
            } catch {
                setError("FAILED");
                toast.error("Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

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

    /* ---------------- MAIN ---------------- */
    return (
        <div className="max-w-6xl mx-auto px-4 pb-20 space-y-12">
            {/* Header */}
            <header className="space-y-1">
                <div className="flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-indigo-600" />
                    <h1 className="text-2xl font-semibold">Analytics</h1>
                </div>
                <p className="text-sm text-neutral-500">
                    Insights into how your profile is performing
                </p>
            </header>

            {/* KPI Row */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <KpiCard
                    label="Profile Views"
                    value={data.profileViews}
                    hint="Total visits to your profile"
                />
                <KpiCard
                    label="Link Clicks"
                    value={data.totalClicks}
                    hint="Total clicks across all links"
                />
            </section>

            {/* Top Links */}
            <section className="space-y-4">
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-lg font-semibold">
                        Top performing links
                    </h2>
                </div>

                {data.topLinks.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                        {data.topLinks.map((link) => (
                            <LinkRow key={link._id} link={link} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Analytics;

/* ================= COMPONENTS ================= */

const KpiCard = ({ label, value, hint }) => (
    <div className="rounded-2xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 p-6">
        <p className="text-sm text-neutral-500">{label}</p>
        <p className="mt-2 text-3xl font-semibold">{value}</p>
        <p className="mt-1 text-xs text-neutral-500">{hint}</p>
    </div>
);

const LinkRow = ({ link }) => (
    <div
        className="
            flex items-center justify-between
            px-5 py-4
            border-b last:border-b-0
            border-neutral-200 dark:border-neutral-800
            bg-white dark:bg-neutral-900
        "
    >
        <div className="min-w-0">
            <p className="font-medium truncate">{link.title}</p>
            <p className="text-xs text-neutral-500 truncate">{link.url}</p>
        </div>

        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {link.clicks} clicks
        </span>
    </div>
);

const EmptyState = () => (
    <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 text-center">
        <p className="font-medium mb-1">No activity yet</p>
        <p className="text-sm text-neutral-500">
            Share your profile link to start tracking views and clicks.
        </p>
    </div>
);
