import { useState } from "react";
import TickBadge from "../components/ui/TickBadge";
import Button from "../components/ui/Button";
import EditProfileModal from "../components/user/EditProfileModal";

export default function Profile({ user }) {
    const [open, setOpen] = useState(false);

    const handleSave = (updatedUser) => {
        console.log("Save Profile:", updatedUser);
        // 🔥 Integrate API call here later
    };

    return (
        <div
            className="min-h-screen w-full px-6 py-12 flex justify-center 
                        bg-gradient-to-b from-neutral-100 to-neutral-200 
                        dark:from-neutral-900 dark:to-neutral-950"
        >
            <div
                className="
                    w-full max-w-3xl rounded-3xl 
                    bg-white/70 dark:bg-white/5 backdrop-blur-xl 
                    border border-white/40 dark:border-white/10 
                    shadow-2xl p-10
                "
            >
                {/* HEADER */}
                <div className="flex justify-between items-start mb-12">
                    <div className="flex items-center gap-6">
                        <img
                            src={user.image}
                            className="
                                w-28 h-28 rounded-2xl object-cover 
                                shadow-lg border border-neutral-200 dark:border-neutral-800
                            "
                        />

                        <div>
                            <h2 className="text-3xl font-bold flex items-center gap-2">
                                {user.name} <TickBadge tier={user.plan} />
                            </h2>

                            <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                                @{user.username}
                            </p>

                            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                                Joined{" "}
                                {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    {/* EDIT BUTTON */}
                    <Button
                        text="Edit Profile"
                        className="
                            px-6 py-2 rounded-xl 
                            bg-gradient-to-r from-blue-600 to-purple-600 
                            text-white shadow-md hover:scale-105 
                            transition-all
                        "
                        onClick={() => setOpen(true)}
                    />
                </div>

                {/* DIVIDER */}
                <div className="w-full h-px bg-neutral-300/60 dark:bg-neutral-700/40 mb-10" />

                {/* GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card label="Email" value={user.email} />
                    <Card label="Plan" value={user.plan} />
                    <Card label="Role" value={user.role || "User"} />
                    <Card
                        label="Verification"
                        value={user.isVerified ? "Verified" : "Not Verified"}
                    />
                </div>

                {/* BIO */}
                <div
                    className="
                    mt-10 p-6 rounded-2xl bg-white/40 dark:bg-white/5 
                    backdrop-blur-md border border-white/40 dark:border-white/10 shadow
                "
                >
                    <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                        Bio
                    </h4>
                    <p className="text-neutral-800 dark:text-neutral-200">
                        {user.bio || "No bio added yet."}
                    </p>
                </div>
            </div>

            <EditProfileModal
                open={open}
                onClose={() => setOpen(false)}
                user={user}
                onSave={handleSave}
            />
        </div>
    );
}

const Card = ({ label, value }) => (
    <div
        className="p-5 rounded-2xl 
                    bg-white/40 dark:bg-white/5
                    backdrop-blur-md 
                    border border-white/40 dark:border-white/10 
                    shadow"
    >
        <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            {label}
        </h4>
        <p className="text-neutral-900 dark:text-neutral-200 break-all">
            {value}
        </p>
    </div>
);
