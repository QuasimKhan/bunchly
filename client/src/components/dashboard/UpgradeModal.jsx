import React, { useState, useEffect } from "react";
import { X, Sparkles, Check, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";

const UpgradeModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setVisible(true);
        } else {
            const timer = setTimeout(() => setVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!visible && !isOpen) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}>
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className={`
                relative w-full max-w-md mx-4 bg-white/90 dark:bg-[#0A0A0A]/90 backdrop-blur-2xl rounded-[2rem] shadow-2xl overflow-hidden border border-white/20 dark:border-white/10
                transform transition-all duration-500 ease-out flex flex-col
                ${isOpen ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-8 opacity-0"}
            `}>
                {/* Decorative gradients */}
                <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none" />
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative p-6 sm:p-8 text-center">
                    <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 mb-6 shadow-lg shadow-indigo-500/30 group">
                        <div className="absolute inset-0 rounded-2xl bg-white/20 blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <Sparkles className="w-8 h-8 text-white relative z-10" strokeWidth={1.5} />
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-2 tracking-tight">
                        Unlock Pro Features
                    </h2>
                    <p className="text-neutral-500 dark:text-neutral-400 mb-8 max-w-[260px] mx-auto text-sm leading-relaxed">
                        Take your page to the next level with premium themes, analytics, and no branding.
                    </p>

                    <div className="space-y-3 mb-8 text-left bg-neutral-50/50 dark:bg-white/5 p-4 rounded-2xl border border-neutral-100 dark:border-white/5">
                        {[
                            "Remove Bunchly branding",
                            "Advanced analytics & insights",
                            "Premium themes & gradients",
                            "Priority support"
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center shrink-0">
                                    <Check className="w-3 h-3 text-indigo-600 dark:text-indigo-400" strokeWidth={3} />
                                </div>
                                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{feature}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button 
                            text="Upgrade Now" 
                            variant="primary" 
                            size="lg"
                            className="w-full shadow-xl shadow-indigo-500/20 py-3.5 text-sm font-bold cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform"
                            icon={ArrowRight}
                            onClick={() => {
                                navigate("/dashboard/upgrade");
                                onClose();
                            }}
                        />
                        <button 
                            onClick={onClose}
                            className="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 font-medium transition-colors py-2 cursor-pointer select-none"
                        >
                            Maybe later
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpgradeModal;
