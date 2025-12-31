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

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 700);
        return () => clearTimeout(t);
    }, []);

    if (loading) {
        return <SmartSkeleton variant="dashboard" />;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 pb-20 space-y-14">
            {/* ================= HEADER ================= */}
            <header className="space-y-1">
                <h1 className="text-3xl font-semibold text-neutral-900 dark:text-white">
                    Welcome, {user.name?.split(" ")[0]}
                </h1>
                <p className="text-sm text-neutral-500">
                    Manage your profile, links, and account settings
                </p>
            </header>

            {/* ================= SUMMARY ================= */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <SummaryCard
                    label="Plan"
                    value={user.plan}
                    badge={<TickBadge tier={user.plan} />}
                    description={
                        isPro
                            ? "You’re on the Pro plan"
                            : "Upgrade to unlock advanced features"
                    }
                >
                    {!isPro && (
                        <Button
                            text="Upgrade"
                            size="sm"
                            onClick={() =>
                                (window.location.href = "/dashboard/upgrade")
                            }
                        />
                    )}
                </SummaryCard>

                <SummaryCard
                    label="Profile"
                    value={user.isVerified ? "Verified" : "Unverified"}
                    description={`@${user.username}`}
                >
                    <Button
                        text="Edit Profile"
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                            (window.location.href = "/dashboard/profile")
                        }
                    />
                </SummaryCard>

                <SummaryCard
                    label="Analytics"
                    value={isPro ? "Enabled" : "Locked"}
                    description={
                        isPro ? "Track views & clicks" : "Available on Pro"
                    }
                >
                    <Button
                        text={isPro ? "View" : "Unlock"}
                        size="sm"
                        onClick={() =>
                            (window.location.href = isPro
                                ? "/dashboard/analytics"
                                : "/dashboard/upgrade")
                        }
                    />
                </SummaryCard>
            </section>

            {/* ================= NEXT STEPS ================= */}
            <section className="rounded-3xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 p-8">
                <h2 className="text-lg font-semibold mb-6">
                    Get the most out of Bunchly
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <ActionCard
                        title="Add links"
                        description="Share everything with one smart profile."
                        action="Manage Links"
                        onClick={() =>
                            (window.location.href = "/dashboard/links")
                        }
                    />

                    <ActionCard
                        title="Customize profile"
                        description="Personalize appearance and branding."
                        action="Customize"
                        onClick={() =>
                            (window.location.href = "/dashboard/appearance")
                        }
                    />

                    <ActionCard
                        title="Track performance"
                        description="Understand what your audience clicks."
                        action={isPro ? "View Analytics" : "Upgrade"}
                        onClick={() =>
                            (window.location.href = isPro
                                ? "/dashboard/analytics"
                                : "/dashboard/upgrade")
                        }
                    />
                </div>
            </section>

            {/* ================= QUICK ACTIONS ================= */}
            <section className="space-y-4">
                <h2 className="text-lg font-semibold">Quick actions</h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Button
                        text="Add Link"
                        onClick={() =>
                            (window.location.href = "/dashboard/links")
                        }
                    />
                    <Button
                        text="Billing"
                        variant="secondary"
                        onClick={() =>
                            (window.location.href = "/dashboard/billing")
                        }
                    />
                    <Button
                        text="Settings"
                        variant="secondary"
                        onClick={() =>
                            (window.location.href = "/dashboard/settings")
                        }
                    />
                </div>
            </section>
        </div>
    );
};

export default Dashboard;

/* ================= REUSABLE CARDS ================= */

function SummaryCard({ label, value, badge, description, children }) {
    return (
        <div className="rounded-2xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 p-6 space-y-2">
            <p className="text-sm text-neutral-500">{label}</p>

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

function ActionCard({ title, description, action, onClick }) {
    return (
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-3 bg-neutral-50 dark:bg-neutral-900/40">
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-neutral-500">{description}</p>
            <Button
                text={action}
                variant="secondary"
                size="sm"
                onClick={onClick}
            />
        </div>
    );
}
