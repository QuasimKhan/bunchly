import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            enum: ["bug", "feature", "general"],
            default: "general",
            required: true,
        },
        message: {
            type: String,
            required: true,
            trim: true,
            maxLength: 2000,
        },
        status: {
            type: String,
            enum: ["new", "read", "in-progress", "resolved"],
            default: "new",
        },
    },
    {
        timestamps: true,
    }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
