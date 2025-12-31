import ProfileView from "../models/ProfileView.js";
import LinkClick from "../models/LinkClick.js";

export const getAnalytics = async (req, res) => {
    try {
        const userId = req.user._id;

        /* ---------------- PRO CHECK ---------------- */
        if (req.user.plan !== "pro") {
            return res.status(403).json({
                success: false,
                message: "Upgrade to Pro to access analytics",
                code: "PRO_REQUIRED",
            });
        }

        /* ---------------- RANGE ---------------- */
        const range = Number(req.query.range) || 7;
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - range);

        /* ---------------- PROFILE VIEWS ---------------- */
        const profileViews = await ProfileView.countDocuments({
            userId,
            createdAt: { $gte: fromDate },
        });

        /* ---------------- TOTAL CLICKS ---------------- */
        const totalClicks = await LinkClick.countDocuments({
            userId,
            createdAt: { $gte: fromDate },
        });

        /* ---------------- TOP LINKS ---------------- */
        const topLinks = await LinkClick.aggregate([
            {
                $match: {
                    userId,
                    createdAt: { $gte: fromDate },
                },
            },
            {
                $group: {
                    _id: "$linkId",
                    clicks: { $sum: 1 },
                },
            },
            { $sort: { clicks: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "links",
                    localField: "_id",
                    foreignField: "_id",
                    as: "link",
                },
            },
            { $unwind: "$link" },
            {
                $project: {
                    _id: "$link._id",
                    title: "$link.title",
                    url: "$link.url",
                    clicks: 1,
                },
            },
        ]);

        /* ---------------- TOP COUNTRIES ---------------- */
        const topCountries = await ProfileView.aggregate([
            {
                $match: {
                    userId,
                    createdAt: { $gte: fromDate },
                },
            },
            {
                $group: {
                    _id: "$country",
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
            { $limit: 5 },
        ]);

        /* ---------------- DEVICE BREAKDOWN ---------------- */
        const deviceBreakdown = await ProfileView.aggregate([
            {
                $match: {
                    userId,
                    createdAt: { $gte: fromDate },
                },
            },
            {
                $group: {
                    _id: "$device",
                    count: { $sum: 1 },
                },
            },
        ]);

        /* ---------------- BROWSER USAGE ---------------- */
        const browserUsage = await ProfileView.aggregate([
            {
                $match: {
                    userId,
                    createdAt: { $gte: fromDate },
                },
            },
            {
                $group: {
                    _id: "$browser",
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
        ]);

        return res.status(200).json({
            success: true,
            data: {
                range,
                profileViews,
                totalClicks,
                topLinks,
                topCountries,
                deviceBreakdown,
                browserUsage,
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
