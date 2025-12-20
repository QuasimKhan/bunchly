export const proReceiptEmail = ({
    name,
    email,
    paymentId,
    orderId,
    amount,
    date,
}) => {
    return {
        subject: "Your Bunchly Pro Receipt & Invoice",
        html: `
        <div style="
            background-color:#f5f7fb;
            padding:40px 0;
            font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        ">
            <div style="
                max-width:600px;
                margin:0 auto;
                background:#ffffff;
                border-radius:14px;
                box-shadow:0 20px 40px rgba(0,0,0,0.08);
                overflow:hidden;
            ">
                <!-- Header -->
                <div style="
                    padding:28px 32px;
                    border-bottom:1px solid #eef0f4;
                ">
                    <h1 style="
                        margin:0;
                        font-size:22px;
                        font-weight:600;
                        color:#0f172a;
                    ">
                        Bunchly Pro
                    </h1>
                    <p style="
                        margin:6px 0 0;
                        font-size:14px;
                        color:#64748b;
                    ">
                        Payment Receipt
                    </p>
                </div>

                <!-- Body -->
                <div style="padding:32px">
                    <p style="
                        margin:0 0 16px;
                        font-size:15px;
                        color:#334155;
                    ">
                        Hi ${name || "there"},
                    </p>

                    <p style="
                        margin:0 0 20px;
                        font-size:15px;
                        color:#334155;
                        line-height:1.6;
                    ">
                        Thank you for upgrading to <strong>Bunchly Pro</strong>.
                        Your payment was completed successfully, and your account
                        now has access to all premium features.
                    </p>

                    <p style="
                        margin:0 0 24px;
                        font-size:14px;
                        color:#475569;
                    ">
                        A detailed <strong>invoice PDF is attached</strong> to this email
                        for your records.
                    </p>

                    <!-- Receipt Box -->
                    <div style="
                        background:#f8fafc;
                        border:1px solid #e5e7eb;
                        border-radius:10px;
                        padding:20px;
                        margin-bottom:24px;
                    ">
                        <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
                            <tr>
                                <td style="padding:8px 0;color:#64748b;">Plan</td>
                                <td style="padding:8px 0;text-align:right;color:#0f172a;font-weight:500;">
                                    Pro (Monthly)
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:8px 0;color:#64748b;">Amount Paid</td>
                                <td style="padding:8px 0;text-align:right;color:#0f172a;font-weight:500;">
                                    ₹${amount / 100}
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:8px 0;color:#64748b;">Payment ID</td>
                                <td style="padding:8px 0;text-align:right;color:#0f172a;">
                                    ${paymentId}
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:8px 0;color:#64748b;">Order ID</td>
                                <td style="padding:8px 0;text-align:right;color:#0f172a;">
                                    ${orderId}
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:8px 0;color:#64748b;">Date</td>
                                <td style="padding:8px 0;text-align:right;color:#0f172a;">
                                    ${date}
                                </td>
                            </tr>
                        </table>
                    </div>

                    <p style="
                        margin:0 0 10px;
                        font-size:14px;
                        color:#475569;
                    ">
                        If you have any questions about your subscription or invoice,
                        simply reply to this email and our team will assist you.
                    </p>

                    <p style="
                        margin:24px 0 0;
                        font-size:14px;
                        color:#475569;
                    ">
                        — Team Bunchly
                    </p>
                </div>

                <!-- Footer -->
                <div style="
                    padding:20px 32px;
                    background:#f8fafc;
                    border-top:1px solid #eef0f4;
                    font-size:12px;
                    color:#94a3b8;
                    text-align:center;
                ">
                    This email was sent to ${email}.<br />
                    © ${new Date().getFullYear()} Bunchly. All rights reserved.
                </div>
            </div>
        </div>
        `,
    };
};
