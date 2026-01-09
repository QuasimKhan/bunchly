import Feedback from "../models/Feedback.js";

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
