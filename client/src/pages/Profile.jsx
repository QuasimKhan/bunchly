import { useState } from "react";
import TickBadge from "../components/ui/TickBadge";
import Button from "../components/ui/Button";
import EditModal from "../components/profile/EditModal.jsx";
import api from "../lib/api.js";
import { toast } from "sonner";
import { Camera } from "lucide-react";
import EditProfileField from "../components/profile/EditProfileField.jsx";
import DeleteAccountModal from "../components/profile/DeleteAccountModal.jsx";
import ChangePasswordModal from "../components/profile/ChangePasswordModal.jsx";

export default function Profile({ user }) {
    const [profile, setProfile] = useState(user);
    const [modal, setModal] = useState(null);
    const [loading, setLoading] = useState(false);

    const [accountDeleteModal, setAccountDeleteModal] = useState(false);
    const [accountDeleteLoading, setAccountDeleteLoading] = useState(false);

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [changePasswordModal, setChangePasswordModal] = useState(false);
    const [changePasswordLoading, setChangePasswordLoading] = useState(false);

    const open = (field) => setModal(field);
    const close = () => setModal(null);

    /* ---------------- SAVE PROFILE ---------------- */
    const handleSave = async (updates) => {
        setLoading(true);
        try {
            if (
                typeof updates.image === "string" &&
                updates.image.startsWith("http")
            ) {
                setProfile((prev) => ({ ...prev, image: updates.image }));
                toast.success("Profile image updated");
                close();
                return;
            }

            const res = await api.patch("/api/user/update-profile", updates);
            if (res.data.success) {
                setProfile(res.data.user);
                toast.success("Profile updated");
                close();
            } else {
                toast.error(res.data.message || "Update failed");
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    /* ---------------- CHANGE PASSWORD ---------------- */
    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword || newPassword !== confirmPassword) {
            toast.error("Please check your password inputs");
            return;
        }

        setChangePasswordLoading(true);
        try {
            const res = await api.post(
                "/api/user/change-password",
                { oldPassword, newPassword },
                { withCredentials: true }
            );

            if (res.data.success) {
                toast.success(res.data.message);
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setChangePasswordModal(false);
            }
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Failed to change password"
            );
        } finally {
            setChangePasswordLoading(false);
        }
    };

    /* ---------------- DELETE ACCOUNT ---------------- */
    const handleAccountDelete = async () => {
        setAccountDeleteLoading(true);
        try {
            const res = await api.delete("/api/user/delete", {
                withCredentials: true,
            });

            if (res.data.success) {
                toast.success("Account deleted");
                setTimeout(() => (window.location.href = "/login"), 800);
            } else {
                toast.error(res.data.message || "Unable to delete account");
            }
        } catch {
            toast.error("Failed to delete account");
        } finally {
            setAccountDeleteLoading(false);
        }
    };

    return (
        <div
            className="
                w-full
                rounded-[28px]
                bg-white/80 dark:bg-white/4
                backdrop-blur-2xl
                border border-black/5 dark:border-white/10
                shadow-[0_40px_100px_rgba(0,0,0,0.15)]
                p-6 sm:p-10
            "
        >
            {/* ================= PROFILE HEADER ================= */}
            <div className="flex flex-col sm:flex-row gap-10 items-center mb-12">
                {/* Avatar */}
                <div
                    className="
                        relative p-2 rounded-3xl
                       bg-linear-to-br
                        from-neutral-200 to-neutral-100
                        dark:from-neutral-800 dark:to-neutral-900
                        shadow-xl
                    "
                >
                    <div className="relative group">
                        <img
                            src={profile.image || "/default-avatar.png"}
                            className="
                                    w-32 h-32 rounded-2xl object-cover
                                    border border-white/40 dark:border-white/10
                                "
                        />
                        <button
                            onClick={() => open("image")}
                            className="
                                    absolute bottom-2 right-2
                                    bg-black/70 hover:bg-black/80
                                    backdrop-blur-lg
                                    rounded-full p-2
                                    transition
                                "
                        >
                            <Camera className="w-4 h-4 text-white" />
                        </button>
                    </div>
                </div>

                {/* Identity */}
                <div className="flex-1 text-center sm:text-left">
                    <h1
                        className="
                            text-3xl sm:text-4xl font-semibold
                            tracking-tight text-neutral-900 dark:text-white
                        "
                    >
                        {profile.name}
                    </h1>

                    <div className="flex justify-center sm:justify-start items-center gap-3 mt-2">
                        <span className="text-neutral-500 dark:text-neutral-400 text-lg">
                            @{profile.username}
                        </span>
                        <TickBadge tier={profile.plan} />
                    </div>

                    <div className="mt-4 space-y-1">
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Joined{" "}
                            {new Date(profile.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-neutral-400 dark:text-neutral-500">
                            Login Method ·{" "}
                            <b>{profile.authProvider.toUpperCase()}</b>
                        </p>
                    </div>
                </div>
            </div>

            {/* ================= PROFILE DETAILS ================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <EditProfileField
                    label="Name"
                    value={profile.name}
                    onEdit={() => open("name")}
                />
                <EditProfileField
                    label="Username"
                    value={profile.username}
                    onEdit={() => open("username")}
                />
                <EditProfileField
                    label="Email"
                    value={profile.email}
                    editable={profile.authProvider === "email"}
                    onEdit={() =>
                        profile.authProvider === "email" && open("email")
                    }
                />
                <EditProfileField
                    label="Bio"
                    value={profile.bio}
                    onEdit={() => open("bio")}
                />
                <EditProfileField
                    label="Plan"
                    value={profile.plan.toUpperCase()}
                    editable={false}
                />
                <EditProfileField
                    label="Verified"
                    value={profile.isVerified ? "Yes" : "No"}
                    editable={false}
                />
            </div>

            {/* ================= ACTIONS ================= */}
            <div
                className="
                    mt-14 pt-8
                    border-t border-black/5 dark:border-white/10
                    flex flex-col sm:flex-row gap-4
                    justify-between items-center
                "
            >
                <Button
                    text="Change Password"
                    variant="secondary"
                    className="min-w-[180px]"
                    onClick={() => setChangePasswordModal(true)}
                />
                <Button
                    text="Delete Account"
                    variant="danger"
                    className="min-w-[180px]"
                    onClick={() => setAccountDeleteModal(true)}
                />
            </div>

            {/* ================= MODALS ================= */}
            {modal === "name" && (
                <EditModal
                    open
                    field="name"
                    label="Edit Name"
                    value={profile.name}
                    onClose={close}
                    onSave={handleSave}
                    loading={loading}
                />
            )}
            {modal === "username" && (
                <EditModal
                    open
                    field="username"
                    label="Edit Username"
                    value={profile.username}
                    onClose={close}
                    onSave={handleSave}
                    loading={loading}
                />
            )}
            {modal === "email" && (
                <EditModal
                    open
                    field="email"
                    label="Update Email"
                    value={profile.email}
                    onClose={close}
                    onSave={handleSave}
                    loading={loading}
                />
            )}
            {modal === "bio" && (
                <EditModal
                    open
                    field="bio"
                    label="Edit Bio"
                    value={profile.bio}
                    onClose={close}
                    onSave={handleSave}
                    loading={loading}
                />
            )}
            {modal === "image" && (
                <EditModal
                    open
                    field="image"
                    label="Update Profile Image"
                    value={profile.image}
                    onClose={close}
                    onSave={handleSave}
                    loading={loading}
                    imageMode
                />
            )}

            <DeleteAccountModal
                open={accountDeleteModal}
                onClose={() => setAccountDeleteModal(false)}
                onConfirm={handleAccountDelete}
                loading={accountDeleteLoading}
            />

            <ChangePasswordModal
                open={changePasswordModal}
                onClose={() => setChangePasswordModal(false)}
                onConfirm={handleChangePassword}
                loading={changePasswordLoading}
                oldPassword={oldPassword}
                newPassword={newPassword}
                confirmPassword={confirmPassword}
                setOldPassword={setOldPassword}
                setNewPassword={setNewPassword}
                setConfirmPassword={setConfirmPassword}
            />
        </div>
    );
}
