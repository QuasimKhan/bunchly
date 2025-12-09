import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import Button from "../ui/Button";
import api from "../../lib/api";

export default function EditModal({
    open,
    onClose,
    label,
    field,
    value,
    onSave,
    loading,
}) {
    if (!open) return null;

    const [draft, setDraft] = useState(value || "");
    const [usernameStatus, setUsernameStatus] = useState("");

    useEffect(() => {
        setDraft(value || "");
        setUsernameStatus("");
    }, [value, field]);

    /** -----------------------------------------
     *  Username availability checker (debounced)
     * ----------------------------------------- */
    useEffect(() => {
        if (field !== "username") return;

        if (!draft.trim()) {
            setUsernameStatus("");
            return;
        }

        const username = draft.trim().toLowerCase();

        setUsernameStatus("checking");

        const delay = setTimeout(async () => {
            try {
                const res = await api.get(
                    `/api/auth/check-username?username=${username}`
                );

                setUsernameStatus(res.data.available ? "available" : "taken");
            } catch {
                setUsernameStatus("invalid");
            }
        }, 400);

        return () => clearTimeout(delay);
    }, [draft]);

    /** Save Handler */
    const handleSubmit = () => {
        if (!draft.trim()) return;

        if (field === "username" && usernameStatus !== "available") {
            return toast.error("Choose a valid, available username");
        }

        onSave({ [field]: draft.trim() });
    };

    return (
        <div
            className="
                fixed inset-0 z-[999] flex items-center justify-center
                bg-black/40 backdrop-blur-sm animate-fadeIn
            "
            onClick={onClose}
        >
            <div
                className="
                    w-full max-w-md mx-4 p-6 rounded-2xl shadow-2xl 
                    bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl 
                    border border-white/40 dark:border-neutral-700 
                    animate-scaleIn
                "
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="
                        absolute right-4 top-4 p-1
                        text-neutral-500 hover:text-neutral-700 
                        dark:hover:text-white transition
                    "
                >
                    <X size={20} />
                </button>

                {/* Title */}
                <h2 className="text-xl font-semibold mb-4 text-neutral-900 dark:text-white">
                    {label}
                </h2>

                {/* Input */}
                <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    className="
                        w-full px-4 py-3 rounded-xl border 
                        border-neutral-300 dark:border-neutral-700
                        bg-white/60 dark:bg-neutral-800/60 
                        text-neutral-900 dark:text-white
                        focus:ring-2 ring-indigo-500 outline-none
                        placeholder-neutral-500 dark:placeholder-neutral-400
                    "
                    placeholder={`Enter ${field}...`}
                />

                {/* Username Status */}
                {field === "username" && (
                    <p className="mt-2 text-sm h-5">
                        {usernameStatus === "checking" && (
                            <span className="flex items-center gap-1 text-blue-500">
                                <Loader2 className="w-4 h-4 animate-spin" />{" "}
                                Checking…
                            </span>
                        )}

                        {usernameStatus === "available" && (
                            <span className="text-green-600">
                                ✓ Username available
                            </span>
                        )}

                        {usernameStatus === "taken" && (
                            <span className="text-red-500">
                                ✗ Already taken
                            </span>
                        )}

                        {usernameStatus === "invalid" && (
                            <span className="text-yellow-600">
                                Invalid username format
                            </span>
                        )}
                    </p>
                )}

                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-6">
                    <Button
                        text="Cancel"
                        onClick={onClose}
                        className="
                            !bg-neutral-300/70 dark:!bg-neutral-700/40 
                            text-black dark:text-white
                            hover:!bg-neutral-300 dark:hover:!bg-neutral-700
                        "
                    />

                    <Button
                        text="Save"
                        loading={loading}
                        onClick={handleSubmit}
                        className="
                            !bg-indigo-600 hover:!bg-indigo-700 
                            text-white shadow-md
                        "
                        disabled={
                            field === "username" &&
                            (usernameStatus === "invalid" ||
                                usernameStatus === "taken" ||
                                usernameStatus === "checking")
                        }
                    />
                </div>
            </div>
        </div>
    );
}
