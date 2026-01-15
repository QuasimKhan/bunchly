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
        sessionId: {
            type: String, // Session ID from client
            index: true,
        },

        // 🔹 CLIENT SIDE METRICS
        eventType: {
            type: String,
            default: "pageview", // pageview, event, heartbeat
            index: true,
        },
        screenResolution: String, // e.g., 1920x1080
        viewport: String, // e.g., 1920x960
        language: String, // e.g., en-US
        interactionTime: Number, // Time spent on page in ms

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
    { timestamps: true }
);

// Indexes for fast aggregation
adminAnalyticsSchema.index({ createdAt: -1 });
adminAnalyticsSchema.index({ "location.country": 1 });
adminAnalyticsSchema.index({ "device.type": 1 });

const AdminAnalytics = mongoose.model("AdminAnalytics", adminAnalyticsSchema);

export default AdminAnalytics;
