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
            default:
                "https://imgs.search.brave.com/6_s2510n8Psxm_Aq6n1XeVlFNbNpZXQDqqpu9FuCsM8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTAx/Njc0NDAzNC92ZWN0/b3IvcHJvZmlsZS1w/bGFjZWhvbGRlci1p/bWFnZS1ncmF5LXNp/bGhvdWV0dGUtbm8t/cGhvdG8uanBnP3M9/NjEyeDYxMiZ3PTAm/az0yMCZjPVJxdGky/NlZRal9mcy1faEwx/NW1KajZiODRGRVpO/YTAwRkpnWlJhRzVQ/RDQ9",
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
