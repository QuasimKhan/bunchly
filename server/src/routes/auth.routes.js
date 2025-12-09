import express from "express";
import {
    login,
    signup,
    verifyEmail,
    googleAuthRedirect,
    googleAuthCallback,
    getMe,
    logout,
    resendVerification,
    checkUsernameAvailability,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.get("/check-username", checkUsernameAvailability);
authRouter.get("/verify", verifyEmail);
authRouter.post("/resend-verification", resendVerification);
authRouter.post("/login", login);
authRouter.get("/google", googleAuthRedirect);
authRouter.get("/google/callback", googleAuthCallback);
authRouter.get("/me", getMe);
authRouter.post("/logout", logout);
export default authRouter;
