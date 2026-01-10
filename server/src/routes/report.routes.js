import express from "express";
import { createReport, getReports, updateReportStatus, deleteReport } from "../controllers/report.controller.js";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public Route
router.post("/", createReport);

// Admin Routes
router.get("/", requireAuth, requireAdmin, getReports);
router.patch("/:id", requireAuth, requireAdmin, updateReportStatus);
router.delete("/:id", requireAuth, requireAdmin, deleteReport);


export default router;
