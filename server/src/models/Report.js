import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    reporterEmail: { type: String, required: true },
    reporterIp: { type: String, required: true },
    reportedUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reason: { 
        type: String, 
        required: true,
        enum: ["spam", "inappropriate", "harassment", "impersonation", "scam", "other"]
    },
    details: { type: String, maxlength: 1000 },
    status: {
        type: String,
        enum: ["pending", "resolved", "dismissed"],
        default: "pending"
    },
    adminNotes: { type: String },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

// Prevent spam: Limit 1 report per IP per User per 24h (handled in controller or simpler: index it)
reportSchema.index({ reporterIp: 1, reportedUser: 1, createdAt: -1 });

export const Report = mongoose.model("Report", reportSchema);
