import mongoose from "mongoose";
import User from "../models/User.js";
import Payment from "../models/Payment.js";
import Link from "../models/Link.js";
import emailTemplates from "../utils/emailTemplates.js";
import { sendEmail } from "../utils/brevoEmail.js";
import Razorpay from "razorpay";
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
   GET REFUND REQUESTS
-------------------------------------------------- */
export const getRefundRequests = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const requests = await Payment.find({ refundRequestStatus: "requested" })
            .populate("userId", "name email image")
            .sort({ refundRequestedAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Payment.countDocuments({ refundRequestStatus: "requested" });

        res.json({
            success: true,
            requests,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error("Error fetching refund requests:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const processRefund = async (req, res) => {
    try {
        const { id } = req.params;
        const { action, rejectionReason } = req.body; // action: "approve" or "reject"
        
        const originalPayment = await Payment.findById(id).populate("userId");

        if (!originalPayment) {
            return res.status(404).json({ success: false, message: "Payment not found" });
        }

        if (action === "reject") {
            if (originalPayment.refundRequestStatus !== "requested") {
                return res.status(400).json({ success: false, message: "No pending refund request to reject" });
            }
        } else if (action === "approve") {
            // Check if already refunded
            if (originalPayment.status === "refunded" || originalPayment.refundRequestStatus === "approved") {
                return res.status(400).json({ success: false, message: "Payment is already refunded" });
            }
        }

        const user = originalPayment.userId;

        if (action === "reject") {
            // Update original payment
            originalPayment.refundRequestStatus = "rejected";
            await originalPayment.save();

            // Create NEW "Refund Rejected" Record for History
            await Payment.create({
                userId: user._id,
                plan: originalPayment.plan,
                amount: 0,
                currency: originalPayment.currency,
                provider: originalPayment.provider,
                orderId: `REF-REJ-${Date.now()}`,
                paymentId: `REF-REJ-${Date.now()}`,
                invoiceNumber: `INV-REJ-${Date.now()}`,
                status: "refund_rejected",
                refundReason: rejectionReason || "Refund Rejected"
            });

            // Email: Refund Rejected
             await sendEmail({
                to: user.email,
                subject: "Update on your Refund Request",
                html: getPremiumEmailHtml({
                    title: "Refund Request Rejected",
                    messageLines: [
                        `Hi ${user.name},`,
                        `We reviewed your request for a refund regarding Order #${originalPayment.orderId}.`,
                        `After careful consideration, we are unable to approve your refund request at this time.`,
                        rejectionReason ? `<strong>Reason:</strong> ${rejectionReason}` : null,
                        `You can review our refund policy or contact support if you have further questions.`
                    ].filter(Boolean),
                    accentColor: "#DC2626", // Red
                    actionText: "Contact Support",
                    actionUrl: `mailto:bunchly.contact@gmail.com`
                })
            });

            return res.json({ success: true, message: "Refund rejected" });

        } else if (action === "approve") {
            // Process Refund via Razorpay
            try {
                // Initialize Razorpay
                const instance = new Razorpay({
                    key_id: process.env.RAZORPAY_KEY_ID,
                    key_secret: process.env.RAZORPAY_KEY_SECRET,
                });

                // Request refund from Razorpay
                try {
                    await instance.payments.refund(originalPayment.paymentId, {
                        speed: "normal",
                        notes: {
                            reason: "Admin approved refund",
                            adminId: req.user._id.toString()
                        }
                    });
                } catch (razorpayError) {
                    console.error("Razorpay Refund Error:", razorpayError);
                    return res.status(400).json({
                        success: false,
                        message: razorpayError.error?.description || "Razorpay Refund Failed. Check balance or credentials."
                    });
                }

                // Update original payment
                originalPayment.refundRequestStatus = "approved";
                await originalPayment.save();

                // Create NEW "Refunded" Record for History
                await Payment.create({
                    userId: user._id,
                    plan: originalPayment.plan,
                    amount: originalPayment.amount, // Record the refunded amount
                    currency: originalPayment.currency,
                    provider: originalPayment.provider,
                    orderId: `REF-${Date.now()}`,
                    paymentId: `REF-${Date.now()}`,
                    invoiceNumber: `INV-REF-${Date.now()}`,
                    status: "refunded",
                    refundReason: originalPayment.refundReason
                });

                // Downgrade User
                await User.findByIdAndUpdate(user._id, {
                    plan: "free",
                    $unset: { subscriptionId: 1, planExpiresAt: 1 }
                });

                // Email
                await sendEmail({
                    to: user.email,
                    subject: "Refund Approved - Bunchly",
                    html: getPremiumEmailHtml({
                        title: "Refund Processed",
                        messageLines: [
                            `Hi ${user.name},`,
                            `Your refund request has been <strong>approved</strong>.`,
                            `A refund of <strong>₹${originalPayment.amount / 100}</strong> has been initiated.`,
                            `The amount will reflect in your original payment source within 5-7 business days.`,
                            `Your account plan has been reverted to <strong>Free</strong>.`
                        ],
                        accentColor: "#10B981" // Green
                    })
                });

                return res.json({ success: true, message: "Refund processed successfully" });

            } catch (razorpayError) {
                console.error("Razorpay Refund Error:", razorpayError);
                return res.status(500).json({ 
                    success: false, 
                    message: "Failed to process refund with payment gateway" 
                });
            }
        } else {
            return res.status(400).json({ success: false, message: "Invalid action" });
        }

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
                .select("name email plan createdAt image"),
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
            else if (role === 'user') query.plan = 'free'; // Fixed: Filter specifically for free tier
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

/* --------------------------------------------------
   MANAGE STRIKES
-------------------------------------------------- */
export const manageStrikes = async (req, res) => {
    try {
        const { userId } = req.params;
        const { action, reason } = req.body; // action: 'add' | 'remove'

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const currentStrikes = user.flags.strikes || 0;
        let newStrikes = currentStrikes;

        if (action === 'add') {
            newStrikes = currentStrikes + 1;
        } else if (action === 'remove') {
            newStrikes = Math.max(0, currentStrikes - 1);
        }

        user.flags.strikes = newStrikes;
        
        // Auto-ban logic (Optional, but good for "real-time standing")
        if (newStrikes >= 3 && !user.flags.isBanned) {
            user.flags.isBanned = true;
            // You might want to log this auto-ban or send a specific email
        }

        await user.save();

        // EMAIL: Strike Notification
        if (action === 'add') {
             await sendEmail({
                to: user.email,
                subject: "Account Warning: Strike Issued",
                html: getPremiumEmailHtml({
                    title: "Community Guidelines Violation ⚠️",
                    messageLines: [
                        `Hi ${user.name},`,
                        `A strike has been issued against your account due to a violation of our policies.`,
                        reason ? `<strong>Reason:</strong> ${reason}` : null,
                        `<strong>Current Strikes:</strong> ${newStrikes}/3`,
                        `Please review our terms to avoid further account restrictions. Accumulating 3 strikes will result in account suspension.`
                    ].filter(Boolean),
                    warning: true
                })
            });
        } else if (action === 'remove') {
             await sendEmail({
                to: user.email,
                subject: "Account Update: Strike Removed",
                html: getPremiumEmailHtml({
                    title: "Strike Removed ✅",
                    messageLines: [
                        `Hi ${user.name},`,
                        `Good news! A strike has been removed from your account record.`,
                        `<strong>Current Strikes:</strong> ${newStrikes}/3`,
                        `Thank you for maintaining a positive standing in our community.`
                    ],
                    accentColor: "#10B981" // Green
                })
            });
        }

        return res.status(200).json({
            success: true,
            message: `Strike ${action === 'add' ? 'issued' : 'removed'} successfully`,
            strikes: newStrikes,
            isBanned: user.flags.isBanned
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Failed to manage strikes" });
    }
};
