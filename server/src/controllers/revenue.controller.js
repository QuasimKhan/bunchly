import Payment from "../models/Payment.js";
import User from "../models/User.js";

import { sendEmail } from "../utils/brevoEmail.js";
import { revenueReportEmail } from "../utils/revenueReportEmail.js";

export const getRevenueStats = async (req, res) => {
    try {
        const { range = '30d' } = req.query;
        const data = await calculateRevenueStats(range);
        res.json({ success: true, range, ...data });
    } catch (error) {
        console.error("Revenue Stats Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch revenue stats" });
    }
};

export const emailRevenueReport = async (req, res) => {
    try {
        const { range = '30d' } = req.body;
        const { stats, recentTransactions } = await calculateRevenueStats(range);
        
        // 1. Generate CSV
        const headers = ["Date,User,Email,Plan,Amount,Status,Invoice"];
        const rows = recentTransactions.map(t => [
            `"${new Date(t.createdAt).toLocaleDateString()}"`,
            `"${t.userId?.name || 'Unknown'}"`,
            `"${t.userId?.email || 'N/A'}"`,
            `"${t.plan}"`,
            (t.amount / 100).toFixed(2),
            `"${t.status}"`,
            `"${t.invoiceNumber}"`
        ].join(","));
        
        const csvContent = headers.concat(rows).join("\n");
        const csvBuffer = Buffer.from(csvContent, 'utf-8');

        // 2. Generate HTML
        const { html } = revenueReportEmail({
            stats,
            range,
            date: new Date().toLocaleDateString(),
            adminName: req.user?.username || "Admin" 
            // req.user available if protect middleware used
        });

        // 3. Send Email
        // Get Admin Email from Env or User Object. Fallback to Bunchly Support if undefined (but cleaner to require it)
        const adminEmail = req.user?.email || process.env.BREVO_SENDER_EMAIL; 

        await sendEmail({
            to: adminEmail,
            subject: `Revenue Report - ${range.toUpperCase()}`,
            html,
            attachments: [{ filename: `revenue_report_${range}.csv`, content: csvBuffer }]
        });

        res.json({ success: true, message: `Report sent to ${adminEmail}` });

    } catch (error) {
        console.error("Email Report Error:", error);
        res.status(500).json({ success: false, message: "Failed to send report" });
    }
};

// Helper to reuse logic
const calculateRevenueStats = async (range) => {
    const now = new Date();
    let startDate = new Date();
    let groupBy = "day";

    switch (range) {
        case '7d': startDate.setDate(now.getDate() - 7); break;
        case '30d': startDate.setDate(now.getDate() - 30); break;
        case '90d': startDate.setDate(now.getDate() - 90); groupBy = "month"; break;
        case '1y': startDate.setFullYear(now.getFullYear() - 1); groupBy = "month"; break;
        case 'all': startDate = new Date(0); groupBy = "month"; break;
        default: startDate.setDate(now.getDate() - 30);
    }

    // Metrics Agg
    const metricsAgg = await Payment.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
            $group: {
                _id: null,
                totalGross: { $sum: { $cond: [{ $eq: ["$status", "paid"] }, "$amount", 0] } },
                totalRefundedAmount: { $sum: { $cond: [{ $eq: ["$status", "refunded"] }, "$amount", 0] } },
                paidCount: { $sum: { $cond: [{ $eq: ["$status", "paid"] }, 1, 0] } },
                refundCount: { $sum: { $cond: [{ $eq: ["$status", "refunded"] }, 1, 0] } },
                totalCount: { $sum: 1 }
            }
        }
    ]);

    const metrics = metricsAgg[0] || { totalGross: 0, totalRefundedAmount: 0, paidCount: 0, refundCount: 0, totalCount: 0 };
    const totalGross = metrics.totalGross / 100;
    const totalRefunded = metrics.totalRefundedAmount / 100;
    const netRevenue = totalGross - totalRefunded;
    const aov = metrics.paidCount > 0 ? (totalGross / metrics.paidCount) : 0;
    const refundRate = metrics.totalCount > 0 ? ((metrics.refundCount / metrics.totalCount) * 100).toFixed(1) : 0;

    // Chart Agg
    const dateGroup = groupBy === "day" 
        ? { day: { $dayOfMonth: "$createdAt" }, month: { $month: "$createdAt" }, year: { $year: "$createdAt" } }
        : { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } };

    const chartAgg = await Payment.aggregate([
        { $match: { createdAt: { $gte: startDate }, status: "paid" } },
        {
            $group: { _id: dateGroup, revenue: { $sum: "$amount" }, sales: { $sum: 1 } }
        },
        { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
    ]);

    const formattedChartData = chartAgg.map(item => {
        const date = groupBy === "day"
            ? new Date(item._id.year, item._id.month - 1, item._id.day)
            : new Date(item._id.year, item._id.month - 1);
        return {
            name: date.toLocaleDateString('default', groupBy === "day" ? { day: 'numeric', month: 'short' } : { month: 'short', year: '2-digit' }),
            date: date.toISOString(),
            revenue: item.revenue / 100,
            sales: item.sales
        };
    });

    // Recent Txns
    const recentTransactions = await Payment.find({ createdAt: { $gte: startDate } })
        .sort({ createdAt: -1 })
        .limit(100) // 100 max for report
        .populate("userId", "name email image plan");

    const proUsersCount = await User.countDocuments({ plan: "pro" });

    return {
        stats: {
            grossRevenue: totalGross,
            netRevenue,
            aov,
            proUsers: proUsersCount,
            refundRate,
            refundsValue: totalRefunded
        },
        chartData: formattedChartData,
        recentTransactions
    };
};
