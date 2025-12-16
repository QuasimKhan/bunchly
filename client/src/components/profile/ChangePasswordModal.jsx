import React, { useEffect, useMemo } from "react";
import { Lock, X } from "lucide-react";
import Button from "../ui/Button";
import InputField from "../ui/InputField";

export default function ChangePasswordModal({
    open,
    onClose,
    onConfirm,
    loading,
    oldPassword,
    newPassword,
    confirmPassword,
    setOldPassword,
    setNewPassword,
    setConfirmPassword,
}) {
    // useEffect(() => {
    //     document.body.style.overflow = open ? "hidden" : "auto";
    //     return () => {
    //         document.body.style.overflow = "auto";
    //     };
    // }, [open]);

    const passwordsMatch = newPassword === confirmPassword;

    const canSubmit = useMemo(() => {
        return (
            oldPassword.trim().length > 0 &&
            newPassword.trim().length >= 6 &&
            passwordsMatch
        );
    }, [oldPassword, newPassword, passwordsMatch]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4"
            onClick={onClose}
        >
            <div
                className="
                    relative w-full max-w-md
                    bg-white dark:bg-neutral-900
                    rounded-xl shadow-xl
                    border border-neutral-200 dark:border-neutral-800
                "
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center gap-2">
                        <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <h2 className="text-lg font-semibold">
                            Change Password
                        </h2>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-4">
                    <InputField
                        type="password"
                        label="Current Password"
                        placeholder="Enter current password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />

                    <InputField
                        type="password"
                        label="New Password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        hint="Minimum 6 characters"
                    />

                    <InputField
                        type="password"
                        label="Confirm New Password"
                        placeholder="Re-enter new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={
                            confirmPassword &&
                            !passwordsMatch &&
                            "Passwords do not match"
                        }
                    />
                </div>

                {/* Footer */}
                <div className="flex gap-3 px-6 py-4 border-t border-neutral-200 dark:border-neutral-800">
                    <Button
                        text="Cancel"
                        onClick={onClose}
                        className="flex-1 bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white"
                    />

                    <Button
                        text={loading ? "Updating..." : "Update Password"}
                        loading={loading}
                        disabled={!canSubmit || loading}
                        onClick={onConfirm}
                        className={`flex-1 font-medium text-white ${
                            canSubmit && !loading
                                ? "bg-indigo-600 hover:bg-indigo-700"
                                : "bg-indigo-400 cursor-not-allowed opacity-70"
                        }`}
                    />
                </div>
            </div>
        </div>
    );
}
