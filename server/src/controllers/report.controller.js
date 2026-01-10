import { Report } from "../models/Report.js";
import User from "../models/User.js";
import { sendReportReceivedEmail, sendStrikeWarningEmail, sendBanEmail } from "../utils/email.js";

// Public: Create a report
export const createReport = async (req, res) => {
    try {
        const { username, reason, details, reporterEmail } = req.body;
        const reporterIp = req.ip || req.connection.remoteAddress;

        if (!reporterEmail) {
            return res.status(400).json({ success: false, message: "Contact email is required." });
        }

        // 1. Find User by username
        const reportedUser = await User.findOne({ username });
        if (!reportedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // 2. Rate Limit Check (Simple: Check if IP reported this user in last 24h)
        const existingReport = await Report.findOne({
            reporterIp,
            reportedUser: reportedUser._id,
            createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        });

        if (existingReport) {
            return res.status(429).json({ success: false, message: "You have already reported this profile recently." });
        }

        // 3. Create Report
        const report = new Report({
            reporterEmail,
            reporterIp,
            reportedUser: reportedUser._id,
            reason,
            details
        });

        // 4. Save Report
        await report.save();

        // 5. Send Confirmation Email
        await sendReportReceivedEmail(reporterEmail, username);

        res.status(201).json({ success: true, message: "Report submitted successfully." });

    } catch (error) {
        console.error("Create Report Error:", error);
        res.status(500).json({ success: false, message: "Failed to submit report." });
    }
};

// Admin: Get all reports
export const getReports = async (req, res) => {
    try {
        const { status, search, limit = 20, page = 1 } = req.query;
        const query = {};
        if (status) query.status = status;

        if (search) {
            // OPTIMIZED: Use Text Search if available, fallback to Regex for partial matches
            // Note: Text search requires the text indexes added to User model
            const users = await User.find(
                { $text: { $search: search } },
                { score: { $meta: "textScore" } }
            ).sort({ score: { $meta: "textScore" } }).select('_id');

            // If text search fails (e.g. partial words), fallback to regex for robustness
            let userIds = users.map(u => u._id);
            if (userIds.length === 0) {
                 const fallbackUsers = await User.find({
                    $or: [
                        { username: { $regex: search, $options: 'i' } },
                        { email: { $regex: search, $options: 'i' } }
                    ]
                }).limit(50).select('_id'); // Limit fallback to 50 to prevent explosion
                userIds = fallbackUsers.map(u => u._id);
            }

            query.$or = [
                { reporterEmail: { $regex: search, $options: 'i' } }, // Keep regex here as Reporter isn't a User model ref for Email always
                { reportedUser: { $in: userIds } }
            ];
        }

        const reports = await Report.find(query)
            .populate("reportedUser", "name username email image plan")
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((page - 1) * limit);

        const total = await Report.countDocuments(query);

        res.json({ success: true, reports, total, page: parseInt(page), pages: Math.ceil(total / limit) });
    } catch (error) {
        console.error("Get Reports Error:", error);
        res.status(500).json({ success: false, message: "Failed to fetch reports." });
    }
};

// Admin: Update report status
export const updateReportStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminNotes, action } = req.body; // action: 'strike'

        const report = await Report.findById(id).populate('reportedUser');
        if (!report) {
            return res.status(404).json({ success: false, message: "Report not found" });
        }

        report.status = status;
        report.adminNotes = adminNotes;
        report.resolvedBy = req.user._id;

        // HANDLE STRIKE LOGIC
        if (status === 'resolved' && action === 'strike') {
            const user = await User.findById(report.reportedUser._id);
            
            // Initialize strikes if undefined (schema default update issue)
            if (user.flags.strikes === undefined) user.flags.strikes = 0;
            
            user.flags.strikes += 1;
            const currentStrikes = user.flags.strikes;

            if (currentStrikes >= 3) {
                user.flags.isBanned = true;
                await sendBanEmail(user.email, user.name, report.reason);
            } else {
                await sendStrikeWarningEmail(user.email, user.name, currentStrikes, report.reason);
            }
            
            // Mark user modified flags object
            user.markModified('flags');
            await user.save();
        }

        await report.save();

        res.json({ success: true, report });
    } catch (error) {
        console.error("Update Report Error:", error);
        res.status(500).json({ success: false, message: "Failed to update report." });
    }
};

// Admin: Delete report
export const deleteReport = async (req, res) => {
    try {
        const report = await Report.findByIdAndDelete(req.params.id);
        if (!report) return res.status(404).json({ success: false, message: "Report not found" });
        res.json({ success: true, message: "Report deleted successfully" });
    } catch (error) {
        console.error("Delete Report Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
