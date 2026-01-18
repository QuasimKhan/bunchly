import React, { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

const Modal = ({ 
    open, 
    onClose, 
    children, 
    title,
    size = "md", // sm, md, lg, xl, full
    hideClose = false,
    className = ""
}) => {
    
    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") onClose();
        };
        if (open) window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [open, onClose]);

    // Prevent body scroll when open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [open]);

    // Sizes
    const maxWidths = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        full: "max-w-[95vw] h-[95vh]",
    };

    return createPortal(
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
                    {/* BACKDROP */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
                    />

                    {/* CONTENT CONTAINER */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                        className={`
                            relative w-full ${maxWidths[size]}
                            bg-white dark:bg-[#0f0f0f]
                            rounded-[2rem] shadow-2xl
                            ring-1 ring-black/5 dark:ring-white/10
                            overflow-y-auto max-h-full custom-scrollbar
                            flex flex-col
                            ${className}
                        `}
                        onClick={(e) => e.stopPropagation()}
                    >
                         {/* Header (Optional via Props or children usually handle it, but Close Button is global) */}
                        {!hideClose && (
                            <button
                                onClick={onClose}
                                className="
                                    absolute top-5 right-5 z-50 p-2 
                                    text-neutral-400 hover:text-neutral-900 dark:hover:text-white 
                                    bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 
                                    rounded-full transition-all duration-200
                                "
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                        
                        {title && (
                            <div className="px-6 py-4 border-b border-neutral-100 dark:border-white/5">
                                <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                                    {title}
                                </h3>
                            </div>
                        )}

                        <div className="p-6 md:p-8">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default Modal;
