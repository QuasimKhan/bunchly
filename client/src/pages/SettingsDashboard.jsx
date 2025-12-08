import { useState } from "react";
import TickBadge from "../components/ui/TickBadge";
import Button from "../components/ui/Button";

export default function SettingsDashboard({ user }) {
    const [section, setSection] = useState("profile");

    const menu = [
        { id: "profile", label: "Profile" },
        { id: "account", label: "Account" },
        { id: "appearance", label: "Appearance" },
        { id: "plan", label: "Plan & Billing" },
        { id: "security", label: "Security" },
        { id: "danger", label: "Danger Zone" },
    ];

    return (
        <div className="flex w-full gap-6">
            {/* Settings Sidebar (inside Dashboard) */}
            <aside className="hidden lg:block w-64 bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-md">
                <h2 className="text-xl font-bold mb-4">Settings</h2>

                <nav className="flex flex-col gap-2">
                    {menu.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setSection(item.id)}
                            className={`
                                text-left px-4 py-2 rounded-xl font-medium transition
                                ${
                                    section === item.id
                                        ? "bg-black text-white dark:bg-white/20"
                                        : "text-neutral-700 dark:text-neutral-400 hover:bg-white/50 dark:hover:bg-white/10"
                                }
                            `}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* MAIN CONTENT - Matches DashboardLayout */}
            <div className="flex-1">
                {/* Title */}
                <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
                    {menu.find((m) => m.id === section)?.label}
                </h1>

                {/* Content */}
                <div className="bg-white dark:bg-neutral-900 p-8 rounded-3xl shadow-xl border border-neutral-200/50 dark:border-neutral-700/50">
                    {section === "profile" && <ProfileSection user={user} />}
                    {section === "account" && <AccountSection user={user} />}
                    {section === "appearance" && (
                        <AppearanceSection user={user} />
                    )}
                    {section === "plan" && <PlanSection user={user} />}
                    {section === "security" && <SecuritySection user={user} />}
                    {section === "danger" && <DangerSection user={user} />}
                </div>
            </div>
        </div>
    );
}

/* ---------------- SECTIONS ---------------- */

function ProfileSection({ user }) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold">Profile Information</h2>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                    Update your personal details.
                </p>
            </div>

            <SettingsField label="Name" value={user.name} />
            <SettingsField label="Username" value={user.username} />
            <SettingsField label="Bio" value={user.bio || "No bio added."} />

            <SettingsField label="Profile Picture">
                <img
                    src={user.image}
                    className="w-20 h-20 rounded-xl shadow-md"
                />
            </SettingsField>

            <SaveButton />
        </div>
    );
}

function AccountSection({ user }) {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Account</h2>

            <SettingsField label="Email" value={user.email} />
            <SettingsField label="Auth Provider" value={user.authProvider} />
            <SettingsField
                label="Verified"
                value={user.isVerified ? "Yes" : "No"}
            />

            <SaveButton />
        </div>
    );
}

function AppearanceSection() {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Appearance</h2>
            <SettingsField label="Theme">
                <select className="px-4 py-2 rounded-lg bg-neutral-200 dark:bg-neutral-800 w-full outline-none">
                    <option>Default</option>
                    <option>Dark</option>
                    <option>Minimal Purple</option>
                    <option>Premium Gold</option>
                </select>
            </SettingsField>
            <SaveButton />
        </div>
    );
}

function PlanSection({ user }) {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
                Current Plan
                <TickBadge tier={user.plan} />
            </h2>

            <SettingsField label="Plan" value={user.plan} />
            <SettingsField label="Billing Status" value="Active" />

            <Button
                text="Upgrade to Premium"
                className="
                    px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white
                    hover:from-purple-500 hover:to-fuchsia-500 transition
                "
            />
        </div>
    );
}

function SecuritySection() {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Security</h2>

            <SettingsField label="Password">
                <Button
                    text="Change Password"
                    className="px-4 py-2 rounded-lg bg-neutral-900 text-white hover:bg-neutral-700"
                />
            </SettingsField>

            <SettingsField
                label="Two-Factor Authentication"
                value="Coming Soon"
            />
            <SaveButton />
        </div>
    );
}

function DangerSection() {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-red-500">Danger Zone</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                These actions cannot be undone.
            </p>

            <Button
                text="Delete My Account"
                className="px-5 py-2 rounded-xl bg-red-600 text-white hover:bg-red-500"
            />
        </div>
    );
}

/* ---------------- Reusable Components ---------------- */

function SettingsField({ label, value, children }) {
    return (
        <div className="space-y-1">
            <div className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {label}
            </div>

            {children ? (
                children
            ) : (
                <div className="px-4 py-2 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white">
                    {value}
                </div>
            )}
        </div>
    );
}

function SaveButton() {
    return (
        <Button
            text="Save Changes"
            className="
                px-6 py-2 mt-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white 
                hover:from-blue-500 hover:to-purple-500 shadow-md
            "
        />
    );
}
