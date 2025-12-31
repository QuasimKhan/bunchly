import mongoose from "mongoose";

const profileViewSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            index: true,
        },

        country: String,
        city: String,

        device: {
            type: String, // mobile | desktop | tablet
        },
        os: String,
        browser: String,
    },
    { timestamps: true }
);

export default mongoose.model("ProfileView", profileViewSchema);
