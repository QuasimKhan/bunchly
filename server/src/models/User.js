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
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        authProvider: {
            type: String,
            default: "email", // "email" | "google" etc.
        },
        resetPasswordOtp: {
            type: String,
            select: false,
        },
        resetPasswordExpires: {
            type: Date,
            select: false,
        },
        resetPasswordToken: {
            type: String,
            select: false,
        },

        // 🔹 PLAN / SAAS
        plan: {
            type: String,
            enum: ["free", "pro"],
            default: "free",
        },
        planExpiresAt: {
            type: Date,
            default: null,
        },

        subscription: {
            provider: {
                type: String,
                enum: ["razorpay", "manual"],
                default: null,
            },
            orderId: { type: String, default: null },
            paymentId: { type: String, default: null },
            status: {
                type: String,
                enum: ["active", "expired", "pending"],
                default: null,
            },
        },

        // 🔹 USAGE & ANALYTICS
        usage: {
            totalLinks: { type: Number, default: 0 },
            totalClicks: { type: Number, default: 0 },
            lastActiveAt: { type: Date, default: null },
        },

        profileViews: {
            type: Number,
            default: 0,
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

        // 🔹 APPEARANCE (New SaaS Feature)
        appearance: {
            theme: { type: String, default: 'custom' }, // 'custom', 'air-snow', 'mineral-blue', 'noir', etc.
            bgType: {
                type: String,
                enum: ["color", "gradient", "image"],
                default: "color",
            },
            bgColor: { type: String, default: "#ffffff" },
            bgGradient: { type: String, default: "from-indigo-500 to-purple-600" },
            bgImage: { type: String, default: "" },
            bgBlur: { type: Number, default: 0 },
            bgOverlay: { type: Number, default: 0 },
            buttonStyle: {
                type: String,
                enum: ["fill", "outline", "soft", "shadow", "hard-shadow"],
                default: "fill",
            },
            buttonRoundness: { type: String, default: "xl" },
            buttonColor: { type: String, default: "#171717" },
            buttonFontColor: { type: String, default: "#ffffff" },
            fontFamily: { type: String, default: "Inter" },
            fontColor: { type: String, default: "#171717" },
            layout: { type: String, default: "classic" },
            hideBranding: { type: Boolean, default: false },
        },

        // 🔹 FLAGS / STATUS
        flags: {
            isBanned: { type: Boolean, default: false },
            isStaff: { type: Boolean, default: false },
            onboardingCompleted: { type: Boolean, default: false },
            strikes: { type: Number, default: 0 },
        },

        // 🔹 SECURITY & LOGS
        loginHistory: [{
            sessionId: String, // Store express-session ID
            ip: String,
            device: String, // e.g., "iPhone", "Mac", "Windows"
            os: String,
            browser: String,
            location: {
                city: String,
                country: String,
                timezone: String
            },
            timestamp: { type: Date, default: Date.now }
        }],
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
// Helpful indexes for SaaS-scale usage
userSchema.index({ username: "text", email: "text" });
userSchema.index({ "subscription.orderId": 1 });
userSchema.index({ "subscription.paymentId": 1 });

const User = mongoose.model("User", userSchema);

export default User;
