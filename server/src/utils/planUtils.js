import User from "../models/User.js";

export const downgradeExpiredUsers = async () => {
    const now = Date.now();

    const result = await User.updateMany(
        {
            plan: "pro",
            planExpiresAt: { $lte: now },
        },
        {
            $set: {
                plan: "free",
                planExpiresAt: null,
                "subscription.status": "expired",
            },
        }
    );
    if (result.modifiedCount > 0) {
        console.log(`🔻 Downgraded ${result.modifiedCount} expired users`);
    }
};
