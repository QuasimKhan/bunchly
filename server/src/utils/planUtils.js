import User from "../models/User.js";
import { sendExpiryWarningEmail } from "./email.js";

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

export const sendExpirationAlerts = async () => {
    const now = Date.now();
    const threeDaysFromNow = now + (3 * 24 * 60 * 60 * 1000);
    const fourDaysFromNow = now + (4 * 24 * 60 * 60 * 1000);

    // Find users expiring between 3 and 4 days from now (so we catch them once)
    const expiringUsers = await User.find({
        plan: "pro",
        planExpiresAt: {
            $gte: threeDaysFromNow,
            $lt: fourDaysFromNow
        }
    });

    if (expiringUsers.length > 0) {
        console.log(`⚠️ Sending expiration alerts to ${expiringUsers.length} users`);
        
        for (const user of expiringUsers) {
            try {
                await sendExpiryWarningEmail(user.email, user.name || user.username, 3);
            } catch (error) {
                console.error(`Failed to send alert to ${user.email}:`, error);
            }
        }
    }
};
