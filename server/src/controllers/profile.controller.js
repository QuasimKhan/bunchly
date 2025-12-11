import User from "../models/User.js";
import Link from "../models/Link.js";
import VerificationToken from "../models/VerificationToken.js";
import crypto from "crypto";
import { ENV } from "../config/env.js";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "../utils/email.js";

export const deleteUser = async (req, res) => {
    try {
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        // Delete user
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Destroy session FIRST, then send response
        req.session.destroy((err) => {
            if (err) {
                console.error("Session destroy error:", err);
                return res.status(500).json({
                    success: false,
                    message: "Failed to clear session",
                });
            }

            // Clear cookie safely
            res.clearCookie("connect.sid", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
            });

            // Send final response ONCE
            return res.status(200).json({
                success: true,
                message: "Account deleted successfully",
            });
        });
    } catch (error) {
        return res.status(500).json({
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
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const links = await Link.find({
            userId: user._id,
            isActive: true,
        }).sort({ order: 1 });

        const publicUser = {
            id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            plan: user.plan,
            role: user.role,
            authProvider: user.authProvider,
            image: user.image,
            bio: user.bio, // <- 🚀 ADD THIS
            isVerified: user.isVerified,
            createdAt: user.createdAt,
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

export const updateProfile = async (req, res) => {
    try {
        const userId = req.session.userId;
        const updates = req.body;

        if (!userId)
            return res
                .status(401)
                .json({ success: false, message: "Unauthorized" });

        let user = await User.findById(userId);
        if (!userId)
            return res
                .status(401)
                .json({ success: false, message: "Unauthorized" });

        //Update name
        if (updates.name !== undefined) {
            if (!updates.name.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Name Cannot be empty",
                });
            }
            user.name = updates.name.trim();
        }

        //update username
        if (updates.username !== undefined) {
            const cleanUsername = updates.username.toLowerCase().trim();
            const usernameRegex = /^[a-zA-Z0-9._-]{3,20}$/;

            if (!usernameRegex.test(cleanUsername)) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid username. Use 3–20 characters (letters, numbers, ., -, _)",
                });
            }

            // Reserved usernames
            const reserved = [
                "admin",
                "root",
                "support",
                "dashboard",
                "profile",
                "settings",
                "help",
                "api",
                "login",
                "signup",
            ];

            if (reserved.includes(cleanUsername)) {
                return res.status(400).json({
                    success: false,
                    message: "This username is reserved",
                });
            }

            const exists = await User.findOne({ username: cleanUsername });
            if (exists && exists._id.toString() !== user._id.toString()) {
                return res.status(400).json({
                    success: false,
                    message: "Username already taken",
                });
            }

            user.username = cleanUsername;
        }
        //update email (verification required)

        if (updates.email !== undefined) {
            if (updates.email === user.email) {
                return res.status(200).json({
                    success: true,
                    message: "No email change detected",
                });
            }
            const emailTaken = await User.findOne({ email: updates.email });
            if (emailTaken) {
                return res.status(400).json({
                    success: false,
                    message: "Email is already in use",
                });
            }

            // Mark user unverified
            user.email = updates.email;
            user.isVerified = false;

            // Remove old tokens
            await VerificationToken.deleteMany({ userId: user._id });

            // Create new verification token
            const rawToken = crypto.randomBytes(32).toString("hex");
            const hashedToken = await bcrypt.hash(rawToken, 12);

            await VerificationToken.create({
                userId: user._id,
                token: hashedToken,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000),
            });

            const verifyUrl = `${ENV.CLIENT_URL}/verify?token=${rawToken}&uid=${user._id}`;
            await sendVerificationEmail(user.email, verifyUrl);
        }

        //update bio
        if (updates.bio !== undefined) {
            user.bio = updates.bio.slice(0, 200);
        }

        //update profile image
        if (updates.image !== undefined) {
            user.image = updates.image;
        }

        if (updates.plan !== undefined) {
            user.plan = updates.plan;
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export const uploadProfileController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image uploaded",
            });
        }

        const userId = req.user._id;
        const imageUrl = req.file.path;

        await User.findByIdAndUpdate(userId, { image: imageUrl });

        return res.status(200).json({
            success: true,
            message: "Profile Image uploaded successfully",
            image: imageUrl,
        });
    } catch (error) {
        console.error("Upload error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

