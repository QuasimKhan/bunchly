import ProfileView from "../models/ProfileView.js";
import LinkClick from "../models/LinkClick.js";
import Link from "../models/Link.js";

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
        fromDate.setHours(0, 0, 0, 0);

        // Debug: Ensure we are querying correctly
        // console.log("Fetching analytics for user:", userId, "From:", fromDate);

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
            { $sort: { count: -1 } },
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

        /* ---------------- CLICKS OVER TIME ---------------- */
        // We want a continuous timeline, but aggregate only gives us dates with data.
        // Frontend might handle filling gaps, or we can do it here.
        // For now, let's return the raw aggregation and let frontend/chart handle sparse data.
        const clicksOverTime = await LinkClick.aggregate([
            {
                $match: {
                    userId,
                    createdAt: { $gte: fromDate },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // Also fetch Views over time for the same chart?
        // User dashboard often shows both.
        // Let's add viewsOverTime
        const viewsOverTime = await ProfileView.aggregate([
            {
                $match: {
                    userId,
                    createdAt: { $gte: fromDate },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        /* ---------------- OS BREAKDOWN ---------------- */
        const osBreakdown = await LinkClick.aggregate([
            { $match: { userId, createdAt: { $gte: fromDate } } },
            { $group: { _id: "$os", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);

        /* ---------------- REFERRER BREAKDOWN ---------------- */
        const referrerBreakdown = await LinkClick.aggregate([
            { $match: { userId, createdAt: { $gte: fromDate } } },
            { $group: { _id: "$referrer", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

         /* ---------------- CITY BREAKDOWN ---------------- */
         const cityBreakdown = await LinkClick.aggregate([
            { $match: { userId, createdAt: { $gte: fromDate } } },
            { $group: { _id: "$city", count: { $sum: 1 } } },
            { $match: { _id: { $ne: null } } }, // Filter out nulls
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);
        
        // MVP: totalLinks active count
        const activeLinks = await Link.countDocuments({ userId, isActive: true });

        // Transform clicksOverTime / viewsOverTime into 'history' format expected by dashboard sparkline for now?
        // DashboardWidgets expects `analytics.history` array with { date, views, clicks }
        
        // Map data to map by date
        const historyMap = new Map();
        
        // Initialize last N days
        for (let d = 0; d < range; d++) {
            const date = new Date(fromDate);
            date.setDate(date.getDate() + d);
            const dateStr = date.toISOString().split('T')[0];
            historyMap.set(dateStr, { 
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
                views: 0, 
                clicks: 0,
                // keep simplified date for sorting/lookup? keys are YYYY-MM-DD
            });
        }

        viewsOverTime.forEach(item => {
            if(historyMap.has(item._id)) {
                historyMap.get(item._id).views = item.count;
            }
        });

        clicksOverTime.forEach(item => {
             if(historyMap.has(item._id)) {
                historyMap.get(item._id).clicks = item.count;
            }
        });

        const history = Array.from(historyMap.values());

        // Calculate CTR
        const ctr = profileViews > 0 
            ? ((totalClicks / profileViews) * 100).toFixed(1) + "%"
            : "0%";

        return res.status(200).json({
            success: true,
            data: {
                // DashboardWidgets props match:
                totalLinks: await Link.countDocuments({ userId }), // total
                activeLinks,
                totalClicks,
                profileViews,
                ctr,
                history, // Sparkline data

                // Detailed Analytics Page props (future use or advanced modal):
                range,
                topLinks,
                topCountries,
                deviceBreakdown,
                browserUsage,
                osBreakdown,
                referrerBreakdown,
                cityBreakdown,
                clicksOverTime, 
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
