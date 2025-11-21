import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
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

const User = mongoose.model("User", userSchema);

export default User;
