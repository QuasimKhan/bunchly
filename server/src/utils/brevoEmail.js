import axios from "axios";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

export const sendEmail = async ({ to, subject, html, attachments = [] }) => {
    try {
        const formattedAttachments = attachments.map((file) => ({
            name: file.filename,
            content: file.content.toString("base64"),
        }));

        const senderEmail = process.env.BREVO_SENDER_EMAIL?.trim();
        const senderName = process.env.BREVO_SENDER_NAME?.trim() || "Bunchly";

        if (!senderEmail) {
            throw new Error("BREVO_SENDER_EMAIL is missing");
        }

        await axios.post(
            BREVO_API_URL,
            {
                sender: {
                    email: senderEmail,
                    name: senderName,
                },
                replyTo: {
                    // MUST be a real inbox
                    email: "bunchly.contact@gmail.com",
                    name: "Bunchly Support",
                },
                to: [{ email: to }],
                subject,
                htmlContent: html,
                attachment: formattedAttachments.length
                    ? formattedAttachments
                    : undefined,
            },
            {
                headers: {
                    "api-key": process.env.BREVO_API_KEY?.trim(),
                    "Content-Type": "application/json",
                },
                timeout: 30000,
            }
        );
    } catch (error) {
        console.error("Brevo API FULL ERROR:", {
            status: error?.response?.status,
            data: error?.response?.data,
        });

        // rethrow original error so caller can decide
        throw error;
    }
};
