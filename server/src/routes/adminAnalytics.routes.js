import express from "express";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware.js";
import {
    getOverview,
    getTimeSeries,
    getGeoStats,
    getDeviceStats,
    getTopPages
} from "../controllers/adminAnalytics.controller.js";

const router = express.Router();

// Admin Middleware for all these routes
router.use(requireAuth, requireAdmin);

router.get("/overview", getOverview);
router.get("/time-series", getTimeSeries);
router.get("/geo", getGeoStats);
router.get("/devices", getDeviceStats);
router.get("/pages", getTopPages);

export default router;
