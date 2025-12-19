import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import { BarChart3, TrendingUp, Lock } from "lucide-react";
import { toast } from "sonner";
import ProPaywall from "../components/paywall/ProPaywall";

const Analytics = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

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

    /* -------------------- Loading -------------------- */
    if (loading) {
        return (
            <div className="p-6 space-y-6">
                <Skeleton />
                <Skeleton />
            </div>
        );
    }

    /* -------------------- Pro Required -------------------- */
    if (error === "PRO_REQUIRED") {
        return (
            <ProPaywall
                title="Analytics is a Pro feature"
                description="Get detailed insights on profile views and link clicks."
            />
        );
    }

    /* -------------------- Main View -------------------- */
    return (
        <div className="p-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
                <h1 className="text-2xl font-semibold">Analytics</h1>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                <StatCard label="Profile Views" value={data.profileViews} />
                <StatCard label="Total Link Clicks" value={data.totalClicks} />
            </div>

            {/* Top Links */}
            <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                    Top Links
                </h2>

                {data.topLinks.length === 0 ? (
                    <p className="text-neutral-500 text-sm">
                        No clicks yet. Share your page to start tracking.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {data.topLinks.map((link) => (
                            <div
                                key={link._id}
                                className="
                                    flex justify-between items-center
                                    p-4 rounded-xl
                                    bg-white dark:bg-neutral-900
                                    border border-gray-200 dark:border-gray-800
                                "
                            >
                                <span className="font-medium">
                                    {link.title}
                                </span>
                                <span className="text-sm text-neutral-500">
                                    {link.clicks} clicks
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Analytics;

/* -------------------- Components -------------------- */

const StatCard = ({ label, value }) => (
    <div
        className="
            p-6 rounded-2xl
            bg-white dark:bg-neutral-900
            border border-gray-200 dark:border-gray-800
        "
    >
        <p className="text-sm text-neutral-500">{label}</p>
        <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
);

const Skeleton = () => (
    <div className="h-24 rounded-xl bg-gray-200 dark:bg-neutral-800 animate-pulse" />
);
