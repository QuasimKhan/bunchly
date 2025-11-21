import { Resend } from "resend";
import { ENV } from "../config/env.js";

const resend = new Resend(ENV.RESEND_API_KEY);

export const sendVerificationEmail = async (email, url) => {
    try {
        await resend.emails.send({
            from: "LinkHub <onboarding@resend.dev>",
            to: email,
            subject: "Verify your LinkHub account",
            html: `
                     <h2>Welcome to LinkHub 🚀</h2>
                     <p>Please verify your email by clicking the button below:</p>
                     <a href="${url}" target="_blank" 
                       style="display:inline-block;background:#4f46e5;color:#fff;
                              padding:10px 20px;border-radius:6px;text-decoration:none;">
                                Verify Email
                      </a>
                      <p>Note: This link will expire in 10 minutes.</p>
`,
        });
    } catch (error) {
        console.error("Email sending failed:", error.message);
    }
};
