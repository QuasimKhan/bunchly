import React from "react";

/* ==================================================
   BASE BLOCK (DO NOT TOUCH FREQUENTLY)
================================================== */

function Block({ className = "", rounded = "rounded-lg" }) {
    return (
        <div
            aria-hidden
            className={`
                animate-pulse
                bg-neutral-200 dark:bg-neutral-800
                ${rounded}
                ${className}
            `}
        />
    );
}

/* ==================================================
   COMMON SMALL PIECES
================================================== */

const HeaderBlock = () => (
    <div className="space-y-2">
        <Block className="h-8 w-48" />
        <Block className="h-4 w-64" />
    </div>
);

const ButtonBlock = () => <Block className="h-10 w-full rounded-xl" />;

/* ==================================================
   VARIANTS (CORE PAGES)
================================================== */

function DashboardVariant() {
    return (
        <div className="max-w-6xl mx-auto px-4 space-y-10">
            <HeaderBlock />

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div
                        key={i}
                        className="rounded-2xl border bg-white dark:bg-neutral-900 p-5 space-y-3"
                    >
                        <Block className="h-3 w-24" />
                        <Block className="h-8 w-20" />
                        <Block className="h-3 w-32" />
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl border p-6 space-y-4">
                <Block className="h-5 w-40" />
                <ButtonBlock />
            </div>
        </div>
    );
}

function BillingVariant() {
    return (
        <div className="max-w-5xl mx-auto px-4 space-y-8">
            <HeaderBlock />

            {/* Plan */}
            <div className="rounded-2xl border p-6 space-y-4">
                <Block className="h-4 w-24" />
                <Block className="h-6 w-32" />
                <Block className="h-4 w-48" />
            </div>

            {/* History */}
            <div className="rounded-2xl border overflow-hidden">
                <div className="p-4 border-b">
                    <Block className="h-4 w-40" />
                </div>
                <div className="space-y-4 p-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Block key={i} className="h-5 w-full" />
                    ))}
                </div>
            </div>
        </div>
    );
}

function ProfileVariant() {
    return (
        <div className="max-w-4xl mx-auto px-4 space-y-8">
            {/* Header */}
            <div className="flex items-center gap-6">
                <Block className="h-24 w-24 rounded-2xl" />
                <div className="space-y-2">
                    <Block className="h-6 w-40" />
                    <Block className="h-4 w-32" />
                </div>
            </div>

            {/* Fields */}
            <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Block key={i} className="h-12 w-full rounded-xl" />
                ))}
            </div>
        </div>
    );
}

function SettingsVariant() {
    return (
        <div className="max-w-5xl mx-auto px-4 space-y-8">
            <HeaderBlock />
            {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-2xl border p-6 space-y-3">
                    <Block className="h-4 w-32" />
                    <Block className="h-10 w-full" />
                </div>
            ))}
        </div>
    );
}

function AnalyticsVariant() {
    return (
        <div className="max-w-6xl mx-auto px-4 space-y-10">
            <HeaderBlock />

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="rounded-2xl border p-6 space-y-4">
                        <Block className="h-4 w-32" />
                        <Block className="h-48 w-full rounded-xl" />
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ==================================================
   SMALLER / GENERIC VARIANTS
================================================== */

function TableVariant({ rows = 5 }) {
    return (
        <div className="rounded-xl border overflow-hidden">
            <div className="p-4 border-b">
                <Block className="h-4 w-32" />
            </div>
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="grid grid-cols-5 gap-4 p-4 border-b">
                    <Block className="h-4 w-24" />
                    <Block className="h-4 w-20" />
                    <Block className="h-4 w-16" />
                    <Block className="h-4 w-20" />
                    <Block className="h-4 w-16 ml-auto" />
                </div>
            ))}
        </div>
    );
}

function ListVariant({ items = 6 }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: items }).map((_, i) => (
                <Block key={i} className="h-12 w-full rounded-xl" />
            ))}
        </div>
    );
}

function ModalVariant() {
    return (
        <div className="rounded-3xl border p-8 space-y-4">
            <Block className="h-6 w-40" />
            <Block className="h-4 w-full" />
            <Block className="h-10 w-full rounded-xl" />
        </div>
    );
}

function TextVariant({ lines = 3 }) {
    return (
        <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => (
                <Block key={i} className="h-4 w-full" />
            ))}
        </div>
    );
}

/* ==================================================
   MAIN EXPORT (SMART SWITCH)
================================================== */

export default function SmartSkeleton({
    variant = "text",
    rows,
    items,
    lines,
}) {
    switch (variant) {
        case "dashboard":
            return <DashboardVariant />;

        case "billing":
            return <BillingVariant />;

        case "profile":
            return <ProfileVariant />;

        case "settings":
            return <SettingsVariant />;

        case "analytics":
            return <AnalyticsVariant />;

        case "table":
            return <TableVariant rows={rows} />;

        case "list":
            return <ListVariant items={items} />;

        case "modal":
            return <ModalVariant />;

        case "text":
        default:
            return <TextVariant lines={lines} />;
    }
}
