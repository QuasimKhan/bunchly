import express from "express";
import { requireAuth } from "../middlewares/auth..middleware.js";

const userRouter = express.Router();

userRouter.get("/dashboard", requireAuth, (req, res) => {
    res.send("Dashboard and you are authorized");
});

export default userRouter;
