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
import analyticsRouter from "./routes/analytics.routes.js";
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

//routes

app.use("/api/auth", authLimiter, authRouter);
app.use("/api/user", apiLimiter, profileRouter);
app.use("/api/links", apiLimiter, linkRouter);
app.get("/l/:id", redirectLink);
app.use("/api/analytics", apiLimiter, analyticsRouter);
app.use("/api/payment", apiLimiter, paymentRouter);
app.use("/api/billing", apiLimiter, billingRouter);
app.use("/api/admin", apiLimiter, adminRouter);
app.use("/api", apiLimiter, seoRouter);
app.use("/api/settings", apiLimiter, settingsRouter);
app.use("/api/feedback", apiLimiter, feedbackRouter);
app.use("/api/reports", apiLimiter, reportRouter);

app.get("/api/session", (req, res) => {
    if (!req.session.views) req.session.views = 1;
    else req.session.views++;

    res.json({
        success: true,
        views: req.session.views,
        message: "Session views fetch succussfully ",
    });
});

//health check route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "LinkHub API running",
    });
});

//ping to awake server in free tier of hosting
app.get("/ping", (req, res) => {
    res.send("awake");
});

export default app;
