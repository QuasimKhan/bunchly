import Payment from "../models/Payment.js";
import User from "../models/User.js";
import Link from "../models/Link.js";
import emailTemplates from "../utils/emailTemplates.js";
import { sendEmail } from "../utils/brevoEmail.js";
import { generateInvoicePdf } from "../utils/generateInvoicePdf.js";

/* --------------------------------------------------
   GET BILLING HISTORY
-------------------------------------------------- */
export const getBillingHistory = async (req, res) => {
    try {
        const userId = req.user._id;

        const payments = await Payment.find({ userId })
            .sort({ createdAt: -1 })
            .select("plan amount currency invoiceNumber status createdAt")
            .lean();

        return res.status(200).json({
            success: true,
            count: payments.length,
            data: payments,
        });
    } catch (error) {
        console.error("[BillingHistoryError]", error);
        return res.status(500).json({
            success: false,
            message: "Unable to fetch billing history",
        });
    }
};

/* --------------------------------------------------
   DOWNLOAD INVOICE (ON-DEMAND, SECURE)
-------------------------------------------------- */
export const downloadInvoice = async (req, res) => {
    try {
        const { invoiceNumber } = req.params;
        // const userId = req.user._id; // Admin might want to download, or we just rely on Payment ID lookup + simple ownership check

        const payment = await Payment.findOne({ invoiceNumber }).populate("userId");

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Invoice not found",
            });
        }

        // Check ownership
        if (payment.userId._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }

        let title = "Invoice";
        let description = "";

        if (payment.status === "refunded") {
            title = "Credit Note";
            description = `Refund for Bunchly ${payment.plan} Plan`;
        } else if (payment.status === "refund_rejected") {
            title = "Rejection Notice";
            description = "Refund Request Rejected";
        }

        const doc = generateInvoicePdf({
            invoiceNumber: payment.invoiceNumber,
            name: payment.userId.name,
            email: payment.userId.email,
            plan: payment.plan || "Free",
            amount: payment.amount,
            paymentId: payment.paymentId,
            orderId: payment.orderId,
            date: new Date(payment.createdAt).toLocaleDateString(),
            title: title,
            itemDescription: description
        });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=${title}-${invoiceNumber}.pdf`
        );

        doc.pipe(res);
        doc.end();

    } catch (error) {
        console.error("[DownloadInvoiceError]", error);
        return res.status(500).json({
            success: false,
            message: "Failed to generate invoice",
        });
    }
};

/* --------------------------------------------------
   REQUEST REFUND
-------------------------------------------------- */


export const requestRefund = async (req, res) => {
    try {
        const { reason } = req.body;
        const user = req.user;

        if (!user || user.plan !== "pro") {
            return res.status(400).json({
                success: false,
                message: "Only Pro users can request a refund",
            });
        }

        if (!reason) {
            return res.status(400).json({
                success: false,
                message: "Please provide a reason for the refund",
            });
        }

        // Find the latest "paid" payment for this user
        const latestPayment = await Payment.findOne({ 
            userId: user._id, 
            status: "paid",
            plan: "pro"
        }).sort({ createdAt: -1 });

        if (!latestPayment) {
            return res.status(404).json({
                success: false,
                message: "No active Pro payment found to refund.",
            });
        }

        // Check 3-Day Window
        const paymentDate = new Date(latestPayment.createdAt);
        const currentDate = new Date();
        const diffTime = Math.abs(currentDate - paymentDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 3) {
             return res.status(400).json({
                success: false,
                message: "Refunds can only be requested within 3 days of purchase.",
            });
        }

        // Check if already requested (just in case)
        if (latestPayment.refundRequestStatus === "requested") {
             return res.status(400).json({
                success: false,
                message: "Refund request already submitted.",
            });
        }

        // Update with new fields WITHOUT changing original status
        latestPayment.refundRequestStatus = "requested";
        latestPayment.refundReason = reason;
        latestPayment.refundRequestedAt = new Date();
        await latestPayment.save();

        // Email to Support
        const supportEmail = "bunchly.contact@gmail.com"; 
        
        await sendEmail({
            to: supportEmail,
            subject: `[Refund Request] ${user.email}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px;">
                    <h2 style="color: #4F46E5;">New Refund Request</h2>
                    <p><strong>User:</strong> ${user.name} (${user.email})</p>
                    <p><strong>User ID:</strong> ${user._id}</p>
                    <p><strong>Payment ID:</strong> ${latestPayment.paymentId}</p>
                    <p><strong>Order ID:</strong> ${latestPayment.orderId}</p>
                    <p><strong>Amount:</strong> ₹${latestPayment.amount / 100}</p>
                    <p><strong>Reason:</strong></p>
                    <blockquote style="background: #f4f4f5; padding: 15px; border-left: 4px solid #4F46E5;">
                        ${reason}
                    </blockquote>
                    <p style="color: #666; font-size: 12px; margin-top: 20px;">
                        This email was sent automatically from the Bunchly Dashboard.
                    </p>
                </div>
            `
        });

        // Confirmation to User
        await sendEmail({
            to: user.email,
            subject: "We've received your refund request",
            html: `
                <div style="font-family: sans-serif; padding: 20px;">
                    <h2>Refund Request Received</h2>
                    <p>Hi ${user.name},</p>
                    <p>We have received your request for a refund for your Pro plan associated with Payment ID <strong>${latestPayment.paymentId}</strong>.</p>
                    <p>Our support team will review your case and get back to you within 24-48 hours.</p>
                    <p><strong>Your Reason:</strong> ${reason}</p>
                    <br>
                    <p>Best,<br>The Bunchly Team</p>
                </div>
            `
        });

        return res.status(200).json({
            success: true,
            message: "Refund request sent successfully",
        });

    } catch (error) {
        console.error("[RefundRequestError]", error);
        return res.status(500).json({
            success: false,
            message: "Failed to send refund request",
        });
    }
};


