import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        plan: {
            type: String,
            enum: ["pro"],
            required: true,
        },

        amount: {
            type: Number, // in paise
            required: true,
        },

        currency: {
            type: String,
            default: "INR",
        },

        provider: {
            type: String,
            enum: ["razorpay"],
            required: true,
        },

        orderId: {
            type: String,
            required: true,
        },

        paymentId: {
            type: String,
            required: true,
        },

        invoiceNumber: {
            type: String,
            required: true,
        },

        couponCode: {
            type: String,
        },

        discountAmount: {
            type: Number,
            default: 0,
        },

        subscriptionId: {
            type: String, // Razorpay Sub ID
        },

        autoPay: {
            type: Boolean,
            default: false,
        },

        status: {
            type: String,
            enum: ["paid", "failed", "refunded", "refund_requested", "refund_rejected"],
            default: "paid",
        },

        refundReason: {
            type: String,
        },

        refundRequestedAt: {
            type: Date,
        },

        refundRequestStatus: {
            type: String,
            enum: ["none", "requested", "approved", "rejected"],
            default: "none",
        },
    },
    { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
