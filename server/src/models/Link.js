import mongoose from "mongoose";

const linkSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        description: {
            type: String,
            default: "",
            trim: true,
        },
        icon: {
            type: String,
            default: "",
        },

        url: {
            type: String,
            required: true,
            trim: true,
        },
        order: {
            type: Number,
            default: 0, // we'll set dynamic order later
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        clicks: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

const Link = mongoose.model("Link", linkSchema);

export default Link;
