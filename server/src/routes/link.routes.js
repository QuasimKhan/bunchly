import express from "express";
import {
    createLink,
    deleteLink,
    getLinks,
    reorderLinks,
    updateLink,
    redirectLink,
    getLinkPreview, // Import
} from "../controllers/link.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const linkRouter = express.Router();

linkRouter.post("/preview", requireAuth, getLinkPreview); // New route
linkRouter.post("/create", requireAuth, createLink);
linkRouter.get("/", requireAuth, getLinks);
linkRouter.patch("/reorder", requireAuth, reorderLinks);
linkRouter.get("/:id/redirect", redirectLink); // Public route for tracking
linkRouter.patch("/:id", requireAuth, updateLink);
linkRouter.delete("/:id", requireAuth, deleteLink);

export default linkRouter;
