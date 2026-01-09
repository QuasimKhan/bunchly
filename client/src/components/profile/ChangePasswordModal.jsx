import React, { useMemo, useState } from "react";
import { Lock, Eye, EyeOff, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import Button from "../ui/Button";
import Modal from "../ui/Modal";

export default function ChangePasswordModal({
    open,
    onClose,
    onConfirm,
    loading,
    isGoogleUser,
    oldPassword,
    newPassword,
    confirmPassword,
    setOldPassword,
    setNewPassword,
    setConfirmPassword,
}) {
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Password Strength Logic
    const strength = useMemo(() => {
        let score = 0;
        if (newPassword.length >= 8) score++;
        if (/[A-Z]/.test(newPassword)) score++;
        if (/[0-9]/.test(newPassword)) score++;
        if (/[^A-Za-z0-9]/.test(newPassword)) score++;
        return score; // Max 4
    }, [newPassword]);

    const passwordsMatch = newPassword === confirmPassword;
    
    // Can submit if:
    // 1. Old password entered
    // 2. New password has reasonable length (>= 6 per general rule, even if weak strength)
    // 3. Match
    const canSubmit = useMemo(() => {
        return (
            oldPassword.trim().length > 0 &&
            newPassword.trim().length >= 6 &&
            passwordsMatch
        );
    }, [oldPassword, newPassword, passwordsMatch]);

    if (!open) return null;

    // --- VIEW: GOOGLE USER BLOCKED ---
    if (isGoogleUser) {
        return (
            <Modal open={open} onClose={onClose}>
                <div className="flex flex-col items-center text-center p-2">
                    <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6">
                        <Lock className="w-8 h-8" />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3">
                        Password Not Required
                    </h2>
                    
                    <p className="text-neutral-500 text-base leading-relaxed mb-8 max-w-sm">
                        You signed in with <strong>Google</strong>, so you don't need a password to access your account. Secure and simple!
                    </p>

                    <Button 
                        text="Got it, thanks"
                        onClick={onClose}
                        className="w-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold py-3"
                    />
                </div>
            </Modal>
        );
    }

    // --- VIEW: EMAIL USER FORM ---
    return (
        <Modal open={open} onClose={onClose}>
            <div className="text-left">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400">
                        <Lock className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                            Change Password
                        </h2>
                        <p className="text-sm text-neutral-500">
                            Update your password to keep secure
                        </p>
                    </div>
                </div>

                <div className="space-y-5">
                    {/* Current Password */}
                    <PasswordInput 
                        label="Current Password"
                        value={oldPassword}
                        onChange={setOldPassword}
                        show={showOld}
                        onToggle={() => setShowOld(!showOld)}
                        placeholder="• • • • • • • •"
                    />

                    {/* New Password */}
                    <div className="space-y-2">
                         <PasswordInput 
                            label="New Password"
                            value={newPassword}
                            onChange={setNewPassword}
                            show={showNew}
                            onToggle={() => setShowNew(!showNew)}
                            placeholder="At least 6 characters"
                        />
                        
                        {/* Strength Indicator */}
                        {newPassword && (
                            <div className="flex items-center gap-1 mt-2">
                                {[1,2,3,4].map((step) => (
                                    <div 
                                        key={step} 
                                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                                            step <= strength 
                                                ? (strength <= 2 ? "bg-amber-500" : "bg-emerald-500") 
                                                : "bg-neutral-200 dark:bg-neutral-800"
                                        }`} 
                                    />
                                ))}
                            </div>
                        )}
                        {newPassword && (
                            <p className={`text-xs text-right ${strength <= 2 ? "text-amber-500" : "text-emerald-500"}`}>
                                {strength <= 2 ? "Weak Password" : "Strong Password"}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                        <PasswordInput 
                            label="Confirm New Password"
                            value={confirmPassword}
                            onChange={setConfirmPassword}
                            show={showConfirm}
                            onToggle={() => setShowConfirm(!showConfirm)}
                            placeholder="Re-enter new password"
                            error={confirmPassword && !passwordsMatch}
                        />
                        {confirmPassword && !passwordsMatch && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> Passwords don't match
                            </p>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex gap-4 mt-8 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                    <Button
                        text="Cancel"
                        variant="ghost"
                        onClick={onClose}
                    />
                    <Button
                        text={loading ? "Updating..." : "Update Password"}
                        loading={loading}
                        disabled={!canSubmit || loading}
                        onClick={onConfirm}
                        className={`flex-1 ${
                            canSubmit 
                                ? "!bg-indigo-600 hover:!bg-indigo-700 text-white shadow-lg shadow-indigo-500/20" 
                                : "opacity-50 cursor-not-allowed"
                        }`}
                    />
                </div>
            </div>
        </Modal>
    );
}

// --- SUB-COMPONENT: PASSWORD INPUT ---
function PasswordInput({ label, value, onChange, show, onToggle, placeholder, error }) {
    return (
        <div className="group">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5 ml-1">
                {label}
            </label>
            <div className="relative">
                <input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`
                        w-full px-4 py-3 rounded-xl
                        bg-white dark:bg-neutral-900
                        border transition-all outline-none
                        text-neutral-900 dark:text-white
                        placeholder:text-neutral-400
                        ${error 
                            ? "border-red-500 focus:ring-2 ring-red-500/20" 
                            : "border-neutral-200 dark:border-neutral-800 focus:border-indigo-500 focus:ring-2 ring-indigo-500/20"
                        }
                    `}
                />
                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors cursor-pointer"
                >
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            </div>
        </div>
    );
}
