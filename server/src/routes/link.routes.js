import express from "express";
import {
    createLink,
    deleteLink,
    getLinks,
    reorderLinks,
    updateLink,
} from "../controllers/link.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const linkRouter = express.Router();

linkRouter.post("/create", requireAuth, createLink);
linkRouter.get("/", requireAuth, getLinks);
linkRouter.patch("/reorder", requireAuth, reorderLinks);
linkRouter.patch("/:id", requireAuth, updateLink);
linkRouter.delete("/:id", requireAuth, deleteLink);

export default linkRouter;
