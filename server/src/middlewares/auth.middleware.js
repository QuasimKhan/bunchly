import User from "../models/User.js";

export const requireAuth = async (req, res, next) => {
    try {
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            // Clear invalid session
            req.session.destroy(() => {});
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        // Attach to request (this is the correct thing)
        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
