import User from "../models/User.js";
import Link from "../models/Link.js";
import VerificationToken from "../models/VerificationToken.js";
import crypto from "crypto";
import { ENV } from "../config/env.js";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "../utils/email.js";
import ProfileView from "../models/ProfileView.js";
import { getAnalyticsContext } from "../utils/analyticsContext.js";

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
    let user;

    try {
        const { username } = req.params;

        if (!username || typeof username !== "string") {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Fetch public user
        user = await User.findOne({ username }).lean();

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Banned Check (Treat as 404 or Suspended)
        if (user.flags && user.flags.isBanned) {
            return res.status(404).json({
                success: false,
                message: "This account has been suspended due to policy violations.",
                isBanned: true
            });
        }
    } catch (err) {
        console.error("Public profile lookup failed:", err);
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }

    /* -------------------------------------------------
       Respond FIRST (UX priority)
       Analytics must never delay page load
    -------------------------------------------------- */
    const publicUser = {
        id: user._id,
        name: user.name,
        username: user.username,
        plan: user.plan,
        role: user.role,
        authProvider: user.authProvider,
        image: user.image,
        bio: user.bio,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        profileViews: (user.profileViews || 0) + 1, // optimistic UI
        appearance: user.appearance,
    };

    let links = [];
    try {
        links = await Link.find({
            userId: user._id,
            isActive: true,
        })
            .sort({ order: 1 })
            .lean();
    } catch (err) {
        console.error("Public links fetch failed:", err);
    }

    // Send response immediately
    res.status(200).json({
        success: true,
        message: "User fetched successfully",
        user: publicUser,
        links,
    });

    /* -------------------------------------------------
       Analytics (fire-and-forget, NON-blocking)
    -------------------------------------------------- */
    try {
        const context = getAnalyticsContext(req);

        // Event-based profile view
        await ProfileView.create({
            userId: user._id,
            ...context,
        });

        // Lifetime counter (fast UI + legacy)
        await User.updateOne({ _id: user._id }, { $inc: { profileViews: 1 } });
    } catch (err) {
        // Analytics must NEVER break profile viewing
        console.error("ProfileView tracking failed:", err);
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

        // update appearance
        if (updates.appearance !== undefined) {
            // merge existing appearance with updates to avoid overwriting missing keys
            user.appearance = {
                ...user.appearance,
                ...updates.appearance,
            };
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

export const changePassword = async (req, res) => {
    try {
        const userId = req.user._id;
        const { oldPassword, newPassword } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters long",
            });
        }

        const user = await User.findById(userId).select("+password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect",
            });
        }

        const isSamePassword = await bcrypt.compare(newPassword, user.password);

        if (isSamePassword) {
            return res.status(400).json({
                success: false,
                message: "New password must be different from old password",
            });
        }

        // 🔐 Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedPassword;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password updated successfully",
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

export const uploadBackgroundController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image uploaded",
            });
        }

        const userId = req.user._id;
        const imageUrl = req.file.path;

        // Update appearance.bgImage and ensure bgType is set to 'image'
        await User.findByIdAndUpdate(userId, { 
            "appearance.bgImage": imageUrl,
            "appearance.bgType": "image"
        });

        return res.status(200).json({
            success: true,
            message: "Background updated successfully",
            bgImage: imageUrl,
        });
    } catch (error) {
        console.error("Background upload error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getShowcaseProfiles = async (req, res) => {
    try {
        // Fetch top 5 verified users with images
        const users = await User.find({
            isVerified: true,
            image: { $exists: true, $ne: "" },
        })
        .sort({ profileViews: -1 })
        .limit(5)
        .select("username image name");

        return res.status(200).json({
            success: true,
            users,
        });
    } catch (error) {
        console.error("Showcase fetch error:", error);
        // Fail gracefully
        return res.status(200).json({ success: true, users: [] });
    }
};
