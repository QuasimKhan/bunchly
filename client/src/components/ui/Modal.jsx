// src/components/ui/Modal.jsx
import React from "react";
import { X } from "lucide-react";

const Modal = ({ open, onClose, children }) => {
    if (!open) return null;

    return (
        <div
            className="
                fixed inset-0 z-50 
                flex items-center justify-center
                bg-black/60 backdrop-blur-sm
                animate-fadeIn
                p-4
            "
            onClick={onClose}
        >
            {/* Modal Content */}
            <div
                className="
                    relative
                    bg-white dark:bg-neutral-900
                    border border-neutral-200 dark:border-neutral-800
                    rounded-3xl shadow-2xl 
                    w-full max-w-md
                    animate-scaleIn
                    overflow-hidden
                    
                    /* Gradient Overlay */
                    before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/0 before:to-white/50 dark:before:to-white/5 before:pointer-events-none
                "
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button Mobile Helper (optional, but good UX) */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-6 sm:p-8 relative z-0">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
