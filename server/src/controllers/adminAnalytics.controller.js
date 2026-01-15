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



export const getOverview = async (req, res) => {
    try {
        const { period } = req.query;
        const { start, end } = getDateRange(period);
        const matchStage = { $match: { createdAt: { $gte: start, $lte: end } } };

        const stats = await AdminAnalytics.aggregate([
            matchStage,
            {
                $group: {
                    _id: null,
                    totalViews: { $sum: 1 },
                    uniqueVisitors: { $addToSet: "$ip" }
                }
            },
            {
                $project: {
                    totalViews: 1,
                    uniqueVisitors: { $size: "$uniqueVisitors" }
                }
            }
        ]);

        // Get currently active users (last 5 mins for "Real-time" feel)
        const activeThreshold = new Date(Date.now() - 5 * 60 * 1000);
        const activeUsers = await AdminAnalytics.distinct("ip", { createdAt: { $gte: activeThreshold } });

        res.json({
            totalViews: stats[0]?.totalViews || 0,
            uniqueVisitors: stats[0]?.uniqueVisitors || 0,
            activeUsers: activeUsers.length
        });
    } catch (error) {
        console.error("Overview Stats Error:", error);
        res.status(500).json({ message: "Error fetching overview stats" });
    }
};

export const getTimeSeries = async (req, res) => {
    try {
        const { period } = req.query; // '24h', '7d', '30d'
        const { start, end } = getDateRange(period);
        
        // Group format depends on range
        let dateFormat = "%Y-%m-%d"; // default for 7d/30d
        if (period === "24h") {
            dateFormat = "%Y-%m-%d-%H";
        }

        const data = await AdminAnalytics.aggregate([
            { $match: { createdAt: { $gte: start, $lte: end } } },
            {
                $group: {
                    _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
                    views: { $sum: 1 },
                    uniqueVisitors: { $addToSet: "$ip" }
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
        const { start, end } = getDateRange(period);

        const data = await AdminAnalytics.aggregate([
            { $match: { createdAt: { $gte: start, $lte: end } } },
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
        const { start, end } = getDateRange(period);
        const match = { $match: { createdAt: { $gte: start, $lte: end } } };

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

        res.json({
            devices: devices.map(d => ({ name: d._id || "Desktop", value: d.count })),
            browsers: browsers.map(d => ({ name: d._id || "Unknown", value: d.count })),
            os: os.map(d => ({ name: d._id || "Unknown", value: d.count }))
        });
    } catch (error) {
        console.error("Device Stats Error:", error);
        res.status(500).json({ message: "Error fetching device stats" });
    }
};

export const getTopPages = async (req, res) => {
    try {
        const { period, page = 1, limit = 10 } = req.query;
        const { start, end } = getDateRange(period);
        const skip = (page - 1) * limit;

        const pipeline = [
            { 
                $match: { 
                    createdAt: { $gte: start, $lte: end },
                    // Filter out null referrers if we only want frontend pages
                    referrer: { $ne: null }
                } 
            },
            {
                $group: {
                    // Group by Referrer instead of Path (Path is API path, Referrer is Frontend Page)
                    _id: "$referrer",
                    views: { $sum: 1 },
                    uniqueVisitors: { $addToSet: "$ip" }
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
        
        // Clean up paths (strip domain)
        // Note: Doing this in JS because Regex in Aggregation is heavy/complex for varying domains
        const cleanedData = result.data.map(item => {
            try {
                // If it's a valid URL, strip origin
                const url = new URL(item.path);
                return { ...item, path: url.pathname + url.search };
            } catch (e) {
                // Return as is if not a valid URL (e.g. relative or weird)
                return item;
            }
        });

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
