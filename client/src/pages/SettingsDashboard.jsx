import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import TickBadge from "../components/ui/TickBadge";

export default function SettingsDashboard({ user }) {
    const [section, setSection] = useState("account");
    const navigate = useNavigate();

    const menu = [
        { id: "account", label: "Account" },
        { id: "security", label: "Security" },
        { id: "billing", label: "Billing" },
        { id: "danger", label: "Danger" },
    ];

    return (
        <div className="w-full max-w-6xl mx-auto px-4 pb-16">
            {/* ================= HEADER ================= */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
                    Settings
                </h1>
                <p className="text-sm text-neutral-500 mt-1">
                    Manage your account preferences and security
                </p>
            </div>

            {/* ================= MOBILE NAV ================= */}
            <div className="lg:hidden mb-6">
                <div
                    className="
                    grid grid-cols-2 gap-2
                    bg-neutral-100 dark:bg-neutral-800
                    p-2 rounded-xl
                "
                >
                    {menu.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setSection(item.id)}
                            className={`
                                px-3 py-2 rounded-lg text-sm font-medium transition
                                ${
                                    section === item.id
                                        ? "bg-white dark:bg-neutral-900 shadow text-neutral-900 dark:text-white"
                                        : "text-neutral-600 dark:text-neutral-400"
                                }
                            `}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex gap-8">
                {/* ================= DESKTOP SIDEBAR ================= */}
                <aside
                    className="
                    hidden lg:block w-64
                    bg-white/70 dark:bg-white/5
                    backdrop-blur-xl
                    rounded-2xl
                    p-6
                    border border-neutral-200/50 dark:border-white/10
                "
                >
                    <nav className="flex flex-col gap-1">
                        {menu.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setSection(item.id)}
                                className={`
                                    text-left px-4 py-2 rounded-xl text-sm font-medium transition
                                    ${
                                        section === item.id
                                            ? "bg-neutral-900 text-white dark:bg-white/20"
                                            : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/10"
                                    }
                                `}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* ================= CONTENT ================= */}
                <div className="flex-1">
                    <div
                        className="
                        bg-white dark:bg-neutral-900
                        rounded-3xl
                        p-6 sm:p-8
                        border border-neutral-200/50 dark:border-neutral-800
                    "
                    >
                        {section === "account" && (
                            <AccountSection user={user} />
                        )}
                        {section === "security" && <SecuritySection />}
                        {section === "billing" && (
                            <BillingSection user={user} navigate={navigate} />
                        )}
                        {section === "danger" && <DangerSection />}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ================= SECTIONS ================= */

function AccountSection({ user }) {
    return (
        <div className="space-y-6">
            <SectionHeader
                title="Account Information"
                description="Basic details linked to your account."
            />

            <SettingsRow label="Email" value={user.email} />
            <SettingsRow label="Auth Provider" value={user.authProvider} />
            <SettingsRow
                label="Verification"
                value={user.isVerified ? "Verified" : "Not Verified"}
            />
        </div>
    );
}

function SecuritySection() {
    return (
        <div className="space-y-6">
            <SectionHeader
                title="Security"
                description="Protect your account and credentials."
            />

            <SettingsRow label="Password">
                <Button text="Change Password" variant="secondary" />
            </SettingsRow>

            <SettingsRow
                label="Two-Factor Authentication"
                value="Coming soon"
            />
        </div>
    );
}

function BillingSection({ user, navigate }) {
    return (
        <div className="space-y-6">
            <SectionHeader
                title="Billing"
                description="Subscription and payment management."
            />

            <div
                className="
                rounded-xl
                border border-neutral-200 dark:border-neutral-800
                p-5
                flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4
            "
            >
                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-medium capitalize">
                            {user.plan}
                        </span>
                        <TickBadge tier={user.plan} />
                    </div>

                    {user.plan === "pro" && user.planExpiresAt && (
                        <p className="text-xs text-neutral-500 mt-1">
                            Expires on{" "}
                            {new Date(user.planExpiresAt).toDateString()}
                        </p>
                    )}
                </div>

                <Button
                    text="Open Billing"
                    onClick={() => navigate("/billing")}
                />
            </div>
        </div>
    );
}

function DangerSection() {
    return (
        <div className="space-y-6">
            <SectionHeader
                title="Danger Zone"
                description="Permanent actions that cannot be undone."
                danger
            />

            <Button text="Delete Account" variant="danger" />
        </div>
    );
}

/* ================= SMALL REUSABLES ================= */

function SectionHeader({ title, description, danger }) {
    return (
        <div>
            <h2
                className={`text-lg font-semibold ${
                    danger ? "text-red-600" : "text-neutral-900 dark:text-white"
                }`}
            >
                {title}
            </h2>
            <p className="text-sm text-neutral-500 mt-1">{description}</p>
        </div>
    );
}

function SettingsRow({ label, value, children }) {
    return (
        <div className="space-y-1">
            <div className="text-sm font-medium text-neutral-600">{label}</div>

            {children ? (
                children
            ) : (
                <div
                    className="
                    px-4 py-2 rounded-lg
                    bg-neutral-100 dark:bg-neutral-800
                    text-sm
                "
                >
                    {value}
                </div>
            )}
        </div>
    );
}
