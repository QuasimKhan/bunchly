import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import { corsOptions } from "./config/cors.js";
import { sessionMiddleware } from "./config/session.js";
import authRouter from "./routes/auth.routes.js";

const app = express();

//middlewares
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(sessionMiddleware);

//routes

app.use("/api/auth", authRouter);
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
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "LinkHub API running",
    });
});

export default app;
