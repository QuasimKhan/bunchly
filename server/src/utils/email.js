import { sendEmail } from "./brevoEmail.js";
export const sendVerificationEmail = async (email, url) => {
    const html = `
        <div style="
            font-family: 'Segoe UI', sans-serif;
            background:#f6f7ff;
            padding:40px 0;
            text-align:center;
        ">
            <div style="
                background:#ffffff;
                max-width:520px;
                margin:auto;
                padding:30px 25px;
                border-radius:14px;
                box-shadow:0 8px 25px rgba(0,0,0,0.05);
            ">
                <img
                    src="https://bunchly.netlify.app/img/Bunchly-dark.png"
                    alt="Bunchly Logo"
                    width="130"
                    style="margin-bottom:18px;"
                />

                <h2 style="margin:0;font-size:22px;color:#111;">
                    Welcome to <span style="color:#4f46e5;">Bunchly</span> 🎉
                </h2>

                <p style="font-size:15px;color:#444;margin:12px 0 22px;">
                    Thank you for signing up!<br/>
                    Click the button below to verify your email and activate your account.
                </p>

                <a href="${url}" target="_blank" style="
                    display:inline-block;
                    font-size:16px;
                    background:#4f46e5;
                    color:#fff;
                    margin-top:5px;
                    padding:12px 28px;
                    border-radius:8px;
                    font-weight:600;
                    text-decoration:none;
                ">
                    Verify Email
                </a>

                <p style="margin-top:24px;color:#666;font-size:13px;">
                    🔒 This link will expire in <b>10 minutes</b> for security reasons.
                </p>

                <hr style="border:none;border-top:1px solid #eee;margin:26px 0;">

                <p style="font-size:12px;color:#999;">
                    If you didn’t request this, you can safely ignore this email.<br/>
                    Need help? Reply to this mail anytime 💙
                </p>
            </div>
        </div>
    `;

    // ✅ ACTUAL EMAIL SEND
    await sendEmail({
        to: email,
        subject: "Verify your email",
        html,
    });
};
