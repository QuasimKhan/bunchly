import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import TickBadge from "../components/ui/TickBadge";
import ChangePasswordModal from "../components/profile/ChangePasswordModal";
import { toast } from "sonner";
import api from "../lib/api";
import DeleteAccountModal from "../components/profile/DeleteAccountModal";
import { 
    User, 
    Shield, 
    CreditCard, 
    AlertTriangle, 
    Mail, 
    Fingerprint, 
    CheckCircle2, 
    Key,
    ChevronRight,
    Zap
} from "lucide-react";

export default function SettingsDashboard({ user }) {
    const [section, setSection] = useState("account");
    const navigate = useNavigate();

    const menu = [
        { id: "account", label: "Account", icon: User },
        { id: "security", label: "Security", icon: Shield },
        { id: "billing", label: "Billing", icon: CreditCard },
        { id: "danger", label: "Danger Zone", icon: AlertTriangle },
    ];

    return (
        <div className="w-full max-w-6xl mx-auto px-4 lg:px-8 pb-20">
            {/* ================= HEADER ================= */}
            <div className="mb-8 pt-6">
                <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                    Settings
                </h1>
                <p className="text-base text-neutral-500 mt-2">
                    Manage your preferences, security, and billing details to customize your Bunchly experience.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* ================= SIDEBAR (Desktop) ================= */}
                <aside className="hidden lg:block w-72 shrink-0">
                    <div className="sticky top-24 bg-white dark:bg-[#0F0F14] rounded-2xl border border-neutral-200 dark:border-white/10 p-2 shadow-sm">
                        <nav className="flex flex-col gap-1">
                            {menu.map((item) => {
                                const Icon = item.icon;
                                const active = section === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setSection(item.id)}
                                        className={`
                                            flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                                            ${active 
                                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" 
                                                : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5"
                                            }
                                        `}
                                    >
                                        <Icon className={`w-5 h-5 ${active ? "text-white" : "text-neutral-400"}`} />
                                        {item.label}
                                        {active && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </aside>

                {/* ================= MOBILE NAV (Horizontal Scroll) ================= */}
                <div className="lg:hidden -mx-4 px-4 overflow-x-auto no-scrollbar pb-2">
                    <div className="flex gap-2">
                         {menu.map((item) => {
                            const Icon = item.icon;
                            const active = section === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setSection(item.id)}
                                    className={`
                                        flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap border transition-all
                                        ${active 
                                            ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-black dark:border-white shadow-lg" 
                                            : "bg-white dark:bg-white/5 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-white/10"
                                        }
                                    `}
                                >
                                    <Icon className="w-4 h-4" />
                                    {item.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ================= CONTENT AREA ================= */}
                <div className="flex-1 min-w-0 animate-fade-in-up">
                    <div className="bg-white dark:bg-[#15151A] rounded-3xl p-6 sm:p-10 border border-neutral-200 dark:border-white/5 shadow-xl shadow-neutral-100/50 dark:shadow-none min-h-[500px]">
                        {section === "account" && <AccountSection user={user} />}
                        {section === "security" && <SecuritySection authProvider={user.authProvider} />}
                        {section === "billing" && <BillingSection user={user} navigate={navigate} />}
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
        <div className="space-y-8">
            <SectionHeader
                title="Account Information"
                description="View and manage details linked to your Bunchly profile."
            />

            <div className="grid gap-6">
                <SettingsRow 
                    icon={Mail}
                    label="Email Address" 
                    value={user.email} 
                    helper="Your primary contact email."
                />
                
                <SettingsRow
                    icon={Fingerprint}
                    label="Auth Provider"
                    value={
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-white/10 text-xs font-semibold uppercase tracking-wider">
                           {user.authProvider}
                        </span>
                    }
                    helper="How you sign in to your account."
                />

                <SettingsRow
                    icon={CheckCircle2}
                    label="Verification Status"
                    helper="Ensure your account is verified for full access."
                    value={
                        user.isVerified ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 text-sm font-bold">
                                <CheckCircle2 className="w-4 h-4" /> Verified
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 text-sm font-bold">
                                Pending
                            </span>
                        )
                    }
                />
            </div>
        </div>
    );
}

function SecuritySection({ authProvider }) {
    const isEmailAuth = authProvider === "email";

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [changePasswordModal, setChangePasswordModal] = useState(false);
    const [changePasswordLoading, setChangePasswordLoading] = useState(false);

    const handleChangePassword = async () => {
        if (!isEmailAuth) {
            toast.error("Password change is disabled for Google accounts");
            return;
        }

        if (!oldPassword || !newPassword || newPassword !== confirmPassword) {
            toast.error("Please check your password inputs");
            return;
        }

        setChangePasswordLoading(true);
        try {
            const res = await api.post(
                "/api/user/change-password",
                { oldPassword, newPassword },
                { withCredentials: true }
            );

            if (res.data.success) {
                toast.success(res.data.message);
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setChangePasswordModal(false);
            }
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Failed to change password"
            );
        } finally {
            setChangePasswordLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <SectionHeader
                title="Security Settings"
                description="Keep your account secure with strong credentials."
            />

            <div className="border border-neutral-200 dark:border-white/10 rounded-2xl p-6 bg-neutral-50/50 dark:bg-white/[0.02]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                            <Key className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <h4 className="text-base font-semibold text-neutral-900 dark:text-white">Password</h4>
                            <p className="text-sm text-neutral-500 mt-1">
                                {isEmailAuth ? "Update your password periodically." : "Managed by Google Sign-In."}
                            </p>
                        </div>
                    </div>
                    
                    <Button
                        text="Change Password"
                        variant="secondary"
                        disabled={!isEmailAuth}
                        onClick={() => isEmailAuth && setChangePasswordModal(true)}
                        className="shrink-0"
                    />
                </div>
            </div>

            <SettingsRow
                icon={Shield}
                label="Two-Factor Authentication"
                value={<span className="text-xs font-mono bg-neutral-100 dark:bg-white/10 px-2 py-1 rounded">COMING SOON</span>}
                helper="Add an extra layer of security to your account."
            />

            <ChangePasswordModal
                open={changePasswordModal}
                onClose={() => setChangePasswordModal(false)}
                onConfirm={handleChangePassword}
                loading={changePasswordLoading}
                oldPassword={oldPassword}
                newPassword={newPassword}
                confirmPassword={confirmPassword}
                setOldPassword={setOldPassword}
                setNewPassword={setNewPassword}
                setConfirmPassword={setConfirmPassword}
            />
        </div>
    );
}

function BillingSection({ user, navigate }) {
    return (
        <div className="space-y-8">
            <SectionHeader
                title="Billing & Subscription"
                description="Manage your subscription plan and billing details."
            />

            <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-xl shadow-indigo-500/20">
                {/* Decorative BG */}
                <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                    <Zap className="w-64 h-64" />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                             <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider">
                                Current Plan
                             </div>
                        </div>
                        <h3 className="text-3xl font-bold mb-2 flex items-center gap-3">
                            {user.plan === 'pro' ? 'Pro Plan' : 'Free Plan'}
                            <TickBadge tier={user.plan} />
                        </h3>
                        <p className="text-indigo-100 max-w-sm text-sm leading-relaxed">
                            {user.plan === 'pro' 
                                ? "You have access to all premium features including analytics, custom themes, and unlimited links."
                                : "Upgrade to Pro to unlock premium themes, deep analytics, and remove branding."
                            }
                        </p>
                        
                        {user.plan === "pro" && user.planExpiresAt && (
                            <div className="flex items-center gap-2 mt-4 text-xs font-mono bg-black/20 w-fit px-3 py-1.5 rounded-lg border border-white/10">
                                <CreditCard className="w-3.5 h-3.5 opacity-70" />
                                <span>Renews on {new Date(user.planExpiresAt).toLocaleDateString()}</span>
                            </div>
                        )}
                    </div>

                    <div className="shrink-0">
                         <Button
                            text={user.plan === 'pro' ? "Manage Billing" : "Upgrade to Pro"}
                            onClick={() => navigate(user.plan === 'pro' ? "/dashboard/billing" : "/dashboard/upgrade")}
                            className="bg-white text-indigo-600 hover:bg-neutral-50 border-none shadow-lg shadow-black/10 !py-3 !px-6 text-sm"
                        />
                    </div>
                </div>
            </div>
            
             <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5">
                    <h4 className="text-sm font-semibold mb-1">Payment Method</h4>
                    <p className="text-xs text-neutral-500">Manage your credit cards and payment preferences.</p>
                </div>
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5">
                    <h4 className="text-sm font-semibold mb-1">Billing History</h4>
                    <p className="text-xs text-neutral-500">View and download past invoices.</p>
                </div>
            </div>
        </div>
    );
}

function DangerSection() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDeleteAccount = async () => {
        setLoading(true);
        try {
            const res = await api.delete("/api/user/delete", {
                withCredentials: true,
            });

            if (res.data.success) {
                toast.success("Account deleted successfully");

                // logout & redirect
                setTimeout(() => {
                    window.location.href = "/login";
                }, 800);
            } else {
                toast.error(res.data.message || "Unable to delete account");
            }
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Failed to delete account"
            );
        } finally {
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <div className="space-y-8">
            <SectionHeader
                title="Danger Zone"
                description="Irreversible actions regarding your account."
                danger
            />

            <div className="border border-red-200 dark:border-red-900/30 rounded-2xl p-6 bg-red-50/50 dark:bg-red-900/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h4 className="text-base font-bold text-red-700 dark:text-red-400 mb-1">Delete Account</h4>
                        <p className="text-sm text-red-600/70 dark:text-red-400/70 max-w-md leading-relaxed">
                            Once you delete your account, there is no going back. All your links, data, and analytics will be permanently removed.
                        </p>
                    </div>
                    <Button
                        text="Delete Account"
                        variant="danger"
                        onClick={() => setOpen(true)}
                        className="shrink-0"
                    />
                </div>
            </div>

            <DeleteAccountModal
                open={open}
                loading={loading}
                onClose={() => setOpen(false)}
                onConfirm={handleDeleteAccount}
            />
        </div>
    );
}

/* ================= SMALL REUSABLES ================= */

function SectionHeader({ title, description, danger }) {
    return (
        <div className="mb-6 border-b border-neutral-100 dark:border-white/5 pb-6">
            <h2
                className={`text-xl font-bold tracking-tight ${
                    danger ? "text-red-600" : "text-neutral-900 dark:text-white"
                }`}
            >
                {title}
            </h2>
            <p className="text-sm text-neutral-500 mt-1">{description}</p>
        </div>
    );
}

function SettingsRow({ icon: Icon, label, value, helper, children }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-neutral-200 dark:border-white/5 hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-colors relative group">
            <div className="flex items-start gap-4">
                 {Icon && (
                    <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-white/10 flex items-center justify-center text-neutral-500 dark:text-neutral-400 shrink-0">
                        <Icon className="w-5 h-5" />
                    </div>
                )}
                <div>
                    <div className="text-sm font-semibold text-neutral-900 dark:text-white">{label}</div>
                    {helper && <div className="text-xs text-neutral-500 mt-0.5">{helper}</div>}
                </div>
            </div>

            <div className="pl-14 sm:pl-0">
                {children ? (
                    children
                ) : (
                    <div className="text-sm font-medium text-neutral-900 dark:text-neutral-200">
                        {value}
                    </div>
                )}
            </div>
        </div>
    );
}
