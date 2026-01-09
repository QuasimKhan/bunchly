import { sendEmail } from "./brevoEmail.js";

const BASE_STYLE = `
    font-family: 'Inter', 'Segoe UI', sans-serif;
    color: #1a1a1a;
    line-height: 1.6;
    margin: 0;
    padding: 0;
    background-color: #f9fafb;
`;

const CONTAINER_STYLE = `
    max-width: 600px;
    margin: 40px auto;
    background: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    border: 1px solid #e5e7eb;
`;

const HEADER_STYLE = `
    background: #0F0F14;
    padding: 30px;
    text-align: center;
`;

const CONTENT_STYLE = `
    padding: 40px 30px;
`;

const BUTTON_STYLE = `
    display: inline-block;
    background: #4F46E5;
    color: #ffffff;
    padding: 14px 32px;
    border-radius: 12px;
    text-decoration: none;
    font-weight: 600;
    font-size: 16px;
    margin-top: 24px;
    box-shadow: 0 4px 6px rgba(79, 70, 229, 0.2);
`;

const FOOTER_STYLE = `
    background: #f9fafb;
    padding: 20px;
    text-align: center;
    color: #6b7280;
    font-size: 12px;
    border-top: 1px solid #e5e7eb;
`;

export const sendVerificationEmail = async (email, url) => {
    const html = `
        <div style="${BASE_STYLE}">
            <div style="${CONTAINER_STYLE}">
                <div style="${HEADER_STYLE}">
                    <img src="https://bunchly.netlify.app/img/Bunchly-dark.png" alt="Bunchly" width="140" style="display: block; margin: 0 auto;" />
                </div>
                <div style="${CONTENT_STYLE}">
                    <h1 style="text-align: center; font-size: 24px; font-weight: 700; color: #111; margin-bottom: 24px;">
                        Verify your email 🔐
                    </h1>
                    <p style="font-size: 16px; color: #4b5563; margin-bottom: 24px; text-align: center;">
                        You're just one step away from claiming your corner of the internet. Click below to verify your account.
                    </p>
                    <div style="text-align: center;">
                        <a href="${url}" style="${BUTTON_STYLE}">Verify Email Address</a>
                    </div>
                </div>
                <div style="${FOOTER_STYLE}">
                    <p>Link expires in 10 minutes. If you didn't sign up, ignore this email.</p>
                </div>
            </div>
        </div>
    `;

    await sendEmail({ to: email, subject: "Verify your email", html });
};

export const sendWelcomeEmail = async (email, name) => {
    const html = `
        <div style="${BASE_STYLE}">
            <div style="${CONTAINER_STYLE}">
                <div style="${HEADER_STYLE}">
                    <img src="https://bunchly.netlify.app/img/Bunchly-dark.png" alt="Bunchly" width="140" style="display: block; margin: 0 auto;" />
                </div>
                <div style="${CONTENT_STYLE}">
                    <h1 style="font-size: 24px; font-weight: 700; color: #111; margin-bottom: 16px;">
                        Welcome to the club, ${name}! 🚀
                    </h1>
                    <p style="font-size: 16px; color: #4b5563; margin-bottom: 16px;">
                        We're thrilled to have you on board. Bunchly is designed to help you showcase everything you are in one beautiful link.
                    </p>
                    
                    <h3 style="font-size: 18px; font-weight: 600; color: #111; margin-top: 32px; margin-bottom: 12px;">Getting Started Tips:</h3>
                    <ul style="padding-left: 20px; color: #4b5563; font-size: 15px; margin-bottom: 32px; list-style-type: circle;">
                        <li style="margin-bottom: 10px;">Customize your appearance to match your brand.</li>
                        <li style="margin-bottom: 10px;">Add unlimited links to your socials, music, and content.</li>
                        <li style="margin-bottom: 10px;">Check your analytics to see what's performing best.</li>
                    </ul>

                    <div style="text-align: center;">
                        <a href="https://bunchly.netlify.app/admin" style="${BUTTON_STYLE}">Go to Dashboard</a>
                    </div>
                </div>
                <div style="${FOOTER_STYLE}">
                    <p>© ${new Date().getFullYear()} Bunchly Inc. All rights reserved.</p>
                    <p>You received this email because you signed up for Bunchly.</p>
                </div>
            </div>
        </div>
    `;

    await sendEmail({ to: email, subject: "Welcome to Bunchly! 🎉", html });
};

export const sendPromotionalEmail = async (email, subject, content, attachments = []) => {
    const html = `
        <div style="${BASE_STYLE}">
            <div style="${CONTAINER_STYLE}">
                <div style="${HEADER_STYLE}">
                    <img src="https://bunchly.netlify.app/img/Bunchly-dark.png" alt="Bunchly" width="140" style="display: block; margin: 0 auto;" />
                </div>
                <div style="${CONTENT_STYLE}">
                    ${content} 
                </div>
                <div style="${FOOTER_STYLE}">
                    <p>© ${new Date().getFullYear()} Bunchly Inc. All rights reserved.</p>
                    <p>To unsubscribe from updates, manage your notification preferences in settings.</p>
                </div>
            </div>
        </div>
    `;

    await sendEmail({ to: email, subject: subject, html, attachments });
};

