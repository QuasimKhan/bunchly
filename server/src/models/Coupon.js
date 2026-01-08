import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },
        description: {
            type: String,
        },
        discountType: {
            type: String,
            enum: ["percent", "fixed"],
            required: true,
        },
        discountValue: {
            type: Number,
            required: true,
        },
        // For Razorpay Subscriptions, we need an Offer ID if we want native support
        razorpayOfferId: {
            type: String,
            trim: true,
        },
        maxUses: {
            type: Number,
            default: null, // null = unlimited
        },
        usedCount: {
            type: Number,
            default: 0,
        },
        expiresAt: {
            type: Date,
            default: null,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isPublic: {
            type: Boolean,
            default: false
        },
        // Metadata for admin control
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

// Method to check validity
couponSchema.methods.isValid = function () {
    if (!this.isActive) return false;
    if (this.expiresAt && new Date() > this.expiresAt) return false;
    if (this.maxUses && this.usedCount >= this.maxUses) return false;
    return true;
};

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
