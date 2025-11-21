import { ENV } from "../config/env.js";
import User from "../models/User.js";
import VerificationToken from "../models/VerificationToken.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/email.js";

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Fields are required",
            });
        }

        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(409).json({
                success: false,
                message: "User Already Exist, please Login",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
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

export const verifyEmail = async (req, res) => {
    try {
        const { token, uid } = req.query;
        if (!token || !uid) {
            return res.status(400).json({
                success: false,
                message: "Verification failed",
            });
        }

        const record = await VerificationToken.findOne({
            userId: uid,
            used: false,
        });

        if (!record) {
            return res.status(400).json({
                success: false,
                message: "Verification Failed",
            });
        }

        if (record.expiresAt < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "Verification Failed",
            });
        }

        const isValid = await bcrypt.compare(token, record.token);
        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: "Verification Failed",
            });
        }

        if (record.used) {
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

        user.isVerified = true;
        await user.save();

        record.used = true;
        await record.save();

        res.status(200).json({
            success: true,
            message: "Email Verified successfully",
        });
    } catch (error) {
        res.status(400).json({
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
            await VerificationToken.create({
                userId: user._id,
                token: hashedToken,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutess
            });

            const verifyUrl = `${ENV.CLIENT_URL}/verify?token=${rawToken}&uid=${user._id}`;

            await sendVerificationEmail(user.email, verifyUrl);

            return res.status(403).json({
                success: false,
                message:
                    "Your email is not verified, we have sent the verification link on your mail, please verify first.",
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

        //case3: new user
        const newUser = await User.create({
            name: googleUser.name,
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
        const user = await User.findById(req.session.userId);
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
            },
        });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};
