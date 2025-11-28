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
app.use("/api/user", userRouter);
app.use("/api/links", linkRouter);
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
