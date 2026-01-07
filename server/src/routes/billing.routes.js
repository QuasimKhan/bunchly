import express from "express";
import {
    downloadInvoice,
    getBillingHistory,
    requestRefund,
} from "../controllers/billing.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const billingRouter = express.Router();

billingRouter.get("/", requireAuth, getBillingHistory);
billingRouter.get("/invoice/:invoiceNumber", requireAuth, downloadInvoice);
billingRouter.post("/refund", requireAuth, requestRefund);

export default billingRouter;
