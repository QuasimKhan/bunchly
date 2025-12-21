import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import TickBadge from "../components/ui/TickBadge";
import { useAuth } from "../context/AuthContext";
import SmartSkeleton from "../components/ui/SmartSkeleton";
import { buildUrl } from "../lib/seo";
import { useSEO } from "../hooks/useSEO";

const Dashboard = () => {
    useSEO({
        title: "Dashboard – Bunchly",
        description: "Manage your Bunchly account.",
        noIndex: true,
        url: buildUrl("/dashboard"),
    });
    const { user } = useAuth();
    const isPro = user?.plan === "pro";

    // Simulate loading (replace later with real dashboard API)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(t);
    }, []);

    /* ---------------- LOADING ---------------- */
    if (loading) {
        return <SmartSkeleton variant="dashboard" />;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 pb-16 space-y-12">
            {/* ================= HEADER ================= */}
            <div>
                <h1 className="text-3xl font-semibold text-neutral-900 dark:text-white">
                    Welcome back, {user.name?.split(" ")[0]}
                </h1>
                <p className="mt-1 text-sm text-neutral-500">
                    Here’s what’s happening with your Bunchly profile
                </p>
            </div>

            {/* ================= OVERVIEW CARDS ================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* PLAN */}
                <OverviewCard
                    title="Current Plan"
                    value={user.plan}
                    badge={<TickBadge tier={user.plan} />}
                    description={
                        isPro
                            ? "You have full access to premium features"
                            : "Upgrade to unlock analytics & pro tools"
                    }
                >
                    {!isPro && (
                        <Button
                            text="Upgrade to Pro"
                            onClick={() => (window.location.href = "/upgrade")}
                        />
                    )}
                </OverviewCard>

                {/* PROFILE */}
                <OverviewCard
                    title="Profile Status"
                    value={user.isVerified ? "Verified" : "Not Verified"}
                    description={`Username: @${user.username}`}
                >
                    <Button
                        text="Edit Profile"
                        variant="secondary"
                        onClick={() => (window.location.href = "/profile")}
                    />
                </OverviewCard>

                {/* ANALYTICS */}
                <div className="relative rounded-2xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 p-6 overflow-hidden">
                    <p className="text-sm text-neutral-500">Analytics</p>

                    {isPro ? (
                        <>
                            <p className="mt-2 text-xl font-semibold">
                                Live Analytics
                            </p>
                            <p className="text-xs text-neutral-500 mt-1">
                                Track views & clicks in real time
                            </p>

                            <Button
                                text="View Analytics"
                                className="mt-4"
                                onClick={() =>
                                    (window.location.href = "/analytics")
                                }
                            />
                        </>
                    ) : (
                        <>
                            <p className="mt-2 text-xl font-semibold">Locked</p>
                            <p className="text-xs text-neutral-500 mt-1">
                                Analytics are available on Pro
                            </p>

                            <div className="absolute inset-0 bg-white/70 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center">
                                <Button
                                    text="Unlock Analytics"
                                    onClick={() =>
                                        (window.location.href = "/upgrade")
                                    }
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* ================= NEXT STEPS ================= */}
            <div className="rounded-3xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 p-8">
                <h2 className="text-lg font-semibold mb-4">
                    Next steps to grow your profile
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <GrowthCard
                        title="Add your first links"
                        description="Share all your important links in one place."
                        action="Add Link"
                        onClick={() => (window.location.href = "/links")}
                    />

                    <GrowthCard
                        title="Customize appearance"
                        description="Make your profile match your style."
                        action="Customize"
                        onClick={() => (window.location.href = "/appearance")}
                    />

                    <GrowthCard
                        title="Track performance"
                        description="Understand what your audience clicks."
                        action={isPro ? "View Analytics" : "Upgrade"}
                        onClick={() =>
                            (window.location.href = isPro
                                ? "/analytics"
                                : "/upgrade")
                        }
                    />
                </div>
            </div>

            {/* ================= QUICK ACTIONS ================= */}
            <div className="rounded-3xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 p-6">
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Button
                        text="Add New Link"
                        onClick={() => (window.location.href = "/links")}
                    />
                    <Button
                        text="View Billing"
                        variant="secondary"
                        onClick={() => (window.location.href = "/billing")}
                    />
                    <Button
                        text="Account Settings"
                        variant="secondary"
                        onClick={() => (window.location.href = "/settings")}
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

/* ================= SMALL COMPONENTS ================= */

function OverviewCard({ title, value, badge, description, children }) {
    return (
        <div className="rounded-2xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 p-6 space-y-3">
            <p className="text-sm text-neutral-500">{title}</p>
            <div className="flex items-center gap-2">
                <span className="text-xl font-semibold capitalize">
                    {value}
                </span>
                {badge}
            </div>
            <p className="text-xs text-neutral-500">{description}</p>
            {children}
        </div>
    );
}

function GrowthCard({ title, description, action, onClick }) {
    return (
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-2">
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-neutral-500">{description}</p>
            <Button text={action} variant="secondary" onClick={onClick} />
        </div>
    );
}
