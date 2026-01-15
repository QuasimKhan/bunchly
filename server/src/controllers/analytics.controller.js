import AdminAnalytics from "../models/AdminAnalytics.js";
import geoip from "geoip-lite";
import { UAParser } from "ua-parser-js";

export const collectEvent = async (req, res) => {
    try {
        const {
            path,
            eventType = "pageview",
            screenResolution,
            language,
            sessionId,
            viewport,
            visitorId,
            referrer
        } = req.body;

        console.log("Analytics: Received Event", { eventType, path, sessionId });

        // 1. EXTRACT IP & LOCATION
        let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress;
        if (ip === "::1" || ip === "127.0.0.1") {
            ip = "127.0.0.1";
        } else if (ip && ip.includes(",")) {
            ip = ip.split(",")[0].trim();
        }

        const geo = geoip.lookup(ip);

        // 2. PARSE USER AGENT
        const userAgent = req.headers["user-agent"] || "";
        const parser = new UAParser(userAgent);
        const result = parser.getResult();

        // 3. IDENTIFY USER (if authenticated via cookie/token)
        // Note: Middleware usually handles req.user if present
        const userId = req.user ? req.user._id : null;
        const isGuest = !userId;

        // 4. CREATE ENTRY
        const newEntry = await AdminAnalytics.create({
            path,
            method: "POST", 
            statusCode: 200, 
            duration: 0, 

            ip,
            userId,
            isGuest,
            visitorId,
            sessionId,

            eventType, // Ensure this is in Schema
            screenResolution,
            viewport,
            language,
            
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
                type: result.device.type || "desktop",
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

            referrer,
        });

        console.log("Analytics: Saved Entry", newEntry._id);

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Analytics Collection Error:", error);
        res.status(200).json({ success: false }); 
    }
};
