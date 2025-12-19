import Link from "../models/Link.js";
import User from "../models/User.js";

export const getAnalytics = async (req, res) => {
    try {
        const userId = req.user._id;

        // 🔒 Pro-only check
        if (req.user.plan !== "pro") {
            return res.status(403).json({
                success: false,
                message: "Upgrade to Pro to access analytics",
                code: "PRO_REQUIRED",
            });
        }

        // 1️⃣ Profile views
        const profileViews = req.user.profileViews || 0;

        // 2️⃣ Total link clicks (usage-level)
        const totalClicks = req.user.usage?.totalClicks || 0;

        // 3️⃣ Top links by clicks
        const topLinks = await Link.find({ userId })
            .sort({ clicks: -1 })
            .limit(5)
            .select("title clicks url");

        return res.status(200).json({
            success: true,
            data: {
                profileViews,
                totalClicks,
                topLinks,
            },
        });
    } catch (error) {
        console.error("Analytics error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
