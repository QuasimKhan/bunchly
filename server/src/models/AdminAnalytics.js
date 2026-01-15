import mongoose from "mongoose";

const adminAnalyticsSchema = new mongoose.Schema(
    {
        // 🔹 REQUEST DETAILS
        path: {
            type: String,
            required: true,
            index: true,
        },
        method: {
            type: String, // GET, POST, etc.
            required: true,
        },
        statusCode: {
            type: Number,
        },
        duration: {
            type: Number, // in ms
        },

        // 🔹 VISITOR IDENTITY
        ip: {
            type: String,
            index: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            index: true,
            default: null,
        },
        isGuest: {
            type: Boolean,
            default: true,
        },
        visitorId: {
            type: String, // Persistent cookie/localstorage ID if available
            index: true,
        },

        // 🔹 LOCATION (from IP)
        location: {
            country: String,
            region: String,
            city: String,
            timezone: String,
            coordinates: [Number], // [lat, long]
        },

        // 🔹 DEVICE & BROWSER
        userAgent: String,
        device: {
            type: { type: String }, // mobile, tablet, console, smarttv, wearable, embedded
            vendor: String,
            model: String,
        },
        os: {
            name: String,
            version: String,
        },
        browser: {
            name: String,
            version: String,
        },
        engine: {
            name: String,
            version: String,
        },
        cpu: {
            architecture: String,
        },

        // 🔹 TRAFFIC SOURCE
        referrer: {
            type: String,
        },
    },
    { timestamps: true } // adds createdAt, updatedAt
);

// Indexes for fast aggregation
adminAnalyticsSchema.index({ createdAt: -1 });
adminAnalyticsSchema.index({ "location.country": 1 });
adminAnalyticsSchema.index({ "device.type": 1 });

const AdminAnalytics = mongoose.model("AdminAnalytics", adminAnalyticsSchema);

export default AdminAnalytics;
