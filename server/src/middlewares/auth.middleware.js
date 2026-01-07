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

        // Check if user is banned
        if (user.flags && user.flags.isBanned) {
            req.session.destroy(() => {});
            return res.status(403).json({
                success: false,
                message: "This account has been banned. Please contact support.",
                isBanned: true
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

export const requireAdmin = async (req, res, next) => {
    // This expects requireAuth to be run BEFORE it
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Access Denied: Admins only",
        });
    }
    next();
};
