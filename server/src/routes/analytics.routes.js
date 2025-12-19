import express from "express";
import { getAnalytics } from "../controllers/analytics.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const analyticsRouter = express.Router();

// Pro-only analytics
analyticsRouter.get("/", requireAuth, getAnalytics);

export default analyticsRouter;
