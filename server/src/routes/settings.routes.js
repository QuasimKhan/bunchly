import express from "express";
import { getSettings, updateSettings, sendBroadcast } from "../controllers/settings.controller.js";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware.js";

const settingsRouter = express.Router();

// Public (or semi-public) - anyone needs to see if sale is active
settingsRouter.get("/", getSettings);

// Admin Only
settingsRouter.put("/", requireAuth, requireAdmin, updateSettings);
settingsRouter.post("/broadcast", requireAuth, requireAdmin, sendBroadcast);

export default settingsRouter;
