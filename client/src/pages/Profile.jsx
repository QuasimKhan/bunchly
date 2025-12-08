import TickBadge from "../components/ui/TickBadge";
import Button from "../components/ui/Button";

export default function Profile({ user }) {
    return (
        <div className="min-h-screen w-full px-6 py-10 flex justify-center bg-gradient-to-b from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-950">
            <div
                className="
                    w-full max-w-3xl rounded-3xl 
                    bg-white/70 dark:bg-white/5 
                    backdrop-blur-xl 
                    border border-white/40 dark:border-white/10 
                    shadow-2xl p-8
                "
            >
                {/* Top Section: Profile + Edit */}
                <div className="flex justify-between items-start mb-10">
                    <div className="flex items-center gap-6">
                        {/* Profile Image */}
                        <img
                            src={user.image}
                            alt="Profile"
                            className="
                                w-28 h-28 rounded-2xl object-cover 
                                shadow-lg border border-white/30 dark:border-white/10
                            "
                        />

                        {/* Name + Username */}
                        <div>
                            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                                {user.name}
                                <TickBadge tier={user.plan} />
                            </h2>

                            <p className="text-neutral-600 dark:text-neutral-400 text-lg mt-1">
                                @{user.username}
                            </p>

                            <p className="text-sm mt-2 text-neutral-500 dark:text-neutral-400">
                                Joined{" "}
                                {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    {/* EDIT BUTTON */}
                    <Button
                        text="Edit Profile"
                        className="
                            px-5 py-2 rounded-xl font-medium 
                            text-white shadow-lg
                            bg-gradient-to-r from-blue-600 to-purple-600
                            hover:from-blue-500 hover:to-purple-500
                            transition-all
                        "
                    />
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-neutral-300/60 dark:bg-neutral-700/40 mb-10"></div>

                {/* DETAILS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Email */}
                    <div className="p-5 rounded-2xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-white/40 dark:border-white/10 shadow">
                        <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                            Email
                        </h4>
                        <p className="text-gray-900 dark:text-gray-200 break-all">
                            {user.email}
                        </p>
                    </div>

                    {/* Account Type */}
                    <div className="p-5 rounded-2xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-white/40 dark:border-white/10 shadow">
                        <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                            Plan
                        </h4>
                        <p className="text-gray-900 dark:text-gray-200 capitalize">
                            {user.plan}
                        </p>
                    </div>

                    {/* Role */}
                    <div className="p-5 rounded-2xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-white/40 dark:border-white/10 shadow">
                        <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                            Role
                        </h4>
                        <p className="text-gray-900 dark:text-gray-200">
                            {user.role || "User"}
                        </p>
                    </div>

                    {/* Verified Status */}
                    <div className="p-5 rounded-2xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-white/40 dark:border-white/10 shadow">
                        <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                            Verification
                        </h4>
                        <p className="text-gray-900 dark:text-gray-200">
                            {user.isVerified ? "Verified" : "Not Verified"}
                        </p>
                    </div>
                </div>

                {/* BIO */}
                <div className="mt-10 p-6 rounded-2xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-white/40 dark:border-white/10 shadow">
                    <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                        Bio
                    </h4>
                    <p className="text-neutral-800 dark:text-neutral-200">
                        {user.bio || "No bio added yet."}
                    </p>
                </div>
            </div>
        </div>
    );
}
