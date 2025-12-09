import { useState, useEffect } from "react";
import TickBadge from "../components/ui/TickBadge";
import Button from "../components/ui/Button";
import EditModal from "../components/profile/EditModal";
import api from "../lib/api.js";
import { toast } from "sonner";
import { Camera } from "lucide-react";
import EditProfileField from "../components/profile/EditProfileField.jsx";
import DeleteAccountModal from "../components/profile/DeleteAccountModal.jsx";

export default function Profile({ user }) {
    const [profile, setProfile] = useState(user);
    const [modal, setModal] = useState(null);
    const [loading, setLoading] = useState(false);

    const [accountDeleteModal, setAccountDeleteModal] = useState(false);
    const [accountDeleteLoading, setAccountDeleteLoading] = useState(false);

    /** Prevent background scrolling when modal is open */
    useEffect(() => {
        if (modal || accountDeleteModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [modal, accountDeleteModal]);

    const open = (field) => setModal(field);
    const close = () => setModal(null);

    const handleSave = async (updates) => {
        setLoading(true);
        try {
            const res = await api.patch("/api/user/update-profile", updates);
            setProfile(res.data.user);
            toast.success("Updated successfully");
            close();
        } catch (err) {
            toast.error(err?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    const handleAccountDelete = async () => {
        setAccountDeleteLoading(true);
        try {
            const res = await api.delete("/api/user/delete");

            if (res.data.success) {
                toast.success("Account deleted successfully");
                setTimeout(() => {
                    window.location.href = "/login";
                }, 800);
            } else {
                toast.error(res.data.message || "Unable to delete account");
            }
        } catch (err) {
            toast.error(err?.message || "Failed to delete account");
        } finally {
            setAccountDeleteLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen w-full px-4 py-8 flex justify-center bg-gradient-to-b 
            from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-950"
        >
            <div
                className="w-full max-w-3xl p-6 md:p-10 rounded-3xl bg-white/70 dark:bg-white/5 
                backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-2xl"
            >
                {/* ⭐ PREMIUM HEADER (updated) */}
                <div className="flex flex-col items-center sm:flex-row sm:items-center sm:justify-between gap-8 mb-10">
                    {/* Avatar */}
                    <div className="relative group mx-auto sm:mx-0">
                        <img
                            src={profile.image}
                            className="
                                w-28 h-28 sm:w-32 sm:h-32 rounded-3xl 
                                object-cover shadow-xl border border-white/50 dark:border-neutral-800
                            "
                        />

                        {/* Edit Image Button */}
                        <button
                            onClick={() => open("image")}
                            className="
                                absolute bottom-2 right-2 bg-black/60 backdrop-blur-md 
                                rounded-full p-1.5 opacity-0 group-hover:opacity-100 
                                transition-all duration-200
                            "
                        >
                            <Camera className="w-4 h-4 text-white" />
                        </button>
                    </div>

                    {/* User Info */}
                    <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                        <h2 className="font-bold text-2xl sm:text-3xl tracking-tight text-neutral-900 dark:text-white">
                            {profile.name}
                        </h2>

                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                                @{profile.username}
                            </p>
                            <TickBadge tier={profile.plan} />
                        </div>

                        <p className="text-sm mt-1 text-neutral-500 dark:text-neutral-400">
                            Joined{" "}
                            {new Date(profile.createdAt).toLocaleDateString()}
                        </p>

                        <p className="text-xs mt-1 text-neutral-500 dark:text-neutral-500">
                            Login Method: <b>{profile.authProvider}</b>
                        </p>
                    </div>
                </div>

                {/* ⭐ PROFILE FIELDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                        value={profile.plan}
                        editable={false}
                    />

                    <EditProfileField
                        label="Verified"
                        value={profile.isVerified ? "Yes" : "No"}
                        editable={false}
                    />

                    <EditProfileField
                        label="Role"
                        value={profile.role || "User"}
                        editable={false}
                    />

                    <EditProfileField
                        label="Password"
                        value="********"
                        editable={profile.authProvider === "email"}
                        onEdit={() =>
                            profile.authProvider === "email" && open("password")
                        }
                    />
                </div>

                {/* ⭐ DELETE ACCOUNT */}
                <div className="mt-10 text-center">
                    <Button
                        text="Delete Account"
                        variant="danger"
                        className="w-full sm:w-auto"
                        onClick={() => setAccountDeleteModal(true)}
                    />
                </div>

                {/* ⭐ MODALS */}
                {modal === "name" && (
                    <EditModal
                        open
                        field="name"
                        label="Edit Name"
                        value={profile.name}
                        onClose={close}
                        onSave={(val) => handleSave(val)}
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
                        onSave={(val) => handleSave(val)}
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
                        onSave={(val) => handleSave(val)}
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
                        onSave={(val) => handleSave(val)}
                        loading={loading}
                    />
                )}

                {modal === "password" && (
                    <EditModal
                        open
                        field="password"
                        label="Change Password"
                        passwordMode
                        onClose={close}
                        onSave={(val) => handleSave(val)}
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
                        onSave={(val) => handleSave(val)}
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
            </div>
        </div>
    );
}
