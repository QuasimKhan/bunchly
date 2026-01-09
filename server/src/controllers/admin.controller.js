import mongoose from "mongoose";
import User from "../models/User.js";
import Payment from "../models/Payment.js";
import Link from "../models/Link.js";
import razorpay from "../config/razorpay.js";
import { sendEmail } from "../utils/brevoEmail.js";
import { getPremiumEmailHtml } from "../utils/emailTemplates.js";

/* --------------------------------------------------
   GET PAYMENTS (HISTORY)
-------------------------------------------------- */
export const getPayments = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const payments = await Payment.find({})
            .populate("userId", "name email image")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Payment.countDocuments({});

        return res.status(200).json({
            success: true,
            payments,
            page,
            totalPages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Failed to fetch payments" });
    }
};

/* --------------------------------------------------
   GET USER DETAILS (DEEP INSPECTION)
-------------------------------------------------- */
export const getUserDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id).select("-password -__v");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const [links, payments, stats] = await Promise.all([
            Link.find({ userId: id }).sort({ createdAt: -1 }),
            Payment.find({ userId: id }).sort({ createdAt: -1 }).limit(10),
            // Aggregate total clicks/views across all links could be done here, 
            // but for now we'll rely on the user.profileViews and rudimentary link counting.
            Link.aggregate([
                { $match: { userId: user._id } },
                { $group: { _id: null, totalClicks: { $sum: "$clicks" } } }
            ])
        ]);

        // 🔹 Active Session Check
        // We check which of the loginHistory sessions still exist in the DB
        const sessionIds = user.loginHistory
            .map(h => h.sessionId)
            .filter(id => id); // Filter out undefined/null

        let activeSessionIds = new Set();
        if (sessionIds.length > 0) {
            const sessions = await mongoose.connection.db.collection("session")
                .find({ _id: { $in: sessionIds } })
                .project({ _id: 1 }) // Only need ID
                .toArray();
            activeSessionIds = new Set(sessions.map(s => s._id));
        }

        // Enrich login history with 'isActive' status
        const enrichedHistory = user.loginHistory.map(h => ({
            ...h.toObject(),
            isActive: activeSessionIds.has(h.sessionId)
        }));

        const userObj = user.toObject();
        userObj.loginHistory = enrichedHistory;

        return res.status(200).json({
            success: true,
            user: userObj,
            links,
            payments,
            stats: {
                totalClicks: stats[0]?.totalClicks || 0,
                totalLinks: links.length
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Failed to fetch user details" });
    }
};

/* --------------------------------------------------
   UPDATE USER PLAN (MANUAL OVERRIDE)
-------------------------------------------------- */
export const updateUserPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const { plan, period } = req.body; // period in months (optional)

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.plan = plan; // 'free' or 'pro'

        if (plan === 'pro') {
            const months = period || 1;
            const expiry = new Date();
            expiry.setMonth(expiry.getMonth() + parseInt(months));
            user.planExpiresAt = expiry;
            
            // Log this manual action maybe?
            user.subscription = {
                provider: 'manual',
                status: 'active',
                orderId: `admin_gift_${req.user._id}_${Date.now()}`
            };

            // EMAIL: Gifted Pro
            await sendEmail({
                to: user.email,
                subject: "You've been gifted Bunchly Pro! 🌟",
                html: getPremiumEmailHtml({
                    title: "Status Upgrade! 🚀",
                    messageLines: [
                        `Hi ${user.name},`,
                        `An admin has gifted you <strong>Bunchly Pro</strong> access!`,
                        `<strong>Duration:</strong> ${months} Month(s)`,
                        `Enjoy specific analytics, premium themes, and unlimited links.`
                    ],
                    actionText: "Go to Dashboard",
                    actionUrl: `${process.env.CLIENT_URL}/admin`,
                    accentColor: "#F59E0B" // Amber/Gold
                })
            });

        } else {
            user.plan = 'free';
            user.planExpiresAt = null;
            user.subscription = undefined;

            // EMAIL: Revoked Pro
             await sendEmail({
                to: user.email,
                subject: "Plan Status Update",
                html: getPremiumEmailHtml({
                    title: "Plan Updated",
                    messageLines: [
                        `Hi ${user.name},`,
                        `Your subscription status has been updated.`,
                        `Your account is now on the <strong>Free</strong> plan.`,
                        `If you have any questions, please contact support.`
                    ],
                    accentColor: "#6B7280" // Grey
                })
            });
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: `User plan updated to ${plan.toUpperCase()}`,
            user
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

/* --------------------------------------------------
   DELETE USER LINK (MODERATION)
-------------------------------------------------- */
export const deleteUserLink = async (req, res) => {
    try {
        const { linkId } = req.params;
        
        // Populate user to get email for notification
        const link = await Link.findById(linkId).populate("userId");
        if (!link) {
            return res.status(404).json({ success: false, message: "Link not found" });
        }

        const userEmail = link.userId.email;
        const linkTitle = link.title;
        const linkUrl = link.url;

        await Link.findByIdAndDelete(linkId);

        // EMAIL: Content Moderation
        if (userEmail) {
             await sendEmail({
                to: userEmail,
                subject: "Action Required: Content Removed",
                html: getPremiumEmailHtml({
                    title: "Content Removed 🛡️",
                    messageLines: [
                        `We detected content on your profile that violates our Community Guidelines.`,
                        `<strong>Link Removed:</strong> ${linkTitle}`,
                        `<span style="color:#DC2626; font-size:12px;">${linkUrl}</span>`,
                        `Please ensure all future content complies with our terms to avoid further account restrictions.`
                    ],
                    warning: true
                })
            });
        }

        return res.status(200).json({
            success: true,
            message: "Link deleted successfully by Admin"
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

/* --------------------------------------------------
   PROCESS REFUND
-------------------------------------------------- */
export const processRefund = async (req, res) => {
    try {
        const { id } = req.params; // Payment _id (MongoDB ID)

        const payment = await Payment.findById(id).populate("userId");
        if (!payment) {
            return res.status(404).json({ success: false, message: "Payment not found" });
        }

        if (payment.status !== "paid") {
            return res.status(400).json({ 
                success: false, 
                message: `Cannot refund. Current status: ${payment.status}` 
            });
        }

        // 1. Process Refund via Razorpay
        try {
            await razorpay.payments.refund(payment.paymentId, {
                speed: "normal",
                notes: {
                    reason: "Admin initiated refund",
                    adminId: req.user._id.toString()
                }
            });
        } catch (rpError) {
            console.error("Razorpay Refund Failed:", rpError);
            return res.status(500).json({
                success: false,
                message: "Razorpay refund failed: " + (rpError.error?.description || rpError.message)
            });
        }

        // 2. Update Local DB
        payment.status = "refunded";
        await payment.save();

        // 3. Downgrade User
        if (payment.userId) {
            const user = await User.findById(payment.userId._id);
            if (user && user.plan === "pro") {
                user.plan = "free";
                user.planExpiresAt = null;
                user.subscription = undefined;
                await user.save();
            }

            // 4. Send Email
            await sendEmail({
                to: user.email,
                subject: "Refund Processed - Bunchly",
                html: getPremiumEmailHtml({
                    title: "Refund Processed",
                    messageLines: [
                        `Hi ${user.name},`,
                        `Your payment of <strong>₹${payment.amount / 100}</strong> has been successfully refunded.`,
                        `The amount will reflect in your original payment source within 5-7 business days.`,
                        `Your account plan has been reverted to <strong>Free</strong>.`
                    ],
                    accentColor: "#4F46E5"
                })
            });
        }

        return res.status(200).json({
            success: true,
            message: "Refund processed successfully"
        });

    } catch (error) {
        console.error("[RefundError]", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

/* --------------------------------------------------
   GET DASHBOARD STATS
-------------------------------------------------- */
/* --------------------------------------------------
   GET DASHBOARD STATS
-------------------------------------------------- */
export const getAdminStats = async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const [
            totalUsers,
            proUsers,
            totalLinks,
            recentUsers,
            topUsers
        ] = await Promise.all([
            User.countDocuments({}),
            User.countDocuments({ plan: "pro" }),
            Link.countDocuments({}),
            User.find({})
                .sort({ createdAt: -1 })
                .limit(5)
                .select("name email plan createdAt"),
            User.find({})
                .sort({ profileViews: -1 })
                .limit(5)
                .select("name email profileViews image username")
        ]);

        // Revenue calculation (Total)
        const revenueAgg = await Payment.aggregate([
            { $match: { status: "paid" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalRevenue = revenueAgg[0]?.total || 0;

        // User Growth Chart Data (Last 30 Days)
        const userGrowthAgg = await User.aggregate([
            { $match: { createdAt: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Revenue Chart Data (Last 30 Days)
        const revenueChartAgg = await Payment.aggregate([
            { 
                $match: { 
                    status: "paid",
                    createdAt: { $gte: thirtyDaysAgo }
                } 
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    amount: { $sum: "$amount" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        return res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                proUsers,
                totalLinks,
                totalRevenue: totalRevenue / 100,
            },
            charts: {
                userGrowth: userGrowthAgg.map(i => ({ date: i._id, count: i.count })),
                revenue: revenueChartAgg.map(i => ({ date: i._id, amount: i.amount / 100 }))
            },
            recentUsers,
            topUsers
        });

    } catch (error) {
        console.error("[AdminStatsError]", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch admin stats"
        });
    }
};

/* --------------------------------------------------
   GET PAGINATED USERS
-------------------------------------------------- */
export const getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";
        const role = req.query.role || "all";

        const query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { username: { $regex: search, $options: "i" } }
            ];
        }

        if (role !== "all") {
            if (role === 'pro') query.plan = 'pro';
            else if (role === 'admin') query.role = 'admin';
            else query.role = role; 
        }

        const users = await User.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .select("-password");

        const total = await User.countDocuments(query);

        return res.status(200).json({
            success: true,
            users,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            totalUsers: total
        });

    } catch (error) {
        console.error("[AdminUsersError]", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch users"
        });
    }
};

/* --------------------------------------------------
   UPDATE USER (BAN / ROLE)
-------------------------------------------------- */
export const updateUserStatus = async (req, res) => {
    try {
        const { userId } = req.params;
        const { isBanned, role } = req.body;

        // Prevent modifying self
        if (req.user._id.toString() === userId) {
            return res.status(403).json({ success: false, message: "You cannot modify your own admin status" });
        }

        const updateData = {};
        if (typeof isBanned === 'boolean') updateData['flags.isBanned'] = isBanned;
        if (role) updateData.role = role;

        const user = await User.findByIdAndUpdate(userId, updateData, { new: true });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // EMAIL: Ban / Unban
        if (typeof isBanned === 'boolean') {
             if (isBanned) {
                await sendEmail({
                    to: user.email,
                    subject: "Important: Account Suspended",
                    html: getPremiumEmailHtml({
                        title: "Account Suspended 🚫",
                        messageLines: [
                            `Hi ${user.name},`,
                            `Your account has been suspended due to violations of our Terms of Service.`,
                            `You will no longer be able to log in, and your public profile has been hidden.`,
                            `If you believe this decision is an error, please reply to this email immediately.`
                        ],
                        warning: true
                    })
                });
             } else {
                 await sendEmail({
                    to: user.email,
                    subject: "Account Restored",
                    html: getPremiumEmailHtml({
                        title: "Welcome Back! ✅",
                        messageLines: [
                            `Hi ${user.name},`,
                            `Good news! Your account has been fully restored.`,
                            `You can now log in and access your dashboard.`
                        ],
                        actionText: "Login to Bunchly",
                        actionUrl: `${process.env.CLIENT_URL}/login`,
                        accentColor: "#10B981" // Green
                    })
                });
             }
        }

        // EMAIL: Role Change
        if (role) {
            if (role === 'admin') {
                await sendEmail({
                    to: user.email,
                    subject: "Admin Access Granted - Bunchly",
                    html: getPremiumEmailHtml({
                        title: "Admin Access Granted 🛡️",
                        messageLines: [
                            `Hi ${user.name},`,
                            `You have been granted <strong>Administrator</strong> privileges on Bunchly.`,
                            `You now have access to the Admin Dashboard to manage users, payments, and system settings.`,
                            `Please use these privileges responsibly.`
                        ],
                        actionText: "Go to Admin Dashboard",
                        actionUrl: `${process.env.CLIENT_URL}/admin`,
                        accentColor: "#F59E0B" // Amber
                    })
                });
            } else if (role === 'user') {
                await sendEmail({
                    to: user.email,
                    subject: "Admin Access Revoked",
                    html: getPremiumEmailHtml({
                        title: "Access Level Updated",
                        messageLines: [
                            `Hi ${user.name},`,
                            `Your Administrator privileges have been revoked.`,
                            `Your account has been returned to standard user status.`,
                            `You can still access your personal dashboard and links.`
                        ],
                        accentColor: "#6B7280"
                    })
                });
            }
        }

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            user
        });
    } catch (error) {
        console.error("[AdminUpdateUserError]", error);
        return res.status(500).json({ success: false, message: "Failed to update user" });
    }
};

/* --------------------------------------------------
   DELETE USER
-------------------------------------------------- */
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Prevent deleting self
        if (userId === req.user._id.toString()) {
            return res.status(400).json({ success: false, message: "Cannot delete your own admin account" });
        }

        // Fetch before delete to get email
        const userToDelete = await User.findById(userId);
        if (!userToDelete) {
             return res.status(404).json({ success: false, message: "User not found" });
        }

        // EMAIL: Deletion
        try {
             await sendEmail({
                to: userToDelete.email,
                subject: "Account Deleted",
                html: getPremiumEmailHtml({
                    title: "Account Deleted",
                    messageLines: [
                        `Hi ${userToDelete.name},`,
                        `This is a confirmation that your account and all data have been permanently deleted by an administrator.`,
                        `We are sorry to see you go.`
                    ],
                    accentColor: "#6B7280"
                })
            });
        } catch (err) {
            console.error("Failed to send deletion email", err);
        }

        await User.findByIdAndDelete(userId);
        
        // Note: The pre-hook in User model should handle link deletion
        
        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {
        console.error("[AdminDeleteUserError]", error);
        return res.status(500).json({ success: false, message: "Failed to delete user" });
    }
};

/* --------------------------------------------------
   LOGOUT SPECIFIC SESSION
-------------------------------------------------- */
export const logoutUserSession = async (req, res) => {
    try {
        const { userId, sessionId } = req.body;
        
        if (sessionId) {
             await mongoose.connection.db.collection("session").deleteOne({ _id: sessionId });
        }

        return res.status(200).json({
            success: true,
            message: "Session terminated successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Failed to logout session" });
    }
};

/* --------------------------------------------------
   LOGOUT USER EVERYWHERE
-------------------------------------------------- */
export const logoutUserEverywhere = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const sessionIds = user.loginHistory.map(h => h.sessionId).filter(Boolean);

        if (sessionIds.length > 0) {
            await mongoose.connection.db.collection("session").deleteMany({ 
                _id: { $in: sessionIds } 
            });
        }

        return res.status(200).json({
            success: true,
            message: "User logged out from all tracked devices"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Failed to logout user everywhere" });
    }
};
