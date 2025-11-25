import express from "express";
import { createLink, getLinks } from "../controllers/link.controller.js";
import { requireAuth } from "../middlewares/auth..middleware.js";

const linkRouter = express.Router();

linkRouter.post("/create", requireAuth, createLink);
linkRouter.get("/", requireAuth, getLinks);

export default linkRouter;
