import { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import Button from "../ui/Button";

export default function RefundModal({ open, onClose, onConfirm, loading }) {
    const [reason, setReason] = useState("");
    const [otherReason, setOtherReason] = useState("");

    if (!open) return null;

    const handleSubmit = () => {
        const finalReason = reason === "Other" ? otherReason : reason;
        if (!finalReason) return;
        onConfirm(finalReason);
    };

    const reasons = [
        "Accidental purchase",
        "Forgot to cancel subscription",
        "Not satisfied with the features",
        "Found a better alternative",
        "Technical issues",
        "Other"
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-[#18181B] w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border border-neutral-200 dark:border-white/10 animate-scale-in">
                
                {/* Header */}
                <div className="px-6 py-5 border-b border-neutral-100 dark:border-white/5 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Request a Refund</h3>
                        <p className="text-sm text-neutral-500 mt-1">We're sorry to see you go.</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors text-neutral-500"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 rounded-xl p-4 flex gap-3 text-sm text-amber-800 dark:text-amber-200">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p>
                            Refunds are processed manually and may take 5-7 business days. 
                            Your Pro plan access will be revoked immediately upon approval.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-semibold text-neutral-900 dark:text-white block">
                            Why are you requesting a refund?
                        </label>
                        <div className="grid gap-2">
                            {reasons.map((r) => (
                                <label 
                                    key={r}
                                    className={`
                                        flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all
                                        ${reason === r 
                                            ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 shadow-sm" 
                                            : "border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                                        }
                                    `}
                                >
                                    <input 
                                        type="radio" 
                                        name="refund-reason" 
                                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-neutral-300"
                                        checked={reason === r}
                                        onChange={() => setReason(r)}
                                    />
                                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{r}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {reason === "Other" && (
                        <div className="animate-fade-in-up">
                            <label className="text-sm font-semibold text-neutral-900 dark:text-white block mb-2">
                                Please specify
                            </label>
                            <textarea
                                value={otherReason}
                                onChange={(e) => setOtherReason(e.target.value)}
                                placeholder="Tell us more completely..."
                                className="w-full rounded-xl border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-black/20 p-3 text-sm focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-neutral-50 dark:bg-black/20 flex justify-end gap-3 rounded-b-2xl">
                    <Button 
                        text="Cancel" 
                        variant="secondary" 
                        onClick={onClose}
                        className="!px-6"
                    />
                    <Button 
                        text="Submit Request" 
                        onClick={handleSubmit}
                        loading={loading}
                        disabled={!reason || (reason === "Other" && !otherReason)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white !px-6 shadow-lg shadow-indigo-500/20"
                    />
                </div>
            </div>
        </div>
    );
}
