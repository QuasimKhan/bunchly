import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/User.js";

dotenv.config();

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected.");

        const users = await User.find({}, "email role name");
        console.log("Users found:", users);

        const target = await User.findOne({ email: "bunchly.contact@gmail.com" });
        if(target) {
            console.log("Target found:", target);
        } else {
            console.log("Target NOT found.");
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkUsers();
