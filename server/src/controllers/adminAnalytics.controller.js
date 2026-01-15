import AdminAnalytics from "../models/AdminAnalytics.js";
import User from "../models/User.js";
import Link from "../models/Link.js";

// Helper to get date range
const getDateRange = (period = "7d") => {
    const end = new Date();
    const start = new Date();
    
    if (period === "24h") start.setHours(start.getHours() - 24);
    else if (period === "7d") start.setDate(start.getDate() - 7);
    else if (period === "30d") start.setDate(start.getDate() - 30);
    else if (period === "all") start.setFullYear(2000); // Beginning of time
    
    return { start, end };
};

// Helper to get date range with filter
const getDateMatch = (period = "7d", extraMatch = {}) => {
    const { start, end } = getDateRange(period);
    return { 
        $match: { 
            createdAt: { $gte: start, $lte: end },
            eventType: "pageview", // Strictly Page Views only
            ...extraMatch
        } 
    };
};

export const getOverview = async (req, res) => {
    try {
        const { period } = req.query;
        const matchStage = getDateMatch(period);
        console.log("Analytics: dateMatch", JSON.stringify(matchStage, null, 2));

        // DEBUG: Drill down
        const totalDocs = await AdminAnalytics.countDocuments({});
        const pageViewDocs = await AdminAnalytics.countDocuments({ eventType: "pageview" });
        const dateDocs = await AdminAnalytics.countDocuments({ createdAt: { $gte: matchStage.$match.createdAt.$gte, $lte: matchStage.$match.createdAt.$lte } });
        const finalDocs = await AdminAnalytics.countDocuments(matchStage.$match);
        
        console.log("Analytics DIAGNOSTIC:", {
            totalDocs,
            pageViewDocs,
            dateRangeDocs: dateDocs, 
            finalMatchDocs: finalDocs,
            period,
            start: matchStage.$match.createdAt.$gte,
            end: matchStage.$match.createdAt.$lte
        });

        const stats = await AdminAnalytics.aggregate([
            matchStage,
            {
                $group: {
                    _id: null,
                    totalViews: { $sum: 1 },
                    uniqueVisitors: { $addToSet: "$visitorId" },
                    sessions: { $addToSet: "$sessionId" }
                }
            },
            {
                $project: {
                    totalViews: 1,
                    uniqueVisitors: { $size: "$uniqueVisitors" },
                    sessions: { $size: "$sessions" }
                }
            }
        ]);

        // Calculate Average Session Duration
        const sessionStats = await AdminAnalytics.aggregate([
            matchStage,
            {
                $group: {
                    _id: "$sessionId",
                    start: { $min: "$createdAt" },
                    end: { $max: "$createdAt" },
                    events: { $sum: 1 }
                }
            },
            {
                $project: {
                    duration: { $subtract: ["$end", "$start"] }, // in ms
                    isBounce: { $eq: ["$events", 1] }
                }
            },
            {
                $group: {
                    _id: null,
                    avgDuration: { $avg: "$duration" },
                    bounceRate: { $avg: { $cond: ["$isBounce", 1, 0] } }
                }
            }
        ]);

        // Get currently active users (last 30 mins)
        // Must also match pageview to avoid count API polling as active users for this stat
        const activeThreshold = new Date(Date.now() - 30 * 60 * 1000); 
        const activeUsers = await AdminAnalytics.distinct("visitorId", { 
            createdAt: { $gte: activeThreshold },
            eventType: "pageview" 
        });

        res.json({
            totalViews: stats[0]?.totalViews || 0,
            uniqueVisitors: stats[0]?.uniqueVisitors || 0,
            sessions: stats[0]?.sessions || 0,
            activeUsers: activeUsers.length,
            avgSessionDuration: sessionStats[0]?.avgDuration || 0, // ms
            bounceRate: (sessionStats[0]?.bounceRate || 0) * 100 // percentage
        });
    } catch (error) {
        console.error("Overview Stats Error:", error);
        res.status(500).json({ message: "Error fetching overview stats" });
    }
};

