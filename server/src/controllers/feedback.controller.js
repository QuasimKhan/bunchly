import Feedback from "../models/Feedback.js";
import { sendEmail } from "../utils/brevoEmail.js";
import { getPremiumEmailHtml } from "../utils/emailTemplates.js";

// @desc    Create new feedback
// @route   POST /api/feedback
// @access  Private
export const createFeedback = async (req, res) => {
    try {
        const { type, message } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: "Message is required",
            });
        }

        const feedback = await Feedback.create({
            user: req.user._id,
            type: type || "general",
            message,
        });

        res.status(201).json({
            success: true,
            data: feedback,
            message: "Thank you for your feedback!",
        });
    } catch (error) {
        console.error("Create feedback error:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

// @desc    Get all feedback (Admin only - placeholder for future)
// @route   GET /api/feedback
// @access  Private/Admin
export const getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find()
            .populate("user", "name email username")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: feedbacks,
        });
    } catch (error) {
        console.error("Get feedback error:", error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
// @desc    Update feedback status
// @route   PATCH /api/feedback/:id/status
// @access  Private/Admin
export const updateFeedbackStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const feedback = await Feedback.findById(id);
        if (!feedback) {
            return res.status(404).json({ success: false, message: "Feedback not found" });
        }

        feedback.status = status;
        await feedback.save();

        res.status(200).json({
            success: true,
            message: `Status updated to ${status}`,
            data: feedback
        });
    } catch (error) {
        console.error("Update feedback status error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Delete feedback
// @route   DELETE /api/feedback/:id
// @access  Private/Admin
export const deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const feedback = await Feedback.findByIdAndDelete(id);

        if (!feedback) {
            return res.status(404).json({ success: false, message: "Feedback not found" });
        }

        res.status(200).json({ success: true, message: "Feedback deleted successfully" });
    } catch (error) {
        console.error("Delete feedback error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// @desc    Reply to feedback (Email)
// @route   POST /api/feedback/:id/reply
// @access  Private/Admin
export const replyToFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const { message, subject } = req.body;

        const feedback = await Feedback.findById(id).populate("user", "email name");
        if (!feedback) {
            return res.status(404).json({ success: false, message: "Feedback not found" });
        }

        // Send Email
        await sendEmail({
            to: feedback.user.email,
            subject: subject || "Response to your feedback - Bunchly",
            html: getPremiumEmailHtml({
                title: "Feedback Response 📬",
                messageLines: [
                    `Hi ${feedback.user.name},`,
                    `Thank you for your feedback regarding:`,
                    `"${feedback.message}"`,
                    `<br/><strong>Our Response:</strong>`,
                    message,
                    `<br/>We appreciate your input!`
                ],
                actionText: "Go to Dashboard",
                actionUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard`,
                accentColor: "#6366f1"
            })
        });

        // Auto-update status to resolved if replying? Maybe just 'read' or 'in-progress'. 
        // Let's keep it manual or set to 'in-progress' if it was 'new'
        if (feedback.status === 'new') {
            feedback.status = 'in-progress';
            await feedback.save();
        }

        res.status(200).json({ success: true, message: "Reply sent successfully" });
    } catch (error) {
        console.error("Reply feedback error:", error);
        res.status(500).json({ success: false, message: "Failed to send reply" });
    }
};
