import { useEffect, useState } from "react";
import { RotateCcw, Check, X, User, Calendar, CreditCard, AlertCircle } from "lucide-react";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { toast } from "sonner";

const AdminRefunds = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Modal
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchRefundRequests();
    }, [page]);

    const fetchRefundRequests = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/refunds?page=${page}&limit=10`, {
                credentials: "include"
            });
            const data = await res.json();
            if (data.success) {
                setRequests(data.requests);
                setTotalPages(data.totalPages);
            }
        } catch (error) {
            toast.error("Failed to fetch refund requests");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (action, reason = null) => {
        if (!selectedRequest) return;
        setProcessing(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/payments/${selectedRequest._id}/refund`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action, rejectionReason: reason }),
                credentials: "include"
            });
            const data = await res.json();

            if (data.success) {
                toast.success(action === "approve" ? "Refund approved successfully" : "Refund rejected successfully");
                fetchRefundRequests(); // Refresh table
            } else {
                toast.error(data.message || "Action failed");
            }
        } catch (error) {
            toast.error("An error occurred.");
        } finally {
            setProcessing(false);
            setShowRejectModal(false);
            setShowApproveModal(false);
            setSelectedRequest(null);
            setRejectionReason("");
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <header>
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-3">
                    <RotateCcw className="w-6 h-6 text-amber-500" />
                    Refund Requests
                </h1>
                <p className="text-neutral-500 text-sm">Review and manage refund requests from users.</p>
            </header>

            {/* Requests Table */}
            <div className="bg-white dark:bg-[#15151A] rounded-2xl border border-neutral-200 dark:border-white/5 overflow-hidden shadow-sm">
                <div className="overflow-x-auto min-h-[400px]">
                    <div className="grid grid-cols-1 divide-y divide-neutral-100 dark:divide-white/5">
                        {loading ? (
                            <div className="text-center py-20 text-neutral-500">Loading...</div>
                        ) : requests.length === 0 ? (
                            <div className="text-center py-20 text-neutral-500 flex flex-col items-center gap-3">
                                <div className="w-12 h-12 bg-neutral-100 dark:bg-white/5 rounded-full flex items-center justify-center">
                                    <Check className="w-6 h-6 text-neutral-400" />
                                </div>
                                No pending refund requests.
                            </div>
                        ) : (
                            requests.map(req => (
                                <div key={req._id} className="p-6 hover:bg-neutral-50 dark:hover:bg-white/[0.02] flex flex-col md:flex-row gap-6 transition-colors group">
                                    {/* User Info */}
                                    <div className="w-full md:w-64 shrink-0 flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-white/10 flex items-center justify-center overflow-hidden shrink-0">
                                            {req.userId?.image ? (
                                                <img src={req.userId.image} alt={req.userId.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-5 h-5 text-neutral-400" />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-neutral-900 dark:text-white">{req.userId?.name || "Unknown"}</h4>
                                            <p className="text-xs text-neutral-500">{req.userId?.email}</p>
                                            <div className="flex items-center gap-2 mt-2 text-xs font-mono text-neutral-500 bg-neutral-100 dark:bg-white/5 px-2 py-1 rounded w-fit">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(req.refundRequestedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Reason & Amount */}
                                    <div className="flex-1 space-y-4">
                                        <div className="bg-neutral-50 dark:bg-white/5 rounded-xl p-4 border border-neutral-100 dark:border-white/5">
                                            <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-neutral-500">
                                                <AlertCircle className="w-3 h-3" /> User Reason
                                            </div>
                                            <p className="text-sm text-neutral-700 dark:text-neutral-300 italic">
                                                "{req.refundReason}"
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                             <div className="flex items-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                                <CreditCard className="w-4 h-4" />
                                                Order #{req.orderId}
                                             </div>
                                             <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-700"></div>
                                             <div className="font-bold text-neutral-900 dark:text-white">
                                                ₹{(req.amount / 100).toLocaleString()}
                                             </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex md:flex-col gap-3 shrink-0 items-end justify-center md:items-end">
                                        <Button 
                                            text="Approve"
                                            icon={Check}
                                            onClick={() => { setSelectedRequest(req); setShowApproveModal(true); }}
                                            className="bg-emerald-500 hover:bg-emerald-600 text-white border-transparent w-full md:w-32"
                                            size="sm"
                                        />
                                        <Button 
                                            text="Reject"
                                            variant="secondary"
                                            icon={X}
                                            onClick={() => { setSelectedRequest(req); setShowRejectModal(true); }}
                                            className="hover:bg-red-50 hover:text-red-600 border-neutral-200 dark:border-white/10 dark:hover:bg-red-900/20 w-full md:w-32"
                                            size="sm"
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between p-4 border-t border-neutral-200 dark:border-white/5 bg-neutral-50/50 dark:bg-white/[0.02]">
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

            {/* Reject Confirmation Modal */}
            <Modal open={showRejectModal} onClose={() => setShowRejectModal(false)}>
                <div className="">
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                        Reject Refund Request
                    </h2>
                    <p className="text-sm text-neutral-500 mb-4">
                        Please provide a reason for rejecting this refund. This will be sent to the user via email.
                    </p>
                    
                    <textarea 
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Reason for rejection..."
                        className="w-full rounded-xl border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-black/20 p-3 text-sm focus:ring-2 focus:ring-red-500 min-h-[100px] mb-4"
                    />

                    <div className="flex gap-3 justify-end">
                        <Button 
                            variant="secondary" 
                            text="Cancel" 
                            onClick={() => setShowRejectModal(false)} 
                        />
                        <Button 
                            text={processing ? "Rejecting..." : "Confirm Rejection"} 
                            onClick={() => handleAction("reject", rejectionReason)} 
                            disabled={processing || !rejectionReason}
                            className="bg-red-600 hover:bg-red-700 text-white border-transparent"
                        />
                    </div>
                </div>
            </Modal>

            {/* Approve Confirmation Modal */}
            <Modal open={showApproveModal} onClose={() => setShowApproveModal(false)}>
                <div className="text-center">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                        Approve Refund
                    </h2>
                    <p className="text-sm text-neutral-500 mb-6">
                        Are you sure you want to approve this refund for <strong>₹{selectedRequest?.amount / 100}</strong>?
                        <br/>
                        The amount will be refunded to the user's original payment method and their plan will be downgraded immediately.
                    </p>

                    <div className="flex gap-3 justify-center">
                         <Button 
                            variant="secondary" 
                            text="Cancel" 
                            onClick={() => setShowApproveModal(false)} 
                        />
                        <Button 
                            text={processing ? "Processing..." : "Confirm Approval"} 
                            onClick={() => handleAction("approve")} 
                            disabled={processing}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white border-transparent"
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdminRefunds;
