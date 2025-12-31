import razorpay from "../config/razorpay.js";
import { PRICING } from "../config/pricing.js";
import User from "../models/User.js";
import crypto from "crypto";
import { proReceiptEmail } from "../utils/proReceiptEmail.js";
import { sendEmail } from "../utils/brevoEmail.js";
import { generateInvoicePdf } from "../utils/generateInvoicePdf.js";
import Payment from "../models/Payment.js";

export const createProOrder = async (req, res) => {
    try {
        const user = req.user;

        //Safety checks
        if (user.plan === "pro") {
            return res.status(400).json({
                success: false,
                message: "You are already on Pro plan",
            });
        }

        const orderOptions = {
            amount: PRICING.pro.monthly.amount,
            currency: PRICING.pro.monthly.currency,
            receipt: `pro_${Date.now()}`,
        };

        const order = await razorpay.orders.create(orderOptions);

        return res.status(200).json({
            success: true,
            order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency,
            },
        });
    } catch (error) {
        console.error("Razorpay order error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create order",
        });
    }
};

export const verifyProPayment = async (req, res) => {
    try {
        const userId = req.user._id;

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            req.body;

        // Validate input
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Payment details missing",
            });
        }

        // Generate expected signature
        const signBody = `${razorpay_order_id}|${razorpay_payment_id}`;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(signBody)
            .digest("hex");

        //  Compare signatures
        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment signature",
            });
        }

        // Upgrade user to Pro
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + 1); // 1 month Pro

        await User.findByIdAndUpdate(userId, {
            plan: "pro",
            planExpiresAt: expiryDate,
            subscription: {
                provider: "razorpay",
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
                status: "active",
            },
        });

        const invoiceNumber = `INV-${Date.now()}`;

        //payment saved in database
        await Payment.create({
            userId: userId,
            plan: "pro",
            amount: 19900,
            currency: "INR",
            provider: "razorpay",
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            invoiceNumber,
            status: "paid",
        });

        const pdfDoc = generateInvoicePdf({
            invoiceNumber,
            name: req.user.name,
            email: req.user.email,
            plan: "Pro (Monthly)",
            amount: 19900,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            date: new Date().toDateString(),
        });

        const getPdfBuffer = (doc) =>
            new Promise((resolve, reject) => {
                const buffers = [];
                doc.on("data", buffers.push.bind(buffers));
                doc.on("end", () => resolve(Buffer.concat(buffers)));
                doc.on("error", reject);
                doc.end();
            });

        const pdfBuffer = await getPdfBuffer(pdfDoc);

        const emailPayload = proReceiptEmail({
            name: req.user.name,
            email: req.user.email,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            amount: 19900,
            date: new Date().toDateString(),
        });
        try {
            await sendEmail({
                to: req.user.email,
                subject: emailPayload.subject,
                html: emailPayload.html,
                attachments: [
                    {
                        filename: `Bunchly-Invoice-${invoiceNumber}.pdf`,
                        content: pdfBuffer,
                        contentType: "application/pdf",
                    },
                ],
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message || "Failed to send recipt on email",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Payment verified & Pro activated",
            expiresAt: expiryDate,
        });
    } catch (error) {
        console.error("Payment verification error:", error);
        return res.status(500).json({
            success: false,
            message: "Payment verification failed",
        });
    }
};