export const sendExpiryWarningEmail = async (email, name, daysLeft) => {
    const html = `
        <div style="${BASE_STYLE}">
            <div style="${CONTAINER_STYLE}">
                <div style="${HEADER_STYLE}">
                    <img src="https://bunchly.netlify.app/img/Bunchly-dark.png" alt="Bunchly" width="140" style="display: block; margin: 0 auto;" />
                </div>
                <div style="${CONTENT_STYLE}">
                    <h1 style="text-align: center; font-size: 24px; font-weight: 700; color: #111; margin-bottom: 24px;">
                        Action Required: Subscription Expiring ⚠️
                    </h1>
                    <p style="font-size: 16px; color: #4b5563; margin-bottom: 24px;">
                        Hi ${name},
                    </p>
                    <p style="font-size: 16px; color: #4b5563; margin-bottom: 24px;">
                        Just a heads up that your <strong>Bunchly Pro</strong> subscription will expire in <strong>${daysLeft} days</strong>.
                    </p>
                    <p style="font-size: 16px; color: #4b5563; margin-bottom: 24px;">
                        To avoid losing access to premium themes, detailed analytics, and your verified badge, please renew your plan today.
                    </p>
                    <div style="text-align: center;">
                        <a href="https://bunchly.netlify.app/dashboard/billing" style="${BUTTON_STYLE}">Renew Subscription</a>
                    </div>
                </div>
                <div style="${FOOTER_STYLE}">
                    <p>© ${new Date().getFullYear()} Bunchly Inc. All rights reserved.</p>
                    <p>If you have questions, reply to this email.</p>
                </div>
            </div>
        </div>
    `;

    await sendEmail({ to: email, subject: `Action Required: Your plan expires in ${daysLeft} days`, html });
};

export const sendPasswordChangeEmail = async (email, name) => {
    const html = `
        <div style="${BASE_STYLE}">
            <div style="${CONTAINER_STYLE}">
                <div style="${HEADER_STYLE}">
                    <img src="https://bunchly.netlify.app/img/Bunchly-dark.png" alt="Bunchly" width="140" style="display: block; margin: 0 auto;" />
                </div>
                <div style="${CONTENT_STYLE}">
                    <h1 style="text-align: center; font-size: 24px; font-weight: 700; color: #111; margin-bottom: 24px;">
                        Security Alert: Password Changed 🔐
                    </h1>
                    <p style="font-size: 16px; color: #4b5563; margin-bottom: 24px;">
                        Hi ${name},
                    </p>
                    <p style="font-size: 16px; color: #4b5563; margin-bottom: 24px;">
                        The password for your Bunchly account was just changed.
                    </p>
                    <p style="font-size: 16px; color: #4b5563; margin-bottom: 24px;">
                        If you made this change, you can safely ignore this email.
                    </p>
                    <p style="font-size: 16px; color: #DC2626; font-weight: 600; margin-bottom: 24px;">
                        If you did not make this change, please contact our support team immediately to secure your account.
                    </p>
                    <div style="text-align: center;">
                        <a href="mailto:bunchly.contact@gmail.com" style="${BUTTON_STYLE}">Contact Support</a>
                    </div>
                </div>
                <div style="${FOOTER_STYLE}">
                    <p>© ${new Date().getFullYear()} Bunchly Inc. All rights reserved.</p>
                    <p>This is a security notification sent to ${email}.</p>
                </div>
            </div>
        </div>
    `;

    await sendEmail({ to: email, subject: "Security Alert: Your password was changed", html });
};

export const sendForgotPasswordEmail = async (email, otp, name) => {
    const html = `
        <div style="${BASE_STYLE}">
            <div style="${CONTAINER_STYLE}">
                <div style="${HEADER_STYLE}">
                    <img src="https://bunchly.netlify.app/img/Bunchly-dark.png" alt="Bunchly" width="140" style="display: block; margin: 0 auto;" />
                </div>
                <div style="${CONTENT_STYLE}">
                    <h1 style="text-align: center; font-size: 24px; font-weight: 700; color: #111; margin-bottom: 24px;">
                        Reset your Password 🔐
                    </h1>
                    <p style="font-size: 16px; color: #4b5563; margin-bottom: 24px;">
                        Hi ${name || 'there'},
                    </p>
                    <p style="font-size: 16px; color: #4b5563; margin-bottom: 24px;">
                        We received a request to reset your Bunchly password. Enter the code below to proceed:
                    </p>
                    
                    <div style="background: #f3f4f6; border-radius: 12px; padding: 24px; text-align: center; margin: 32px 0;">
                        <span style="font-family: monospace; font-size: 32px; letter-spacing: 8px; font-weight: 700; color: #111;">
                            ${otp}
                        </span>
                    </div>

                    <p style="font-size: 14px; color: #6b7280; margin-bottom: 24px; text-align: center;">
                        This code will expire in 10 minutes.
                    </p>
                    
                    <p style="font-size: 14px; color: #9ca3af; text-align: center; margin-top: 32px;">
                        If you didn't request this, you can safely ignore this email.
                    </p>
                </div>
                <div style="${FOOTER_STYLE}">
                    <p>© ${new Date().getFullYear()} Bunchly Inc. All rights reserved.</p>
                </div>
            </div>
        </div>
    `;

    await sendEmail({ to: email, subject: "Reset your Password", html });
};
