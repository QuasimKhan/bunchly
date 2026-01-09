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
    forgotPassword,
    verifyOtp,
    resetPassword,
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

/* Forgot Password Routes */
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post("/reset-password", resetPassword);

export default authRouter;
