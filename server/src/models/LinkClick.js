import mongoose from "mongoose";

const linkClickSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            index: true,
        },
        linkId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Link",
            index: true,
        },

        country: String,
        city: String,

        device: String,
        os: String,
        browser: String,
        referrer: String, // Source of the click (e.g. instagram, twitter)
    },
    { timestamps: true }
);

export default mongoose.model("LinkClick", linkClickSchema);
