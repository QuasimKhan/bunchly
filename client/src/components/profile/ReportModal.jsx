import { useState } from "react";
import { X, Flag, ChevronRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../ui/Button";
import axios from "axios";
import { toast } from "sonner";

const REASONS = [
    { id: "spam", label: "Spam or Scam" },
    { id: "inappropriate", label: "Inappropriate Content" },
    { id: "harassment", label: "Harassment or Bullying" },
    { id: "impersonation", label: "Impersonation" },
    { id: "other", label: "Other issue" }
];

const ReportModal = ({ user, onClose }) => {
    const [step, setStep] = useState(1);
    const [reason, setReason] = useState(null);
    const [details, setDetails] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/reports`, {
                username: user.username,
                reason,
                details,
                reporterEmail: email
            });
            toast.success("Report submitted. Thank you for keeping Bunchly safe.");
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit report");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
                onClick={onClose}
            />
            
            <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-white/20 dark:border-white/5"
            >
                {/* Header */}
                <div className="bg-neutral-50 dark:bg-neutral-800/50 p-6 border-b border-neutral-100 dark:border-white/5 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                             <Flag className="w-5 h-5 text-red-500" />
                             Report Profile
                        </h3>
                        <p className="text-xs text-neutral-500 mt-1">
                             @{user.username}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-neutral-200 dark:hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5 text-neutral-500" />
                    </button>
                </div>

                <div className="p-6">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div 
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-3"
                            >
                                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-4">
                                    Why are you reporting this profile?
                                </p>
                                {REASONS.map((r) => (
                                    <button
                                        key={r.id}
                                        onClick={() => { setReason(r.id); setStep(2); }}
                                        className="w-full flex items-center justify-between p-4 rounded-xl text-left bg-neutral-50 dark:bg-white/5 hover:bg-neutral-100 dark:hover:bg-white/10 border border-transparent hover:border-neutral-200 dark:hover:border-white/10 transition-all group"
                                    >
                                        <span className="font-medium text-neutral-700 dark:text-neutral-200">{r.label}</span>
                                        <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                                    </button>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <button 
                                    onClick={() => setStep(1)}
                                    className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1 mb-2"
                                >
                                    ← Back
                                </button>
                                
                                <div className="p-3 bg-red-50 dark:bg-red-500/10 rounded-xl border border-red-100 dark:border-red-500/20 mb-4">
                                    <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-widest block mb-1">Reason</span>
                                    <span className="text-sm font-medium text-red-900 dark:text-red-200">
                                        {REASONS.find(r => r.id === reason)?.label}
                                    </span>
                                </div>

                                <label className="block space-y-2">
                                    <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Contact Email <span className="text-red-500">*</span></span>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full p-3 rounded-xl bg-neutral-100 dark:bg-black/50 border border-neutral-200 dark:border-white/10 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-neutral-400"
                                        placeholder="your@email.com"
                                        required
                                    />
                                    <p className="text-xs text-neutral-500">We'll notify you when we review this report.</p>
                                </label>

                                <label className="block space-y-2">
                                    <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Additional Details</span>
                                    <textarea
                                        value={details}
                                        onChange={(e) => setDetails(e.target.value)}
                                        rows={3}
                                        className="w-full p-3 rounded-xl bg-neutral-100 dark:bg-black/50 border border-neutral-200 dark:border-white/10 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-neutral-400"
                                        placeholder="Please provide any extra context..."
                                    />
                                </label>

                                <div className="pt-4">
                                    <Button
                                        text={loading ? "Submitting..." : "Submit Report"}
                                        onClick={handleSubmit}
                                        disabled={loading || !email}
                                        fullWidth
                                        className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default ReportModal;
