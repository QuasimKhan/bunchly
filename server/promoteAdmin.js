import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/User.js";

dotenv.config();

const promoteUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB.");

        const email = "bunchly.contact@gmail.com";
        const user = await User.findOneAndUpdate(
            { email },
            { role: "admin" },
            { new: true }
        );

        if (user) {
            console.log(`✅ Successfully promoted ${user.name} (${user.email}) to ADMIN.`);
        } else {
            console.log(`❌ User with email ${email} not found.`);
        }

        process.exit();
    } catch (error) {
        console.error("Error promoting user:", error);
        process.exit(1);
    }
};

promoteUser();
