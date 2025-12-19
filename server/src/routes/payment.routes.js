import express from "express";
import {
    createProOrder,
    verifyProPayment,
} from "../controllers/payment.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const paymentRouter = express.Router();

// Create Razorpay order for Pro plan
paymentRouter.post("/create-order", requireAuth, createProOrder);
paymentRouter.post("/verify", requireAuth, verifyProPayment);

export default paymentRouter;
