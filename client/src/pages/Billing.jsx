import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import ProPaywall from "../components/paywall/ProPaywall";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import InputField from "../components/ui/InputField";
import { toast } from "sonner";
import { 
    Receipt, 
    CreditCard, 
    Download, 
    ExternalLink, 
    CheckCircle2, 
    XCircle, 
    Clock,
    Zap,
    AlertCircle,
    HelpCircle
} from "lucide-react";

/* ======================================================
   BILLING PAGE (PRODUCTION)
====================================================== */

const Billing = () => {
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [payments, setPayments] = useState([]);
    const [error, setError] = useState("");
    const [showRefundModal, setShowRefundModal] = useState(false);

    const isPro = user?.plan === "pro";

    useEffect(() => {
        if (!isPro) {
            setLoading(false);
            return;
        }

        const fetchBilling = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/billing`,
                    { credentials: "include" }
                );

                const data = await res.json();

                if (!data.success) {
                    throw new Error(data.message);
                }

                setPayments(data.data || []);
            } catch (err) {
                console.error("[BillingFetchError]", err);
                setError("Unable to load billing history.");
            } finally {
                setLoading(false);
            }
        };

        fetchBilling();
    }, [isPro]);

    /* ---------------- STATES ---------------- */

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-neutral-500 animate-pulse">Loading billing details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-20 text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 dark:text-red-400">
                    <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">Oops! Something went wrong</h3>
                <p className="text-neutral-500 max-w-sm mx-auto">{error}</p>
            </div>
        );
    }

    /* ---------------- LOGIC ---------------- */
    // Helper to check 3-day refund window
    const latestPayment = payments.length > 0 ? payments[0] : null;
    const canRefund = isPro && latestPayment && (Date.now() - new Date(latestPayment.createdAt).getTime() < 3 * 24 * 60 * 60 * 1000);

    return (
        <div className="max-w-5xl mx-auto px-4 pb-20 animate-fade-in-up">
            <BillingHeader />

            <div className="space-y-8">
                <CurrentPlanCard 
                    user={user} 
                    onRequestRefund={() => setShowRefundModal(true)} 
                    canRefund={canRefund}
                />
                <BillingHistory payments={payments} isPro={isPro} />
            </div>

            <RefundModal 
                open={showRefundModal} 
                onClose={() => setShowRefundModal(false)} 
            />
        </div>
    );
};

export default Billing;

/* ======================================================
   SUB COMPONENTS
====================================================== */

function BillingHeader() {
    return (
        <header className="mb-8 pt-6">
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Billing & Subscription
            </h1>
            <p className="mt-2 text-base text-neutral-500">
                Manage your subscription, view payment history, and download invoices.
            </p>
        </header>
    );
}

function CurrentPlanCard({ user, onRequestRefund, canRefund }) {
    const isPro = user.plan === "pro";
    const isExpired = user.plan === "free" && user.planExpiresAt; // Was pro, now expired
    
    // Check if expiring soon (e.g., within 5 days)
    const daysUntilExpiry = user.planExpiresAt 
        ? Math.ceil((new Date(user.planExpiresAt) - new Date()) / (1000 * 60 * 60 * 24)) 
        : null;
    const isExpiringSoon = isPro && daysUntilExpiry !== null && daysUntilExpiry <= 5;

    return (
        <section className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-xl shadow-indigo-500/20 border border-white/10">
             {/* Decorative BG */}
            <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-1/4 -translate-y-1/4 pointer-events-none">
                <Zap className="w-80 h-80" />
            </div>

            <div className="relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
                    <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-3">
                             <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider">
                                {isExpired ? "Plan Expired" : "Current Plan"}
                             </div>
                             {isExpiringSoon && (
                                <div className="px-3 py-1 rounded-full bg-amber-500/80 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider animate-pulse">
                                    Expiring Soon
                                </div>
                             )}
                        </div>
                        
                        <div>
                            <h2 className="text-4xl font-bold flex items-center gap-3">
                                {user.plan === 'pro' ? 'Pro Plan' : 'Free Plan'}
                            </h2>
                            <p className="text-indigo-100 mt-2 max-w-lg text-lg leading-relaxed">
                                {isPro 
                                    ? "You're all set! Enjoy unlimited access to premium themes, advanced analytics, and priority support."
                                    : "Upgrade to Pro to unlock premium themes, deep analytics, and remove branding from your page."
                                }
                            </p>
                        </div>

                        {/* PRO / EXPIRING STATE */}
                        {isPro && user.planExpiresAt && (
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black/20 border border-white/10 backdrop-blur-md">
                                    <Clock className="w-4 h-4 text-indigo-300" />
                                    <span className="text-sm font-medium">Renews on {new Date(user.planExpiresAt).toLocaleDateString()}</span>
                                </div>

                                {canRefund ? (
                                    <button 
                                        onClick={onRequestRefund}
                                        className="text-sm text-indigo-200 hover:text-white underline decoration-indigo-300/50 hover:decoration-white transition-colors cursor-pointer"
                                    >
                                        Request Refund
                                    </button>
                                ) : (
                                    <div className="text-xs text-indigo-300/60 cursor-default" title="Refunds available within 3 days of purchase">
                                        Refund window closed
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {/* Renew Button for Pro Users Expiring Soon */}
                        {isExpiringSoon && (
                             <div className="pt-2">
                                <Button 
                                    text="Renew Plan"
                                    icon={Zap}
                                    onClick={() => window.location.href = "/dashboard/upgrade"} // Or direct to checkout logic
                                    className="bg-white text-indigo-600 hover:bg-indigo-50 border-none font-bold shadow-lg shadow-black/20 cursor-pointer"
                                />
                             </div>
                        )}
                    </div>

                    {/* FREE / EXPIRED STATE */}
                    {!isPro && (
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 max-w-md w-full lg:w-auto">
                            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                                <Receipt className="w-5 h-5" />
                                {isExpired ? "Renew Subscription" : "Unlock Billing History"}
                            </h3>
                            <p className="text-sm text-indigo-100 mb-4">
                                {isExpired 
                                    ? "Your Pro benefits have expired. Renew now to regain access." 
                                    : "Upgrade to Pro to access detailed invoices and payment history."}
                            </p>
                            <Button 
                                text={isExpired ? "Renew Plan" : "Upgrade Now"}
                                className="w-full bg-white text-indigo-600 hover:bg-indigo-50 border-none font-bold cursor-pointer"
                                onClick={() => window.location.href = "/dashboard/upgrade"}
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

function RefundModal({ open, onClose }) {
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/billing/refund`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason }),
                credentials: "include"
            });

            const data = await res.json();

            if (!data.success) {
                throw new Error(data.message);
            }

            toast.success("Refund request sent successfully");
            onClose();
            setReason("");
        } catch (error) {
            toast.error(error.message || "Failed to send request");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <div className="text-center mb-6">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HelpCircle className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Request Refund</h2>
                <p className="text-sm text-neutral-500 mt-2">
                    We're sorry to see you go. Please let us know why you'd like a refund, and our team will review your request.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Reason for refund
                    </label>
                    <textarea 
                        required
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Please modify plan, features didn't match expectation, etc..."
                        className="w-full h-32 px-4 py-3 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-black/20 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                    />
                </div>

                <div className="flex gap-3 pt-2">
                    <Button 
                        type="button"
                        text="Cancel"
                        variant="secondary"
                        onClick={onClose}
                        fullWidth
                        disabled={isSubmitting}
                    />
                    <Button 
                        type="submit"
                        text={isSubmitting ? "Sending..." : "Submit Request"}
                        fullWidth
                        disabled={isSubmitting}
                    />
                </div>
            </form>
        </Modal>
    );
}

