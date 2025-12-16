import axios from "axios";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

export const sendEmail = async ({ to, subject, html }) => {
    try {
        await axios.post(
            BREVO_API_URL,
            {
                sender: {
                    email: process.env.BREVO_SENDER_EMAIL,
                    name: process.env.BREVO_SENDER_NAME,
                },
                to: [{ email: to }],
                subject,
                htmlContent: html,
            },
            {
                headers: {
                    "api-key": process.env.BREVO_API_KEY,
                    "Content-Type": "application/json",
                },
                timeout: 15000, // API timeout (safe)
            }
        );
    } catch (error) {
        console.error(
            "Brevo API Error:",
            error?.response?.data || error.message
        );
        throw new Error("Failed to send email");
    }
};
