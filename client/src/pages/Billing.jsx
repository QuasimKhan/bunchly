import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import ProPaywall from "../components/paywall/ProPaywall";

/* ======================================================
   BILLING PAGE (PRODUCTION)
====================================================== */

const Billing = () => {
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [payments, setPayments] = useState([]);
    const [error, setError] = useState("");

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
            <div className="max-w-5xl mx-auto px-4 py-10 text-sm text-neutral-500">
                Loading billing details…
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-10 text-sm text-red-600">
                {error}
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 pb-20">
            <BillingHeader />

            <CurrentPlanCard user={user} />

            <BillingHistory payments={payments} isPro={isPro} />
        </div>
    );
};

export default Billing;

/* ======================================================
   SUB COMPONENTS
====================================================== */

function BillingHeader() {
    return (
        <header className="mb-8">
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white">
                Billing
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
                Manage your subscription, invoices, and payments
            </p>
        </header>
    );
}

function CurrentPlanCard({ user }) {
    const isPro = user.plan === "pro";

    return (
        <section
            className="
                mb-10
                rounded-2xl
                border border-neutral-200 dark:border-neutral-800
                bg-white dark:bg-neutral-900
                p-6
            "
        >
            <p className="text-sm text-neutral-500">Current Plan</p>

            <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                    <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                        {user.plan.toUpperCase()}
                    </p>

                    {isPro && user.planExpiresAt && (
                        <p className="text-xs text-neutral-500 mt-1">
                            Expires on{" "}
                            {new Date(user.planExpiresAt).toDateString()}
                        </p>
                    )}

                    {!isPro && (
                        <p className="mt-3 text-sm text-neutral-500 max-w-md">
                            Upgrade to Pro to unlock invoices, analytics, and
                            premium features.
                        </p>
                    )}
                </div>

                {!isPro && (
                    <div
                        className="
                            w-full md:w-[360px]
                            rounded-xl
                            border border-indigo-200 dark:border-indigo-900
                            bg-indigo-50/70 dark:bg-indigo-900/10
                            p-4
                        "
                    >
                        <ProPaywall
                            title="Billing is a Pro feature"
                            description="Access invoices, payment history, and subscription management."
                        />
                    </div>
                )}
            </div>
        </section>
    );
}

function BillingHistory({ payments, isPro }) {
    if (!isPro) return null;

    return (
        <section
            className="
                rounded-2xl
                border border-neutral-200 dark:border-neutral-800
                bg-white dark:bg-neutral-900
                overflow-hidden
            "
        >
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    Billing History
                </h2>
            </div>

            {payments.length === 0 ? (
                <div className="p-6 text-sm text-neutral-500">
                    No billing records yet.
                </div>
            ) : (
                <>
                    {/* Desktop */}
                    <div className="hidden md:block">
                        <table className="w-full text-sm">
                            <thead className="bg-neutral-50 dark:bg-neutral-800">
                                <tr className="text-left text-neutral-500">
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Plan</th>
                                    <th className="p-4">Amount</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Invoice</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((p) => (
                                    <tr
                                        key={p._id}
                                        className="border-t border-neutral-200 dark:border-neutral-800"
                                    >
                                        <td className="p-4">
                                            {new Date(
                                                p.createdAt
                                            ).toDateString()}
                                        </td>
                                        <td className="p-4">
                                            {p.plan.toUpperCase()}
                                        </td>
                                        <td className="p-4">
                                            ₹{(p.amount / 100).toFixed(0)}
                                        </td>
                                        <td className="p-4">
                                            <StatusBadge status={p.status} />
                                        </td>
                                        <td className="p-4 text-right">
                                            {p.invoiceNumber ? (
                                                <InvoiceLink
                                                    invoice={p.invoiceNumber}
                                                />
                                            ) : (
                                                <span className="text-neutral-400">
                                                    —
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile */}
                    <div className="md:hidden divide-y divide-neutral-200 dark:divide-neutral-800">
                        {payments.map((p) => (
                            <div key={p._id} className="p-4 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">
                                        {p.plan.toUpperCase()}
                                    </span>
                                    <StatusBadge status={p.status} />
                                </div>

                                <div className="text-sm text-neutral-500">
                                    {new Date(p.createdAt).toDateString()}
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">
                                        ₹{(p.amount / 100).toFixed(0)}
                                    </span>

                                    {p.invoiceNumber && (
                                        <InvoiceLink
                                            invoice={p.invoiceNumber}
                                        />
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
    const success = status === "success";

    return (
        <span
            className={`
                inline-flex px-2 py-1 rounded-full text-xs font-medium
                ${
                    success
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }
            `}
        >
            {status.toUpperCase()}
        </span>
    );
}

function InvoiceLink({ invoice }) {
    return (
        <a
            href={`${
                import.meta.env.VITE_API_URL
            }/api/billing/invoice/${invoice}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
        >
            Download
        </a>
    );
}
