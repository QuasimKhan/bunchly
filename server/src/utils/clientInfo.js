import geoip from "geoip-lite";
import { UAParser } from "ua-parser-js";

export const getClientInfo = (req) => {
    const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.ip || "127.0.0.1";
    const userAgent = req.headers["user-agent"] || "";
    
    // Parse User Agent
    const parser = new UAParser(userAgent);
    const result = parser.getResult();
    
    // Parse Geo Location
    // geoip.lookup might fail for local IPs (127.0.0.1)
    const geo = geoip.lookup(ip);

    return {
        ip,
        device: result.device.model || "Desktop",
        os: `${result.os.name || "Unknown"} ${result.os.version || ""}`.trim(),
        browser: `${result.browser.name || "Unknown"} ${result.browser.version || ""}`.trim(),
        location: {
            city: geo?.city || "Unknown",
            country: geo?.country || "Unknown",
            timezone: geo?.timezone || "UTC"
        }
    };
};
