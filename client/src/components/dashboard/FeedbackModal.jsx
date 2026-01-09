import Modal from "../ui/Modal";
import Button from "../ui/Button";
import api from "../../lib/api";
import InputField from "../ui/InputField";
import { MessageSquarePlus, CheckCircle2, AlertCircle, Bug, Lightbulb, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
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
            // Use the configured api instance which handles auth headers/cookies
            const res = await api.post("/api/feedback", { type, message });
            
            if (res.data.success) {
                setSuccess(true);
                toast.success("Feedback submitted!");
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
        { id: "general", label: "General", icon: MessageSquare },
        { id: "bug", label: "Bug Report", icon: Bug },
        { id: "feature", label: "Feature Request", icon: Lightbulb },
    ];

    if (success) {
        return (
            <Modal open={isOpen} onClose={handleClose}>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <motion.div 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }} 
                        className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-4"
                    >
                        <CheckCircle2 className="w-8 h-8" />
                    </motion.div>
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Thank You!</h3>
                    <p className="text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto">
                        Your feedback helps us make Bunchly better for everyone.
                    </p>
                </div>
            </Modal>
        );
    }

    return (
        <Modal open={isOpen} onClose={handleClose}>
            <div className="mb-6">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400">
                    <MessageSquarePlus className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-1">
                    Send Feedback
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Found a bug? Have a suggestion? We'd love to hear from you.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Type Selection */}
                <div className="grid grid-cols-3 gap-2">
                    {types.map((t) => {
                        const Icon = t.icon;
                        const active = type === t.id;
                        return (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => setType(t.id)}
                                className={`
                                    flex flex-col items-center gap-2 p-3 rounded-xl border transition-all text-xs font-medium
                                    ${active 
                                        ? "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-500/30 dark:text-indigo-300" 
                                        : "bg-white dark:bg-white/5 border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-white/10"
                                    }
                                `}
                            >
                                <Icon className={`w-5 h-5 ${active ? "opacity-100" : "opacity-70"}`} />
                                {t.label}
                            </button>
                        );
                    })}
                </div>

                {/* Message Input */}
                <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 ml-1">
                        Your Message
                    </label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us what you think..."
                        className="w-full min-h-[120px] p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all"
                        required
                    />
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 pt-2">
                    <Button 
                        text="Cancel"
                        variant="secondary"
                        onClick={handleClose}
                        type="button"
                    />
                     <Button 
                        text="Submit Feedback"
                        type="submit"
                        loading={loading}
                        icon={MessageSquarePlus}
                    />
                </div>
            </form>
        </Modal>
    );
};

export default FeedbackModal;
