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

const app = express();
startCronJobs();

//middlewares
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors(corsOptions));
app.set("trust proxy", 1);

app.use(sessionMiddleware);

//routes

app.use("/api/auth", authRouter);
app.use("/api/user", profileRouter);
app.use("/api/links", linkRouter);
app.get("/l/:id", redirectLink);
app.use("/api/analytics", analyticsRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/billing", billingRouter);
app.use("/api/admin", adminRouter);
app.use("/api", seoRouter);
app.use("/api/settings", settingsRouter);

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
