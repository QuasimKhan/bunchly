import express from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
    deleteUser,
    getPublicProfile,
    updateProfile,
} from "../controllers/profile.controller.js";

const userRouter = express.Router();

userRouter.get("/dashboard", requireAuth, (req, res) => {
    res.send("Dashboard and you are authorized");
});

userRouter.delete("/:userId", requireAuth, deleteUser);
userRouter.patch("/update-profile", updateProfile);

userRouter.get("/public/:username", getPublicProfile);

export default userRouter;
