import express from "express";
import {
    login,
    signup,
    verifyEmail,
    googleAuthRedirect,
    googleAuthCallback,
    getMe,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.get("/verify", verifyEmail);
authRouter.post("/login", login);
authRouter.get("/google", googleAuthRedirect);
authRouter.get("/google/callback", googleAuthCallback);
authRouter.get("/me", getMe);

export default authRouter;
