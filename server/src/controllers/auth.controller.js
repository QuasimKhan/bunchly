import { ENV } from "../config/env.js";
import User from "../models/User.js";
import VerificationToken from "../models/VerificationToken.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/email.js";

export const signup = async (req, res) => {
    try {
        const { name, email, password, username } = req.body;
        if (!name || !email || !password || !username) {
            return res.status(400).json({
                success: false,
                message: "Fields are required",
            });
        }

        const cleanUsername = username.trim().toLowerCase();

        const usernameRegex = /^[a-zA-Z0-9._-]{3,20}$/;
        if (!usernameRegex.test(cleanUsername)) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid username. Use 3–20 characters: letters, numbers, ., -, _",
            });
        }

        // Reserved usernames (No-one use this username)
        const reserved = ["admin", "support", "help", "dashboard", "profile"];
        if (reserved.includes(cleanUsername)) {
            return res.status(400).json({
                success: false,
                message: "This username is reserved. Please choose another.",
            });
        }

        const usernameTaken = await User.findOne({ username: cleanUsername });

        if (usernameTaken) {
            return res.status(409).json({
                success: false,
                message: "Username already taken",
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser && !existingUser.isVerified) {
            return res.status(409).json({
                success: false,
                unverified: true,
                message:
                    "Email exists but not verified. Please resend verification.",
            });
        }

        if (existingUser && existingUser.isVerified) {
            return res.status(409).json({
                success: false,
                message: "User Already Exist, please Login",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name,
            email,
            username: cleanUsername,
            password: hashedPassword,
            plan: "free",
        });

        const rawToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = await bcrypt.hash(rawToken, 12);
        await VerificationToken.create({
            userId: user._id,
            token: hashedToken,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutess
        });

        const verifyUrl = `${ENV.CLIENT_URL}/verify?token=${rawToken}&uid=${user._id}`;

        await sendVerificationEmail(user.email, verifyUrl);

        res.status(201).json({
            success: true,
            message: "User Created ! Please verify your email",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const checkUsernameAvailability = async (req, res) => {
    try {
        const { username } = req.query;

        if (!username) {
            return res.status(400).json({
                success: false,
                message: "Username is required",
            });
        }

        // Normalize username
        const cleanUsername = username.trim().toLowerCase();

        // Username format check
        const usernameRegex = /^[a-zA-Z0-9._-]{3,20}$/;
        if (!usernameRegex.test(cleanUsername)) {
            return res.status(400).json({
                success: false,
                available: false,
                message:
                    "Invalid username format. Use 3–20 characters (letters, numbers, ., -, _)",
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
                available: false,
                message: "This username is reserved",
            });
        }

        const usernameExits = await User.findOne({ username: cleanUsername });
        if (usernameExits) {
            return res.status(200).json({
                success: true,
                available: false,
                message: "Username already taken",
            });
        }
        return res.status(200).json({
            success: true,
            available: true,
            message: "Username is available",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            available: false,
            message: error.message,
        });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { token, uid } = req.query;

        if (!token || !uid) {
            return res.status(400).json({
                success: false,
                message: "Verification Failed",
            });
        }

        // Get the latest (most recent) token
        const record = await VerificationToken.findOne({
            userId: uid,
            used: false,
        }).sort({ createdAt: -1 });

        if (!record) {
            return res.status(400).json({
                success: false,
                message: "Verification Failed",
            });
        }

        if (new Date(record.expiresAt).getTime() < Date.now()) {
            await VerificationToken.deleteMany({ userId: uid });
            return res.status(400).json({
                success: false,
                message: "Verification link expired",
                expired: true,
            });
        }

        // Verify token hash
        const isValid = await bcrypt.compare(token, record.token);
        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: "Verification Failed",
            });
        }

        const user = await User.findById(uid);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Verification Failed",
            });
        }

        // Mark user as verified
        user.isVerified = true;
        await user.save();

        // Mark token as used
        record.used = true;
        await record.save();

        return res.status(200).json({
            success: true,
            message: "Email Verified successfully",
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const resendVerification = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Email is already verified",
            });
        }

        // Delete old tokens
        await VerificationToken.deleteMany({ userId: user._id });

        // Create new token
        const rawToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = await bcrypt.hash(rawToken, 12);

        await VerificationToken.create({
            userId: user._id,
            token: hashedToken,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        });

        const verifyUrl = `${ENV.CLIENT_URL}/verify?token=${rawToken}&uid=${user._id}`;

        await sendVerificationEmail(user.email, verifyUrl);
        return res.status(200).json({
            success: true,
            message: "New verification link sent to your email",
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Fields are required",
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
        }
        if (user.authProvider !== "email") {
            return res.status(400).json({
                success: false,
                message:
                    "This account uses Google Sign-In. Please continue with Google.",
            });
        }
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        if (!user.isVerified) {
            const rawToken = crypto.randomBytes(32).toString("hex");
            const hashedToken = await bcrypt.hash(rawToken, 12);
            await VerificationToken.deleteMany({ userId: user._id });

            await VerificationToken.create({
                userId: user._id,
                token: hashedToken,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000),
            });

            const verifyUrl = `${ENV.CLIENT_URL}/verify?token=${rawToken}&uid=${user._id}`;

            await sendVerificationEmail(user.email, verifyUrl);

            return res.status(403).json({
                success: false,
                message: "Email not verified",
                unverified: true,
            });
        }
        req.session.userId = user._id;
        res.status(200).json({
            success: true,
            message: "Login successfully",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                plan: user.plan,
                role: user.role,
                image: user.image,
            },
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const googleAuthRedirect = async (req, res) => {
    try {
        const state = crypto.randomBytes(16).toString("hex");
        req.session.oauthState = state;

        const redirectUrl =
            "https://accounts.google.com/o/oauth2/v2/auth" +
            `?client_id=${ENV.GOOGLE_CLIENT_ID}` +
            `&redirect_uri=${encodeURIComponent(ENV.GOOGLE_REDIRECT_URI)}` +
            "&response_type=code" +
            "&scope=openid%20email%20profile" +
            `&state=${state}`;

        return res.redirect(redirectUrl);
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const googleAuthCallback = async (req, res) => {
    try {
        const { code, state } = req.query;
        if (!state || state !== req.session.oauthState) {
            return res.status(400).json({
                success: false,
                message: "Invalid OAuth State",
            });
        }

        const tokenResponse = await fetch(
            "https://oauth2.googleapis.com/token",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    client_id: ENV.GOOGLE_CLIENT_ID,
                    client_secret: ENV.GOOGLE_CLIENT_SECRET,
                    code,
                    redirect_uri: ENV.GOOGLE_REDIRECT_URI,
                    grant_type: "authorization_code",
                }),
            }
        );

        const tokenData = await tokenResponse.json();
        if (tokenData.error) {
            return res.status(400).json({
                success: false,
                message: "Failed to obtain tokens",
            });
        }
        const userInfoResponse = await fetch(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${tokenData.access_token}`,
                },
            }
        );
        const googleUser = await userInfoResponse.json();
        if (!googleUser.email) {
            return res.status(400).json({
                success: false,
                message: "Google Account has no email",
            });
        }

        const existingUser = await User.findOne({ email: googleUser.email });

        //case1: already google user
        if (existingUser && existingUser.authProvider === "google") {
            req.session.userId = existingUser._id;
            return res.redirect(`${ENV.CLIENT_URL}/oauth/callback`);
        }

        //case2: if email/pass user exits -> block
        if (existingUser && existingUser.authProvider === "email") {
            return res.redirect(
                `${ENV.CLIENT_URL}/oauth/callback?error=provider_mismatch`
            );
        }

        const baseUsername = googleUser.email.split("@")[0].toLowerCase();

        let finalUsername = baseUsername;
        let count = 1;

        while (await User.findOne({ username: finalUsername })) {
            finalUsername = `${baseUsername}${count}`;
            count++;
        }

        //case3: new user
        const newUser = await User.create({
            name: googleUser.name,
            username: finalUsername,
            image: googleUser.picture,
            email: googleUser.email,
            authProvider: "google",
            isVerified: true,
            password: undefined,
        });

        req.session.userId = newUser._id;
        return res.redirect(`${ENV.CLIENT_URL}/oauth/callback`);
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const getMe = async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Not Authenticated",
            });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "User Fetched successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                plan: user.plan,
                authProvider: user.authProvider,
                role: user.role,
                image: user.image,
                username: user.username,
            },
        });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};

export const logout = async (req, res) => {
    try {
        req.session.destroy(() => {
            res.clearCookie("connect.sid");
            return res.status(200).json({
                success: true,
                message: "Logout Successfully",
            });
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
