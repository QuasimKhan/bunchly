import React, { useState, useEffect } from "react";
import { Shield, ShieldAlert, Check, ShieldCheck, User } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

const RoleModal = ({ user, open, onClose, onUpdate }) => {
    const [role, setRole] = useState("user");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setRole(user.role || "user");
        }
    }, [user]);

    const handleSave = async () => {
        if (!user) return;
        setLoading(true);
        await onUpdate(user._id, role);
        setLoading(false);
        onClose();
    };

    const isAdmin = role === "admin";

    return (
        <Modal open={open} onClose={onClose}>
            <div className="text-center">
                {/* Header Icon */}
                <div className={`
                    w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-300
                    ${isAdmin 
                        ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" 
                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500"
                    }
                `}>
                    {isAdmin ? <ShieldCheck className="w-8 h-8" /> : <User className="w-8 h-8" />}
                </div>

                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                    Manage Role
                </h2>
                <p className="text-neutral-500 text-sm mb-8">
                    Update access level for <strong className="text-neutral-900 dark:text-white">{user?.name}</strong>
                </p>

                {/* Role Selection Card */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <button
                        onClick={() => setRole("user")}
                        className={`
                            relative p-4 rounded-xl border-2 text-left transition-all duration-200
                            ${!isAdmin 
                                ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20 ring-1 ring-indigo-600/20" 
                                : "border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20"
                            }
                        `}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <User className={`w-5 h-5 ${!isAdmin ? "text-indigo-600" : "text-neutral-400"}`} />
                            {!isAdmin && <Check className="w-4 h-4 text-indigo-600" />}
                        </div>
                        <div className={`font-bold text-sm mb-1 ${!isAdmin ? "text-indigo-900 dark:text-indigo-200" : "text-neutral-900 dark:text-white"}`}>
                            Standard User
                        </div>
                        <div className="text-xs text-neutral-500 leading-relaxed">
                            Regular access to platform features.
                        </div>
                    </button>

                    <button
                        onClick={() => setRole("admin")}
                        className={`
                            relative p-4 rounded-xl border-2 text-left transition-all duration-200 overflow-hidden
                            ${isAdmin 
                                ? "border-amber-500 bg-amber-50/50 dark:bg-amber-900/20 ring-1 ring-amber-500/20" 
                                : "border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20"
                            }
                        `}
                    >
                        <div className="absolute top-0 right-0 p-1.5 bg-amber-500 rounded-bl-lg text-[10px] font-bold text-white uppercase tracking-wider">
                            Premium
                        </div>
                        <div className="flex justify-between items-start mb-2">
                            <Shield className={`w-5 h-5 ${isAdmin ? "text-amber-600" : "text-neutral-400"}`} />
                            {isAdmin && <Check className="w-4 h-4 text-amber-600" />}
                        </div>
                        <div className={`font-bold text-sm mb-1 ${isAdmin ? "text-amber-900 dark:text-amber-200" : "text-neutral-900 dark:text-white"}`}>
                            Super Admin
                        </div>
                        <div className="text-xs text-neutral-500 leading-relaxed">
                            Full control over users, payments & settings.
                        </div>
                    </button>
                </div>

                {/* Security Warning */}
                {isAdmin && user?.role !== 'admin' && (
                    <div className="mb-8 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 rounded-lg p-3 flex items-start gap-3 text-left">
                        <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        <div className="text-xs text-amber-800 dark:text-amber-200">
                            <strong>Caution:</strong> Granting admin privileges allows this user to view revenue, manage other users, and modify system settings.
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                    <Button 
                        variant="secondary" 
                        text="Cancel" 
                        onClick={onClose} 
                        fullWidth 
                    />
                    <Button 
                        text={loading ? "Updating..." : "Save Changes"}
                        onClick={handleSave}
                        className={`
                            ${isAdmin 
                                ? "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 border-transparent text-white shadow-lg shadow-amber-500/20" 
                                : "bg-indigo-600 hover:bg-indigo-700 border-transparent text-white"
                            }
                        `}
                        fullWidth 
                        disabled={loading || role === user?.role}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default RoleModal;
