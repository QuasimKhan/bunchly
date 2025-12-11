import mongoose from "mongoose";
import Link from "./Link.js";

const userSchema = new mongoose.Schema(
    {
        // 🔹 BASIC INFO (unchanged core behavior)
        name: {
            type: String,
            trim: true,
            required: true,
        },
        username: {
            type: String,
            unique: true,
            trim: true,
            lowercase: true,
        },
        image: {
            type: String,
            default:
                "https://imgs.search.brave.com/6_s2510n8Psxm_Aq6n1XeVlFNbNpZXQDqqpu9FuCsM8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTAx/Njc0NDAzNC92ZWN0/b3IvcHJvZmlsZS1w/bGFjZWhvbGRlci1p/bWFnZS1ncmF5LXNp/bGhvdWV0dGUtbm8t/cGhvdG8uanBnP3M9/NjEyeDYxMiZ3PTAm/az0yMCZjPVJxdGky/NlZRal9mcy1faEwx/NW1KajZiODRGRVpO/YTAwRkpnWlJhRzVQ/RDQ9",
        },
        bio: {
            type: String,
            trim: true,
        },
        role: {
            type: String,
            default: "user", // previously just String, still valid
        },

        // 🔹 AUTH
        email: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            // ⚠️ not using select:false to avoid breaking your existing login logic
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        authProvider: {
            type: String,
            default: "email", // "email" | "google" etc.
        },

        // 🔹 PLAN / SAAS
        // You already use: "free" and "paid" → keep fully compatible
        plan: {
            type: String,
            enum: ["free", "paid", "pro", "enterprise"],
            default: "free",
        },

        // 🔹 BILLING / SUBSCRIPTION (SaaS stuff – all optional)
        billing: {
            customerId: { type: String, default: null }, // e.g. Stripe/Razorpay customer id
            subscriptionId: { type: String, default: null },
            status: {
                type: String,
                enum: [
                    "inactive",
                    "trialing",
                    "active",
                    "past_due",
                    "canceled",
                ],
                default: "inactive",
            },
            renewalDate: { type: Date, default: null },
            cancelAtPeriodEnd: { type: Boolean, default: false },
        },

        // 🔹 USAGE & ANALYTICS
        usage: {
            totalLinks: { type: Number, default: 0 },
            totalClicks: { type: Number, default: 0 },
            lastActiveAt: { type: Date, default: null },
        },

        // 🔹 PREFERENCES (for themes, language, etc.)
        preferences: {
            theme: {
                type: String,
                enum: ["system", "light", "dark"],
                default: "system",
            },
            language: {
                type: String,
                default: "en",
            },
            timezone: {
                type: String,
                default: "Asia/Kolkata",
            },
            // public profile options
            publicProfile: {
                isPublic: { type: Boolean, default: true },
                showEmail: { type: Boolean, default: false },
            },
        },

        // 🔹 FLAGS / STATUS
        flags: {
            isBanned: { type: Boolean, default: false },
            isStaff: { type: Boolean, default: false },
            onboardingCompleted: { type: Boolean, default: false },
        },
    },
    { timestamps: true }
);

// ---------------------------------------------------
// AUTO-CASCADE DELETION (your existing logic, kept)
// ---------------------------------------------------
userSchema.pre("findOneAndDelete", async function (next) {
    const user = await this.model.findOne(this.getFilter());

    if (user) {
        await Link.deleteMany({ userId: user._id });
        console.log(`🗑 Deleted all links belonging to user: ${user._id}`);
    }
    next();
});

// Helpful indexes for SaaS-scale usage
userSchema.index({ "billing.customerId": 1 });
userSchema.index({ "billing.subscriptionId": 1 });

const User = mongoose.model("User", userSchema);

export default User;
