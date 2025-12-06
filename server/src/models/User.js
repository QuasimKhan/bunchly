import mongoose from "mongoose";
import Link from "./Link.js";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        username: {
            type: String,
            unique: true,
        },
        image: {
            type: String,
        },
        bio: {
            type: String,
        },
        role: {
            type: String,
        },
        email: {
            type: String,
            unique: true,
            required: true,
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
            default: "email",
        },
        plan: {
            type: String,
            default: "free",
        },
    },
    { timestamps: true }
);

// AUTOCACADE deletion
// When a user is deleted => delete all their links

userSchema.pre("findOneAndDelete", async function (next) {
    const user = await this.model.findOne(this.getFilter());

    if (user) {
        await Link.deleteMany({ userId: user._id });
        console.log(`🗑 Deleted all links belonging to user: ${user._id}`);
    }
    next();
});

const User = mongoose.model("User", userSchema);

export default User;
