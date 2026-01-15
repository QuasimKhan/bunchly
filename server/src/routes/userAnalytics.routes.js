import express from "express";
import { getAnalytics } from "../controllers/userAnalytics.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

// User Analytics (Protected by Login)
router.get("/", requireAuth, getAnalytics);

export default router;
