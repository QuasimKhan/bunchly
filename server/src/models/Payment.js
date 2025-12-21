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

        status: {
            type: String,
            enum: ["paid", "failed", "refunded"],
            default: "paid",
        },
    },
    { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
