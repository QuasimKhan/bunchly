import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";

import { corsOptions } from "./config/cors.js";
import { sessionMiddleware } from "./config/session.js";

import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import linkRouter from "./routes/link.routes.js";

const app = express();

// --------------------
// Global Middlewares
// --------------------
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors(corsOptions));
app.set("trust proxy", 1);

// -----------------------------------------------------
// 1️⃣ PUBLIC ROUTES (NO SESSION, NO AUTH REQUIRED)
// -----------------------------------------------------

// Auth routes like login/signup — public
app.use("/api/auth", authRouter);

// Public user profile route (e.g., /api/user/public/quasim)
app.use("/api/user/public", userRouter);

// Health check
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "LinkHub API running",
    });
});

// Ping for uptime robot or hosting free tier
app.get("/ping", (req, res) => res.send("awake"));

// -----------------------------------------------------
// 2️⃣ SESSION MIDDLEWARE (APPLIED ONLY TO PROTECTED ROUTES)
// -----------------------------------------------------
app.use(sessionMiddleware);

// -----------------------------------------------------
// 3️⃣ PROTECTED ROUTES (NEED AUTH)
// -----------------------------------------------------

// All other /api/user routes (dashboard, delete user, etc.)
app.use("/api/user", userRouter);

// Link management routes (always protected)
app.use("/api/links", linkRouter);

// -----------------------------------------------------
export default app;
