import Payment from "../models/Payment.js";
import User from "../models/User.js";
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
        const userId = req.user._id;

        if (!invoiceNumber) {
            return res.status(400).json({
                success: false,
                message: "Invoice number is required",
            });
        }

        // Validate payment ownership
        const payment = await Payment.findOne({
            invoiceNumber,
            userId,
            status: "paid",
        });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Invoice not found",
            });
        }

        // Fetch user details
        const user = await User.findById(userId).select("name email");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Generate PDF on-demand (same as email)
        const pdfDoc = generateInvoicePdf({
            invoiceNumber: payment.invoiceNumber,
            name: user.name,
            email: user.email,
            plan: "Pro (Monthly)",
            amount: payment.amount,
            paymentId: payment.paymentId,
            orderId: payment.orderId,
            date: payment.createdAt.toDateString(),
        });

        // Stream PDF to browser
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="Bunchly-Invoice-${invoiceNumber}.pdf"`
        );

        pdfDoc.pipe(res);
        pdfDoc.end();
    } catch (error) {
        console.error("[InvoiceDownloadError]", error);
        return res.status(500).json({
            success: false,
            message: "Failed to generate invoice",
        });
    }
};

/* --------------------------------------------------
   REQUEST REFUND
-------------------------------------------------- */
import { sendEmail } from "../utils/brevoEmail.js";

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

        // Optional: Confirmation to User
        await sendEmail({
            to: user.email,
            subject: "We've received your refund request",
            html: `
                <div style="font-family: sans-serif; padding: 20px;">
                    <h2>Refund Request Received</h2>
                    <p>Hi ${user.name},</p>
                    <p>We have received your request for a refund. Our support team will review your case and get back to you within 24-48 hours.</p>
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
