
import { useState } from "react";
import { toast } from "sonner";
import api from "../lib/api.js";

// Components
import ProfileHeader from "../components/profile/ProfileHeader";
import PersonalInfo from "../components/profile/PersonalInfo";
import SecuritySettings from "../components/profile/SecuritySettings";
import DangerZone from "../components/profile/DangerZone";

// Modals
import EditModal from "../components/profile/EditModal";
import DeleteAccountModal from "../components/profile/DeleteAccountModal";
import ChangePasswordModal from "../components/profile/ChangePasswordModal";

export default function Profile({ user }) {
    const [profile, setProfile] = useState(user);
    const [modal, setModal] = useState(null); // 'name', 'username', 'email', 'bio', 'image'
    
    // Loading States
    const [loading, setLoading] = useState(false);
    
    // Security Modals
    const [changePasswordModal, setChangePasswordModal] = useState(false);
    const [accountDeleteModal, setAccountDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);

    const [passwordForm, setPasswordForm] = useState({ old: "", new: "", confirm: "" });

    // --- ACTIONS ---

    const handleSave = async (updates) => {
        setLoading(true);
        try {
            // Handle specialized image updates if passed as string directly (from crop modal)
            const payload = updates;

            const res = await api.patch("/api/user/update-profile", payload);
            if (res.data.success) {
                setProfile(prev => ({ ...prev, ...res.data.user }));
                toast.success("Profile updated successfully");
                setModal(null);
            } else {
                toast.error(res.data.message || "Update failed");
            }
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        const { old, new: newPass, confirm } = passwordForm;
        if (!old || !newPass || newPass !== confirm) {
            toast.error("Please check your password inputs");
            return;
        }

        setPasswordLoading(true);
        try {
            const res = await api.post("/api/user/change-password", { oldPassword: old, newPassword: newPass });
            if (res.data.success) {
                toast.success("Password changed successfully");
                setChangePasswordModal(false);
                setPasswordForm({ old: "", new: "", confirm: "" });
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to change password");
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        setDeleteLoading(true);
        try {
            await api.delete("/api/user/delete");
            toast.success("Account deleted. Goodbye!");
            setTimeout(() => (window.location.href = "/login"), 800);
        } catch {
            toast.error("Failed to delete account");
            setDeleteLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto pb-20 animate-fade-in px-4 md:px-0">
            
            {/* 1. Header & Quick Actions */}
            <ProfileHeader 
                user={profile} 
                onEditImage={() => setModal("image")} 
            />

            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[2rem] p-6 md:p-10 shadow-sm space-y-12">
                
                {/* 2. Personal Info Section */}
                <PersonalInfo 
                    user={profile} 
                    onEdit={(field) => setModal(field)} 
                />

                {/* 3. Security Section */}
                <SecuritySettings 
                    onChangePassword={() => setChangePasswordModal(true)} 
                />

                {/* 4. Danger Zone */}
                <DangerZone 
                    onDelete={() => setAccountDeleteModal(true)} 
                />

            </div>

            {/* --- MODALS --- */}
            
            {modal && (
                <EditModal
                    open={!!modal}
                    field={modal}
                    label={modal === 'image' ? 'Update Profile Photo' : `Edit ${modal.charAt(0).toUpperCase() + modal.slice(1)}`}
                    value={profile[modal]}
                    onClose={() => setModal(null)}
                    onSave={handleSave}
                    loading={loading}
                    imageMode={modal === "image"}
                />
            )}

            <ChangePasswordModal
                open={changePasswordModal}
                oldPassword={passwordForm.old}
                newPassword={passwordForm.new}
                confirmPassword={passwordForm.confirm}
                setOldPassword={(v) => setPasswordForm(prev => ({ ...prev, old: v }))}
                setNewPassword={(v) => setPasswordForm(prev => ({ ...prev, new: v }))}
                setConfirmPassword={(v) => setPasswordForm(prev => ({ ...prev, confirm: v }))}
                loading={passwordLoading}
                onClose={() => setChangePasswordModal(false)}
                onConfirm={handleChangePassword}
            />

            <DeleteAccountModal
                open={accountDeleteModal}
                loading={deleteLoading}
                onClose={() => setAccountDeleteModal(false)}
                onConfirm={handleDeleteAccount}
            />

        </div>
    );
}
