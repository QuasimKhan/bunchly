import React, { useState, useEffect } from "react";
import Button from "../ui/Button";
import { AlertTriangle, X } from "lucide-react";
import InputField from "../ui/InputField";

export default function DeleteAccountModal({
    open,
    onClose,
    onConfirm,
    loading,
}) {
    const [input, setInput] = useState("");

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "auto";
    }, [open]);

    if (!open) return null;

    const canDelete = input.trim() === "DELETE";

    return (
        <div
            className="
        fixed inset-0 z-999
        flex items-end justify-center
        bg-black/60 backdrop-blur-sm animate-fadeIn
        p-4
    "
            onClick={onClose}
        >
            <div
                className="
                    relative w-full max-w-md 
                    bg-white/90 dark:bg-neutral-900/90
                    backdrop-blur-xl border border-red-500/30
                    shadow-2xl rounded-2xl animate-scaleIn

                    max-h-[92vh] overflow-hidden 
                    flex flex-col
                "
                onClick={(e) => e.stopPropagation()}
            >
                {/* HEADER */}
                <div className="relative px-6 pt-6 pb-3 border-b border-white/10 dark:border-neutral-800">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-200 transition"
                    >
                        <X size={22} />
                    </button>

                    <div className="flex justify-center mb-3">
                        <div
                            className="
                                w-16 h-16 rounded-full
                                bg-red-100 dark:bg-red-900/30
                                flex items-center justify-center
                            "
                        >
                            <AlertTriangle
                                className="text-red-600 dark:text-red-400"
                                size={34}
                            />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-center text-red-600 dark:text-red-400">
                        Delete Your Account
                    </h2>
                </div>

                {/* BODY */}
                <div className="px-6 py-4 overflow-y-auto">
                    <p className="text-neutral-700 dark:text-neutral-300 text-center leading-relaxed mb-6">
                        This will permanently delete your account and all data.
                        <br />
                        <span className="font-semibold text-red-500">
                            This action cannot be undone.
                        </span>
                    </p>

                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                        Type <strong>DELETE</strong> to confirm:
                    </p>

                    <InputField
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type DELETE"
                        className="
                            w-full px-4 py-3 rounded-xl
                            bg-white dark:bg-neutral-800
                            border border-neutral-300 dark:border-neutral-700
                            text-neutral-900 dark:text-white
                            placeholder-neutral-500
                            focus:ring-2 focus:ring-red-600 outline-none
                        "
                    />
                </div>

                {/* FOOTER */}
                <div className="p-4 border-t border-white/10 dark:border-neutral-800 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-xl">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            text="Cancel"
                            onClick={onClose}
                            className="
                                w-full py-2 rounded-xl 
                                bg-neutral-300 dark:bg-neutral-700
                                text-neutral-900 dark:text-white
                            "
                        />

                        <Button
                            text={loading ? "Deleting..." : "Delete Account"}
                            loading={loading}
                            disabled={!canDelete || loading}
                            onClick={() => {
                                if (canDelete && !loading) onConfirm();
                            }}
                            className={`
        w-full py-2 rounded-xl font-semibold text-white
        transition-all
        ${
            canDelete && !loading
                ? "bg-red-600 hover:bg-red-700 cursor-pointer"
                : "bg-red-400/70 cursor-not-allowed opacity-70 pointer-events-none"
        }
    `}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
