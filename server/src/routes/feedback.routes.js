import express from "express";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware.js";
import { createFeedback, getAllFeedback } from "../controllers/feedback.controller.js";

const feedbackRouter = express.Router();

feedbackRouter.post("/", requireAuth, createFeedback);
feedbackRouter.get("/", requireAuth, requireAdmin, getAllFeedback);

export default feedbackRouter;
