import rateLimit from "express-rate-limit";

const createLimiter = (windowMs, max, message) => {
    return rateLimit({
        windowMs,
        max,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            success: false,
            message,
        },
        keyGenerator: (req) => {
            // Use user ID if authenticated, otherwise use IP
            // Adjust based on where your user object is stored (req.user or req.session)
            if (req.user && req.user._id) return req.user._id.toString();
            if (req.session && req.session.userId) return req.session.userId;
            return req["ip"];
        },
        validate: {
            ip: false,
            trustProxy: false,
        },
    });
};

// Strict limit for authentication routes (prevent brute force)
export const authLimiter = createLimiter(
    15 * 60 * 1000, // 15 minutes
    20, // 20 requests per 15 mins
    "Too many login attempts, please try again after 15 minutes."
);

// Standard limit for general API routes
export const apiLimiter = createLimiter(
    1 * 60 * 1000, // 1 minute
    100, // 100 requests per minute
    "Too many requests, please try again later."
);
