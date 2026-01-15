import express from "express";
import { collectEvent } from "../controllers/analytics.controller.js";

const router = express.Router();

// Public endpoint for tracking
router.post("/collect", collectEvent);

export default router;
