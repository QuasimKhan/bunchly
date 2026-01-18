import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";

import { corsOptions } from "./config/cors.js";
import { sessionMiddleware } from "./config/session.js";
import authRouter from "./routes/auth.routes.js";
import profileRouter from "./routes/profile.routes.js";
import linkRouter from "./routes/link.routes.js";
import { redirectLink } from "./controllers/link.controller.js";
import userAnalyticsRouter from "./routes/userAnalytics.routes.js"; // New
import adminAnalyticsRouter from "./routes/adminAnalytics.routes.js"; // New
// ...
// ... existing imports ...

import paymentRouter from "./routes/payment.routes.js";
import { startCronJobs } from "./cron.js";
import billingRouter from "./routes/billing.routes.js";
import adminRouter from "./routes/admin.routes.js";
import seoRouter from "./routes/seo.routes.js";
import settingsRouter from "./routes/settings.routes.js";
import feedbackRouter from "./routes/feedback.routes.js";
import reportRouter from "./routes/report.routes.js";

const app = express();
startCronJobs();

//middlewares
app.use(helmet());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors(corsOptions));
app.set("trust proxy", 1);

import { authLimiter, apiLimiter } from "./config/rateLimit.js";

app.use(sessionMiddleware);

import analyticsMiddleware from "./middlewares/analytics.middleware.js";
app.use(analyticsMiddleware);

//routes

// ... imports ...
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ... (keep usage of other middleware)

//routes
app.use("/api/auth", authLimiter, authRouter);
app.use("/api/user", apiLimiter, profileRouter);
app.use("/api/links", apiLimiter, linkRouter);
app.get("/l/:id", redirectLink);
import analyticsRouter from "./routes/analytics.routes.js"; 

app.use("/api/analytics", analyticsRouter);
app.use("/api/analytics", apiLimiter, userAnalyticsRouter);
app.use("/api/admin/analytics", apiLimiter, adminAnalyticsRouter);
app.use("/api/payment", apiLimiter, paymentRouter);
app.use("/api/billing", apiLimiter, billingRouter);
app.use("/api/admin", apiLimiter, adminRouter);
app.use("/api", apiLimiter, seoRouter);
app.use("/api/settings", apiLimiter, settingsRouter);
app.use("/api/feedback", apiLimiter, feedbackRouter);
app.use("/api/reports", apiLimiter, reportRouter);

import sitemapRouter from "./routes/sitemap.routes.js";
app.use("/", sitemapRouter);

app.get("/api/session", (req, res) => {
    if (!req.session.views) req.session.views = 1;
    else req.session.views++;

    res.json({
        success: true,
        views: req.session.views,
        message: "Session views fetch successfully ",
    });
});

// Ping
app.get("/ping", (req, res) => {
    res.send("awake");
});

import User from "./models/User.js";

// -------------------------------------------------------------------------
// SERVE FRONTEND + DYNAMIC META INJECTION
// -------------------------------------------------------------------------

// Helper to read index.html
const getHtml = () => {
    const htmlPath = path.join(__dirname, "../../client/dist/index.html");
    if (fs.existsSync(htmlPath)) {
        return fs.readFileSync(htmlPath, "utf8");
    }
    return null;
};

// Serve static files from client/dist (CSS, JS, Images)
app.use(express.static(path.join(__dirname, "../../client/dist")));

// Dynamic SEO Injection for User Profiles
app.get("/:username", async (req, res, next) => {
    const { username } = req.params;

    // Skip if it looks like a file or api
    if (username.startsWith("api") || username.includes(".")) {
        return next();
    }

    try {
        let html = getHtml();
        if (!html) return res.send("System building... please refresh in a moment.");

        // Find user by username
        const user = await User.findOne({ username, "flags.isBanned": false });

        if (user) {
            // Data for Meta Tags
            const title = `${user.name || user.username} (@${user.username}) – Bunchly`;
            const description = user.bio ? user.bio.substring(0, 160) : "View my digital identity on Bunchly.";
            const image = user.image || "https://bunchly.in/img/og-image.png";
            const url = `https://bunchly.in/${user.username}`;

            // Helper to safe-replace regex
            const replaceMeta = (tag, newValue) => {
                const regex = new RegExp(`<meta property="${tag}" content=".*?" />`, "g");
                html = html.replace(regex, `<meta property="${tag}" content="${newValue}" />`);
            };

            const replaceTwitter = (tag, newValue) => {
                const regex = new RegExp(`<meta name="${tag}" content=".*?" />`, "g");
                html = html.replace(regex, `<meta name="${tag}" content="${newValue}" />`);
            };

            // 1. Title
            html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
            
            // 2. Description
            html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${description}" />`);

            // 3. Open Graph
            replaceMeta("og:title", title);
            replaceMeta("og:description", description);
            replaceMeta("og:image", image);
            replaceMeta("og:url", url);

            // 4. Twitter Card
            replaceTwitter("twitter:title", title);
            replaceTwitter("twitter:description", description);
            replaceTwitter("twitter:image", image);
        }

        res.send(html);
    } catch (error) {
        console.error("SEO Injection Error:", error);
        // Fallback
        const html = getHtml();
        if (html) res.send(html);
        else next();
    }
});

// Fallback for all other routes (SPA)
app.use((req, res, next) => {
    if (req.method === "GET") {
        const html = getHtml();
        if (html) {
            return res.send(html);
        }
    }
    // If not GET or no HTML, continue to 404
    next();
});


//ping to awake server in free tier of hosting
app.get("/ping", (req, res) => {
    res.send("awake");
});

export default app;
