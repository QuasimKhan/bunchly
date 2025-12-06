import User from "../models/User.js";
import Link from "../models/Link.js";

export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const deletedUser = await User.findOneAndDelete({ _id: userId });
        if (!deletedUser) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "User and their related links deleted",
            deleteUser,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const getPublicProfile = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(403).json({
                success: false,
                message: "User not found",
            });
        }

        const links = await Link.find({
            userId: user._id,
            isActive: true,
        }).sort({ order: 1 });

        const publicUser = {
            name: user.name,
            username: user.username,
            image: user.image,
            bio: user.bio,
            role: user.role,
        };

        res.status(200).json({
            success: true,
            message: "User Fetched Successfully",
            user: publicUser,
            links,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