function BillingHistory({ payments, isPro }) {
    if (!isPro) return null;

    return (
        <section className="bg-white dark:bg-[#15151A] rounded-3xl border border-neutral-200 dark:border-white/5 shadow-xl shadow-neutral-100/50 dark:shadow-none overflow-hidden">
            <div className="px-8 py-6 border-b border-neutral-100 dark:border-white/5 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                        <Receipt className="w-5 h-5 text-neutral-400" />
                        Billing History
                    </h2>
                    <p className="text-sm text-neutral-500 mt-1">View and download your past invoices.</p>
                </div>
            </div>

            {payments.length === 0 ? (
                <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-neutral-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
                        <Receipt className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-medium text-neutral-900 dark:text-white">No payments found</h3>
                    <p className="text-neutral-500 mt-1">You haven't made any payments yet.</p>
                </div>
            ) : (
                <>
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-neutral-50/50 dark:bg-white/[0.02] border-b border-neutral-100 dark:border-white/5">
                                <tr className="text-left text-neutral-500 font-medium">
                                    <th className="px-8 py-4 w-1/4">Date</th>
                                    <th className="px-8 py-4 w-1/4">Plan</th>
                                    <th className="px-8 py-4 w-1/4">Amount</th>
                                    <th className="px-8 py-4 w-1/4">Status</th>
                                    <th className="px-8 py-4 w-14 text-right">Invoice</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-white/5">
                                {payments.map((p) => (
                                    <tr
                                        key={p._id}
                                        className="hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-colors"
                                    >
                                        <td className="px-8 py-4 font-medium text-neutral-900 dark:text-white">
                                            {new Date(p.createdAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="capitalize px-3 py-1 rounded-full bg-neutral-100 dark:bg-white/10 text-xs font-semibold">
                                                {p.plan}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 font-medium">
                                            ₹{(p.amount / 100).toLocaleString('en-IN')}
                                        </td>
                                        <td className="px-8 py-4">
                                            <StatusBadge status={p.status} />
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            {p.invoiceNumber ? (
                                                <InvoiceLink invoice={p.invoiceNumber} />
                                            ) : (
                                                <span className="text-neutral-300 dark:text-neutral-700">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden divide-y divide-neutral-100 dark:divide-white/5">
                        {payments.map((p) => (
                            <div key={p._id} className="p-6 flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-semibold text-neutral-900 dark:text-white mb-1">
                                            {p.plan.toUpperCase()} Plan
                                        </div>
                                        <div className="text-xs text-neutral-500">
                                            {new Date(p.createdAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                    <StatusBadge status={p.status} />
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-dashed border-neutral-200 dark:border-white/10 mt-2">
                                    <div className="font-bold text-lg text-neutral-900 dark:text-white">
                                        ₹{(p.amount / 100).toLocaleString()}
                                    </div>
                                    
                                    {p.invoiceNumber && (
                                        <InvoiceLink invoice={p.invoiceNumber} iconOnly={false} />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}

/* ======================================================
   HELPERS
====================================================== */

function StatusBadge({ status }) {
    const success = status === "success" || status === "paid";

    return (
        <span
            className={`
                inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                ${
                    success
                        ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                }
            `}
        >
            {success ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
            {status}
        </span>
    );
}

function InvoiceLink({ invoice, iconOnly = true }) {
    return (
        <a
            href={`${import.meta.env.VITE_API_URL}/api/billing/invoice/${invoice}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
            title="Download Invoice"
        >
            <Download className="w-4 h-4" />
            {!iconOnly && "Download Invoice"}
        </a>
    );
}
