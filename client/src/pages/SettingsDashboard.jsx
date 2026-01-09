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
                                            flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all w-full text-left cursor-pointer group
                                            ${active 
                                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" 
                                                : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5"
                                            }
                                        `}
                                    >
                                        <Icon className={`w-5 h-5 transition-colors ${active ? "text-white" : "text-neutral-400 group-hover:text-indigo-500"}`} />
                                        {item.label}
                                        {active && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </aside>

                {/* ================= MOBILE NAV (Horizontal Scroll) ================= */}
                <div className="lg:hidden sticky top-[70px] z-20 -mx-4 px-4 overflow-x-auto no-scrollbar pb-4 pt-2 bg-neutral-50/95 dark:bg-[#0C0C0E]/95 backdrop-blur-sm border-b border-neutral-200/50 dark:border-white/5 mb-6">
                    <div className="flex gap-2 min-w-max">
                         {menu.map((item) => {
                            const Icon = item.icon;
                            const active = section === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setSection(item.id)}
                                    className={`
                                        flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition-all cursor-pointer select-none
                                        ${active 
                                            ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20" 
                                            : "bg-white dark:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
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

/* ================= BILLING SECTION ================= */

import RefundModal from "../components/profile/RefundModal";
import { useEffect } from "react";
import { RotateCcw, XCircle } from "lucide-react";

function BillingSection({ user, navigate }) {
    const [refundModal, setRefundModal] = useState(false);
    const [refundLoading, setRefundLoading] = useState(false);
    const [latestPayment, setLatestPayment] = useState(null);
    const [loadingHistory, setLoadingHistory] = useState(true);

    // Fetch billing history to check refund eligibility
    useEffect(() => {
        async function fetchHistory() {
            try {
                const res = await api.get("/api/billing", { withCredentials: true });
                if (res.data.success && res.data.data.length > 0) {
                     // Check for the most recent PRO payment
                    const lastProPayment = res.data.data.find(p => p.plan === 'pro' && p.status !== 'failed');
                    setLatestPayment(lastProPayment);
                }
            } catch (err) {
                console.error("Failed to fetch billing", err);
            } finally {
                setLoadingHistory(false);
            }
        }
        if (user.plan === "pro") {
            fetchHistory();
        } else {
            setLoadingHistory(false);
        }
    }, [user.plan]);

    const handleRequestRefund = async (reason) => {
        setRefundLoading(true);
        try {
            const res = await api.post("/api/billing/refund", 
                { reason }, 
                { withCredentials: true }
            );
            if (res.data.success) {
                toast.success("Refund request submitted successfully");
                setRefundModal(false);
                // Update local state to reflect change immediately
                setLatestPayment(prev => ({ ...prev, status: "refund_requested" }));
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to submit request");
        } finally {
            setRefundLoading(false);
        }
    };

    const renderRefundStatus = () => {
        if (!latestPayment) return null;

        // Calculate days since purchase
        const purchaseDate = new Date(latestPayment.createdAt);
        const now = new Date();
        const diffTime = Math.abs(now - purchaseDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const isWithinWindow = diffDays <= 3;
        
        const { status, refundRequestStatus } = latestPayment;

        // 1. Approved (Check new field OR if status was somehow updated in old logic)
        if (refundRequestStatus === "approved" || status === "refunded") {
             return (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900/10 dark:bg-white/10 rounded-lg border border-neutral-900/10 dark:border-white/10 text-neutral-600 dark:text-neutral-300 text-xs font-bold uppercase tracking-wider mt-4 sm:mt-0 w-full sm:w-auto justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                    Refund Processed
                </div>
            );
        }

        // 2. Pending Request
        if (refundRequestStatus === "requested" || status === "refund_requested") {
             return (
                <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 rounded-lg border border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm font-semibold mt-4 sm:ml-auto sm:mt-0 w-full sm:w-auto justify-center cursor-default">
                    <RotateCcw className="w-4 h-4 animate-spin-slow" />
                    Refund Applied
                </div>
            );
        }

        // 3. Rejected
        if (refundRequestStatus === "rejected" || status === "refund_rejected") {
             // If still within window, allow retry
            if (isWithinWindow) {
                return (
                     <div className="flex flex-col sm:items-end gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
                        <div className="px-3 py-1 bg-red-500/10 rounded text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider">
                            Refund Rejected
                        </div>
                        <Button 
                            text="Apply Again" 
                            variant="soft"
                            onClick={() => setRefundModal(true)}
                            className="bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 !py-2 !h-8 text-xs"
                        />
                    </div>
                );
            } else {
                 // Window expired
                 return (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 rounded-lg border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider mt-4 sm:mt-0 w-full sm:w-auto justify-center cursor-not-allowed opacity-70">
                        <XCircle className="w-4 h-4" />
                        Refund Rejected
                    </div>
                );
            }
        }

        // 4. Default: Button available if within window
        if (status === "paid" && isWithinWindow) {
             return (
                <div className="mt-4 sm:mt-0 w-full sm:w-auto">
                    <button 
                        onClick={() => setRefundModal(true)}
                        className="text-white/70 hover:text-white text-xs font-medium underline underline-offset-4 transition-colors cursor-pointer"
                    >
                        Request Refund
                    </button>
                </div>
            );
        }

        return null;
    };


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
                        <div className="flex items-center gap-3 mb-3">
                             <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider">
                                Current Plan
                             </div>
                             {user.plan === 'pro' && (
                                <div className="px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-100 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Active
                                </div>
                             )}
                        </div>
                        <h3 className="text-3xl font-bold mb-3 flex items-center gap-3">
                            {user.plan === 'pro' ? 'Pro Plan' : 'Free Plan'}
                            <TickBadge tier={user.plan} />
                        </h3>
                        <p className="text-indigo-100 max-w-sm text-sm leading-relaxed mb-4 md:mb-0">
                            {user.plan === 'pro' 
                                ? "You have access to all premium features including analytics, custom themes, and unlimited links."
                                : "Upgrade to Pro to unlock premium themes, deep analytics, and remove branding."
                            }
                        </p>
                        
                        {user.plan === "pro" && user.planExpiresAt && (
                            <div className="flex flex-col sm:flex-row gap-3 mt-4">
                                <div className="flex items-center gap-2 text-xs font-mono bg-black/20 w-fit px-3 py-1.5 rounded-lg border border-white/10 text-indigo-100">
                                    <CreditCard className="w-3.5 h-3.5 opacity-70" />
                                    <span>Renews on {new Date(user.planExpiresAt).toLocaleDateString()}</span>
                                </div>
                                
                                {/* Refund Status / Button */}
                                {!loadingHistory && renderRefundStatus()}
                            </div>
                        )}
                    </div>

                    <div className="shrink-0 pt-2 md:pt-0">
                         <Button
                            text={user.plan === 'pro' ? "Manage Billing" : "Upgrade to Pro"}
                            onClick={() => navigate(user.plan === 'pro' ? "/dashboard/billing" : "/dashboard/upgrade")}
                            className="bg-white text-indigo-600 hover:bg-neutral-50 border-none shadow-lg shadow-black/10 !py-3 !px-8 text-sm font-semibold cursor-pointer w-full md:w-auto"
                        />
                    </div>
                </div>
            </div>

            <RefundModal 
                open={refundModal}
                onClose={() => setRefundModal(false)}
                onConfirm={handleRequestRefund}
                loading={refundLoading}
            />
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-neutral-200 dark:border-white/5 bg-white dark:bg-white/[0.01] hover:bg-neutral-50 dark:hover:bg-white/[0.03] transition-colors relative group">
            <div className="flex items-start gap-4">
                 {Icon && (
                    <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-white/5 flex items-center justify-center text-neutral-500 dark:text-neutral-400 shrink-0 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        <Icon className="w-5 h-5" />
                    </div>
                )}
                <div className="flex-1">
                    <div className="text-sm font-semibold text-neutral-900 dark:text-white">{label}</div>
                    {helper && <div className="text-xs text-neutral-500 mt-1 max-w-sm leading-relaxed">{helper}</div>}
                </div>
            </div>

            <div className="w-full sm:w-auto pt-2 sm:pt-0 sm:text-right">
                {children ? (
                    children
                ) : (
                    <div className="text-sm font-medium text-neutral-900 dark:text-neutral-200 select-text break-all">
                        {value}
                    </div>
                )}
            </div>
        </div>
    );
}
