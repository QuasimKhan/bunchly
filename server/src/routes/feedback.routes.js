import express from "express";
import { requireAuth, requireAdmin } from "../middlewares/auth.middleware.js";
import { createFeedback, getAllFeedback, updateFeedbackStatus, deleteFeedback, replyToFeedback } from "../controllers/feedback.controller.js";

const feedbackRouter = express.Router();

feedbackRouter.post("/", requireAuth, createFeedback);
feedbackRouter.get("/", requireAuth, requireAdmin, getAllFeedback);
feedbackRouter.patch("/:id/status", requireAuth, requireAdmin, updateFeedbackStatus);
feedbackRouter.delete("/:id", requireAuth, requireAdmin, deleteFeedback);
feedbackRouter.post("/:id/reply", requireAuth, requireAdmin, replyToFeedback);

export default feedbackRouter;
