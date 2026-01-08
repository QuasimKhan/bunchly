import express from "express";
import {
    createProOrder,
    verifyProPayment,
} from "../controllers/payment.controller.js";
import { validateCoupon, getPublicCoupons } from "../controllers/coupon.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const paymentRouter = express.Router();

// Public/Protected
paymentRouter.get("/coupons/public", getPublicCoupons); // Public route for checkout suggestions

// Create Razorpay order for Pro plan
paymentRouter.post("/create-order", requireAuth, createProOrder);
paymentRouter.post("/verify", requireAuth, verifyProPayment);
paymentRouter.post("/validate-coupon", requireAuth, validateCoupon);

export default paymentRouter;
