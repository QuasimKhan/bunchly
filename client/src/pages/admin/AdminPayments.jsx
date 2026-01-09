import { useEffect, useState } from "react";
import { Search, DollarSign, RotateCcw, ShieldAlert, CheckCircle, XCircle } from "lucide-react";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { toast } from "sonner";

const AdminPayments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Modal
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchPayments();
    }, [page]);

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/payments?page=${page}&limit=10`, {
                credentials: "include"
            });
            const data = await res.json();
            if (data.success) {
                setPayments(data.payments);
                setTotalPages(data.totalPages);
            }
        } catch (error) {
            toast.error("Failed to fetch payments");
        } finally {
            setLoading(false);
        }
    };

    const handleRefundClick = (payment) => {
        setSelectedPayment(payment);
        setShowConfirmModal(true);
    };

    const confirmRefund = async () => {
        if (!selectedPayment) return;
        setProcessing(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/payments/${selectedPayment._id}/refund`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "approve" }),
                credentials: "include"
            });
            const data = await res.json();

            if (data.success) {
                toast.success("Refund processed successfully");
                fetchPayments(); // Refresh table
            } else {
                toast.error(data.message || "Refund failed");
            }
        } catch (error) {
            toast.error("An error occurred while refunding.");
        } finally {
            setProcessing(false);
            setShowConfirmModal(false);
            setSelectedPayment(null);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <header>
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Payments & Refunds</h1>
                <p className="text-neutral-500 text-sm">View transaction history and manage refunds.</p>
            </header>

            {/* Payments Table */}
            <div className="bg-white dark:bg-[#15151A] rounded-2xl border border-neutral-200 dark:border-white/5 overflow-hidden shadow-sm">
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-sm">
                        <thead className="bg-neutral-50 dark:bg-white/5 border-b border-neutral-100 dark:border-white/5">
                            <tr className="text-left text-neutral-500 font-medium">
                                <th className="px-6 py-4">Transaction ID</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 dark:divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-10 text-neutral-500">Loading...</td>
                                </tr>
                            ) : payments.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-10 text-neutral-500">No payments found.</td>
                                </tr>
                            ) : (
                                payments.map(payment => (
                                    <tr key={payment._id} className="hover:bg-neutral-50 dark:hover:bg-white/[0.02]">
                                        <td className="px-6 py-4 font-mono text-xs text-neutral-500">
                                            {payment.paymentId}
                                        </td>
                                        <td className="px-6 py-4">
                                            {payment.userId ? (
                                                <div>
                                                    <div className="font-medium text-neutral-900 dark:text-white">{payment.userId.name}</div>
                                                    <div className="text-xs text-neutral-500">{payment.userId.email}</div>
                                                </div>
                                            ) : (
                                                <span className="text-neutral-400">Unknown User</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-neutral-900 dark:text-white">
                                            ₹{(payment.amount / 100).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-neutral-500">
                                            {new Date(payment.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={payment.status} />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {payment.status === 'paid' && (
                                                <Button 
                                                    size="xs"
                                                    variant="secondary"
                                                    text="Refund"
                                                    icon={RotateCcw}
                                                    onClick={() => handleRefundClick(payment)}
                                                    className="bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 border-transparent h-8"
                                                />
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between p-4 border-t border-neutral-200 dark:border-white/5">
                    <button 
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 disabled:opacity-50 hover:bg-neutral-100 dark:hover:bg-white/5 rounded-lg"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-neutral-500">
                        Page {page} of {totalPages}
                    </span>
                    <button 
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 disabled:opacity-50 hover:bg-neutral-100 dark:hover:bg-white/5 rounded-lg"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Refund Confirmation Modal */}
            <Modal open={showConfirmModal} onClose={() => setShowConfirmModal(false)}>
                <div className="text-center">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                        Confirm Refund
                    </h2>
                    <p className="text-sm text-neutral-500 mt-2 mb-6">
                        Are you sure you want to refund <strong>₹{selectedPayment ? (selectedPayment.amount / 100).toLocaleString() : 0}</strong> to <strong>{selectedPayment?.userId?.name}</strong>?
                        <br/><br/>
                        <span className="text-red-500 font-semibold">This action cannot be undone.</span> The user will be downgraded to the Free plan immediately.
                    </p>
                    <div className="flex gap-3">
                        <Button 
                            variant="secondary" 
                            text="Cancel" 
                            onClick={() => setShowConfirmModal(false)} 
                            fullWidth 
                        />
                        <Button 
                            text={processing ? "Processing..." : "Refund Now"} 
                            onClick={confirmRefund} 
                            disabled={processing}
                            className="bg-red-600 hover:bg-red-700 text-white border-transparent"
                            fullWidth 
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

const StatusBadge = ({ status }) => {
    const styles = {
        paid: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        refunded: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
        failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
    };

    const labels = {
        paid: "Successful",
        refunded: "Refunded",
        failed: "Failed"
    };

    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${styles[status] || styles.failed}`}>
            {labels[status] || status}
        </span>
    );
};

export default AdminPayments;
