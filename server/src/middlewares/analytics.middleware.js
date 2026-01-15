import geoip from "geoip-lite";
import { UAParser } from "ua-parser-js";
import AdminAnalytics from "../models/AdminAnalytics.js";

const analyticsMiddleware = async (req, res, next) => {
    // 1. SKIP STATIC FILES & HEALTH CHECKS
    // Don't track assets, favicon, or simple health checks to reduce noise
    if (
        req.path.match(/\.(css|js|jpg|png|gif|ico|svg|woff|img)$/i) ||
        req.path === "/health" ||
        req.originalUrl.startsWith("/api/analytics") // Don't track analytics calls themselves
    ) {
        return next();
    }

    const start = Date.now();

    // 2. CAPTURE RESPONSE FINISH
    // We need to wait for the response to finish to get the status code and duration
    res.on("finish", async () => {
        try {
            const duration = Date.now() - start;

            // 3. EXTRACT IP & LOCATION
            let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress;
            // Handle localhost/IPv6 mapping
            if (ip === "::1" || ip === "127.0.0.1") {
                ip = "127.0.0.1";
            } else if (ip && ip.includes(",")) {
                ip = ip.split(",")[0].trim();
            }

            const geo = geoip.lookup(ip);
            
            // 4. PARSE USER AGENT
            const userAgent = req.headers["user-agent"] || "";
            const parser = new UAParser(userAgent);
            const result = parser.getResult();

            // 5. IDENTIFY USER
            const userId = req.user ? req.user._id : null;
            const isGuest = !userId;

            // 6. SAVE TO DB
            await AdminAnalytics.create({
                path: req.originalUrl,
                method: req.method,
                statusCode: res.statusCode,
                duration,
                
                ip,
                userId,
                isGuest,
                // Client side will handle visitorId if we want to add cookie tracking later
                
                location: geo
                    ? {
                          country: geo.country,
                          region: geo.region,
                          city: geo.city,
                          timezone: geo.timezone,
                          coordinates: geo.ll,
                      }
                    : {},

                userAgent,
                device: {
                    type: result.device.type || "desktop", // ua-parser-js returns undefined for desktop usually
                    vendor: result.device.vendor,
                    model: result.device.model,
                },
                os: {
                    name: result.os.name,
                    version: result.os.version,
                },
                browser: {
                    name: result.browser.name,
                    version: result.browser.version,
                },
                engine: {
                    name: result.engine.name,
                    version: result.engine.version,
                },
                cpu: {
                    architecture: result.cpu.architecture,
                },

                referrer: req.headers.referer || null,
                eventType: "api_call", // Mark as API call
            });

        } catch (error) {
            console.error("Analytics Error:", error);
            // Don't crash the app if analytics fails
        }
    });

    next();
};

export default analyticsMiddleware;
