import express from "express";
import {
    downloadInvoice,
    getBillingHistory,
} from "../controllers/billing.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const billingRouter = express.Router();

billingRouter.get("/", requireAuth, getBillingHistory);
billingRouter.get("/invoice/:invoiceNumber", requireAuth, downloadInvoice);

export default billingRouter;
