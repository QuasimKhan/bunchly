import Modal from "../ui/Modal";
import Button from "../ui/Button";
import api from "../../lib/api";
import { MessageSquarePlus, CheckCircle2, Bug, Lightbulb, MessageSquare, X } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const FeedbackModal = ({ isOpen, onClose }) => {
    const [type, setType] = useState("general"); // general, bug, feature
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return toast.error("Please enter a message");

        setLoading(true);
        try {
            const res = await api.post("/api/feedback", { type, message });
            
            if (res.data.success) {
                setSuccess(true);
                // Reset after delay
                setTimeout(() => {
                    handleClose();
                }, 2000);
            } else {
                toast.error(res.data.message || "Failed to submit feedback");
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setSuccess(false);
        setMessage("");
        setType("general");
        onClose();
    };

    const types = [
        { id: "general", label: "General", icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
        { id: "bug", label: "Bug Report", icon: Bug, color: "text-red-500", bg: "bg-red-50 dark:bg-red-500/10" },
        { id: "feature", label: "Feature Idea", icon: Lightbulb, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
    ];

    return (
        <Modal open={isOpen} onClose={handleClose}>
            <AnimatePresence mode="wait">
                {success ? (
                    <motion.div 
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-12 text-center"
                    >
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-6 ring-8 ring-green-50 dark:ring-green-900/10">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Thank You!</h3>
                        <p className="text-neutral-500 dark:text-neutral-400 max-w-[260px] mx-auto leading-relaxed">
                            Your feedback has been sent to our team. We appreciate your input!
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                                    <MessageSquarePlus className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                                        Send Feedback
                                    </h3>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                                        Help us improve your experience
                                    </p>
                                </div>
                            </div>
                            <button onClick={handleClose} className="p-1 hover:bg-neutral-100 dark:hover:bg-white/10 rounded-lg transition-colors">
                                <X className="w-5 h-5 text-neutral-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Type Selection */}
                            <div className="grid grid-cols-3 gap-3">
                                {types.map((t) => {
                                    const Icon = t.icon;
                                    const active = type === t.id;
                                    return (
                                        <button
                                            key={t.id}
                                            type="button"
                                            onClick={() => setType(t.id)}
                                            className={`
                                                relative overflow-hidden flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all duration-300
                                                ${active 
                                                    ? "bg-white dark:bg-[#1A1A20] border-indigo-500 ring-2 ring-indigo-500/20 shadow-lg" 
                                                    : "bg-neutral-50 dark:bg-white/5 border-transparent hover:bg-white dark:hover:bg-white/10 hover:shadow-md"
                                                }
                                            `}
                                        >
                                            <div className={`p-2 rounded-lg ${t.bg} ${t.color}`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <span className={`text-xs font-bold ${active ? 'text-neutral-900 dark:text-white' : 'text-neutral-500'}`}>
                                                {t.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Message Input */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wide ml-1">
                                    Your Message
                                </label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Tell us what's on your mind..."
                                    className="w-full min-h-[140px] p-4 rounded-2xl bg-white dark:bg-[#1A1A20] border border-neutral-200 dark:border-white/10 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none shadow-sm transition-all"
                                    required
                                />
                            </div>

                            {/* Footer */}
                            <div className="pt-2">
                                <Button 
                                    text="Submit Feedback"
                                    type="submit"
                                    loading={loading}
                                    icon={MessageSquarePlus}
                                    fullWidth
                                    className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 !py-3 !rounded-xl text-sm font-bold shadow-xl shadow-neutral-900/10 dark:shadow-white/5"
                                />
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </Modal>
    );
};

export default FeedbackModal;