export const getTimeSeries = async (req, res) => {
    try {
        const { period } = req.query;
        let dateFormat = "%Y-%m-%d"; 
        if (period === "24h") {
            dateFormat = "%Y-%m-%d-%H";
        }

        const data = await AdminAnalytics.aggregate([
            getDateMatch(period),
            {
                $group: {
                    _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
                    views: { $sum: 1 },
                    uniqueVisitors: { $addToSet: "$visitorId" }
                }
            },
            {
                $project: {
                    date: "$_id",
                    views: 1,
                    visitors: { $size: "$uniqueVisitors" }
                }
            },
            { $sort: { date: 1 } }
        ]);

        res.json(data);
    } catch (error) {
        console.error("Time Series Error:", error);
        res.status(500).json({ message: "Error fetching time series data" });
    }
};

export const getGeoStats = async (req, res) => {
    try {
        const { period } = req.query;
        const data = await AdminAnalytics.aggregate([
            getDateMatch(period),
            {
                $group: {
                    _id: "$location.country",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        res.json(data.map(d => ({ name: d._id || "Unknown", value: d.count })));
    } catch (error) {
        console.error("Geo Stats Error:", error);
        res.status(500).json({ message: "Error fetching geo stats" });
    }
};

export const getDeviceStats = async (req, res) => {
    try {
        const { period } = req.query;
        const match = getDateMatch(period);

        const devices = await AdminAnalytics.aggregate([
            match,
            { $group: { _id: "$device.type", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const browsers = await AdminAnalytics.aggregate([
            match,
            { $group: { _id: "$browser.name", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        const os = await AdminAnalytics.aggregate([
            match,
            { $group: { _id: "$os.name", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        const resolutions = await AdminAnalytics.aggregate([
            match,
            { $group: { _id: "$screenResolution", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

         // Mobile Specific Experience
        const mobileSessions = await AdminAnalytics.aggregate([
            getDateMatch(period, { "device.type": { $in: ["mobile", "tablet"] } }),
            {
                $group: {
                    _id: "$sessionId",
                    events: { $sum: 1 }
                }
            },
            {
                $project: {
                    isBounce: { $eq: ["$events", 1] }
                }
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 },
                    bounceRate: { $avg: { $cond: ["$isBounce", 1, 0] } }
                }
            }
        ]);


        res.json({
            devices: devices.map(d => ({ name: d._id || "Desktop", value: d.count })),
            browsers: browsers.map(d => ({ name: d._id || "Unknown", value: d.count })),
            os: os.map(d => ({ name: d._id || "Unknown", value: d.count })),
            resolutions: resolutions.map(d => ({ name: d._id || "Unknown", value: d.count })),
            mobileStats: {
                totalSessions: mobileSessions[0]?.count || 0,
                bounceRate: (mobileSessions[0]?.bounceRate || 0) * 100
            }
        });
    } catch (error) {
        console.error("Device Stats Error:", error);
        res.status(500).json({ message: "Error fetching device stats" });
    }
};

export const getTopPages = async (req, res) => {
    try {
        const { period, page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const pipeline = [
            getDateMatch(period, { path: { $exists: true, $ne: null } }),
            {
                $group: {
                    _id: "$path",
                    views: { $sum: 1 },
                    uniqueVisitors: { $addToSet: "$visitorId" }
                }
            },
            {
                $project: {
                    path: "$_id",
                    views: 1,
                    visitors: { $size: "$uniqueVisitors" }
                }
            },
            { $sort: { views: -1 } }
        ];

        // Faceted search for total count and pagination results
        const data = await AdminAnalytics.aggregate([
            ...pipeline,
            {
                $facet: {
                    metadata: [{ $count: "total" }],
                    data: [{ $skip: Number(skip) }, { $limit: Number(limit) }]
                }
            }
        ]);

        const result = data[0];
        const total = result.metadata[0] ? result.metadata[0].total : 0;
        
        // Clean up paths (strip domain if needed, though they should be relative now)
        const cleanedData = result.data.map(item => item);

        res.json({
            data: cleanedData,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Top Pages Error:", error);
        res.status(500).json({ message: "Error fetching top pages" });
    }
};

