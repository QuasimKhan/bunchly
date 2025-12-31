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
