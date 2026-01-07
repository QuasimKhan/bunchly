import geoip from "geoip-lite";
import { UAParser } from "ua-parser-js";

export const getAnalyticsContext = (req) => {
    // IP (supports proxies)
    const ip =
        req.headers["x-forwarded-for"]?.split(",")[0] ||
        req.socket.remoteAddress;

    const geo = geoip.lookup(ip);

    const ua = UAParser(req.headers["user-agent"]);

    return {
        country: geo?.country || "Unknown",
        city: geo?.city || "Unknown",
        device: ua.device.type || "desktop", // mobile / tablet / desktop
        os: ua.os.name || "Unknown",
        browser: ua.browser.name || "Unknown",
        referrer: req.headers["referer"] || "Direct",
    };
};
