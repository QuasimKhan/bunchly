import React, { useMemo, useState } from "react";
import { Lock, Eye, EyeOff, AlertTriangle, CheckCircle2, ShieldCheck } from "lucide-react";
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
            <Modal open={open} onClose={onClose} size="sm">
                <div className="flex flex-col items-center text-center p-2">
                    <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/10 text-amber-500 rounded-full flex items-center justify-center mb-6 ring-8 ring-amber-50/50 dark:ring-amber-900/5">
                        <Lock className="w-8 h-8" />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3">
                        Password Not Required
                    </h2>
                    
                    <p className="text-neutral-500 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
                        You signed in with <strong>Google</strong>, so you don't need a password. Your account is already secure!
                    </p>

                    <Button 
                        text="Got it"
                        onClick={onClose}
                        className="w-full bg-neutral-900 dark:bg-white text-white dark:text-black font-bold py-3 rounded-xl"
                    />
                </div>
            </Modal>
        );
    }

    // --- VIEW: EMAIL USER FORM ---
    return (
        <Modal open={open} onClose={onClose} size="md">
            <div className="text-left">
                <div className="flex items-start gap-5 mb-8">
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl text-indigo-600 dark:text-indigo-400 shrink-0">
                        <ShieldCheck className="w-8 h-8" strokeWidth={1.5} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-1">
                            Change Password
                        </h2>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Create a strong, unique password to protect your account.
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Current Password */}
                    <div className="space-y-4 pt-2">
                         <PasswordInput 
                            label="Current Password"
                            value={oldPassword}
                            onChange={setOldPassword}
                            show={showOld}
                            onToggle={() => setShowOld(!showOld)}
                            placeholder="Enter current password"
                        />
                         <div className="w-full h-px bg-neutral-100 dark:bg-neutral-800" />
                    </div>
                   

                    {/* New Password */}
                    <div className="space-y-2">
                         <PasswordInput 
                            label="New Password"
                            value={newPassword}
                            onChange={setNewPassword}
                            show={showNew}
                            onToggle={() => setShowNew(!showNew)}
                            placeholder="Min. 6 characters"
                        />
                        
                        {/* Strength Indicator */}
                        {newPassword && (
                            <div className="flex items-center justify-between mt-2">
                                <div className="flex gap-1 h-1.5 flex-1 max-w-[50%]">
                                    {[1,2,3,4].map((step) => (
                                        <div 
                                            key={step} 
                                            className={`flex-1 rounded-full transition-all duration-300 ${
                                                step <= strength 
                                                    ? (strength <= 2 ? "bg-amber-500" : "bg-emerald-500") 
                                                    : "bg-neutral-200 dark:bg-neutral-800"
                                            }`} 
                                        />
                                    ))}
                                </div>
                                <span className={`text-xs font-semibold ${strength <= 2 ? "text-amber-500" : "text-emerald-500"}`}>
                                    {strength <= 2 ? "Weak" : "Strong"}
                                </span>
                            </div>
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
                            <p className="text-xs text-red-500 font-medium flex items-center gap-1.5 animate-in slide-in-from-top-1">
                                <AlertTriangle className="w-3.5 h-3.5" /> Passwords don't match
                            </p>
                        )}
                         {confirmPassword && passwordsMatch && (
                            <p className="text-xs text-emerald-500 font-medium flex items-center gap-1.5 animate-in slide-in-from-top-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Passwords match
                            </p>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end gap-3 mt-10 pt-6 border-t border-neutral-100 dark:border-neutral-800/50">
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
                        className={`px-8 rounded-xl font-bold shadow-lg shadow-indigo-500/20 ${
                            canSubmit 
                                ? "!bg-indigo-600 hover:!bg-indigo-700 text-white" 
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
        <label className="block group">
            <span className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2 ml-1">
                {label}
            </span>
            <div className="relative">
                <input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`
                        w-full px-4 py-3.5 rounded-xl
                        bg-neutral-50 dark:bg-neutral-900/50
                        border-2 transition-all outline-none
                        text-neutral-900 dark:text-white
                        placeholder:text-neutral-400
                        ${error 
                            ? "border-red-500/50 focus:border-red-500 bg-red-50/10" 
                            : "border-transparent focus:border-indigo-500/50 hover:bg-white dark:hover:bg-neutral-900"
                        }
                    `}
                />
                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors cursor-pointer rounded-lg hover:bg-neutral-200/50 dark:hover:bg-white/10"
                    tabIndex={-1}
                >
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            </div>
        </label>
    );
}
