export const revenueReportEmail = ({
    stats,
    range,
    date,
    adminName = "Admin"
}) => {
    // Format currency
    const formatCurrency = (amount) => `₹${amount.toLocaleString()}`;

    return {
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
                    background: #ffffff;
                ">
                    <h1 style="
                        margin:0;
                        font-size:22px;
                        font-weight:700;
                        color:#0f172a;
                    ">
                        Bunchly Analytics
                    </h1>
                    <p style="
                        margin:6px 0 0;
                        font-size:14px;
                        color:#64748b;
                        font-weight: 500;
                    ">
                        Revenue Report • ${range.toUpperCase()}
                    </p>
                </div>

                <!-- Body -->
                <div style="padding:32px">
                    <p style="
                        margin:0 0 24px;
                        font-size:15px;
                        color:#334155;
                    ">
                        Hi ${adminName},<br/><br/>
                        Here is your revenue summary generated on <strong>${date}</strong>.
                        A detailed CSV export containing all transactions for this period is attached to this email.
                    </p>

                    <!-- Stats Grid -->
                    <div style="
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 16px;
                        margin-bottom: 24px;
                    ">
                        <!-- Gross Rev -->
                        <div style="background:#f8fafc; padding:20px; border-radius:12px; border:1px solid #e2e8f0;">
                            <div style="font-size:12px; color:#64748b; font-weight:600; text-transform:uppercase;">Gross Pay</div>
                            <div style="font-size:20px; color:#0f172a; font-weight:700; margin-top:4px;">
                                ${formatCurrency(stats.grossRevenue)}
                            </div>
                        </div>

                        <!-- Net Rev -->
                        <div style="background:#f0fdf4; padding:20px; border-radius:12px; border:1px solid #bbf7d0;">
                            <div style="font-size:12px; color:#15803d; font-weight:600; text-transform:uppercase;">Net Revenue</div>
                            <div style="font-size:20px; color:#166534; font-weight:700; margin-top:4px;">
                                ${formatCurrency(stats.netRevenue)}
                            </div>
                        </div>

                         <!-- AOV -->
                        <div style="background:#f8fafc; padding:20px; border-radius:12px; border:1px solid #e2e8f0;">
                            <div style="font-size:12px; color:#64748b; font-weight:600; text-transform:uppercase;">Avg. Order</div>
                            <div style="font-size:20px; color:#0f172a; font-weight:700; margin-top:4px;">
                                ${formatCurrency(Math.round(stats.aov))}
                            </div>
                        </div>

                         <!-- Refund Rate -->
                        <div style="background:#fff7ed; padding:20px; border-radius:12px; border:1px solid #ffedd5;">
                            <div style="font-size:12px; color:#c2410c; font-weight:600; text-transform:uppercase;">Refund Rate</div>
                            <div style="font-size:20px; color:#9a3412; font-weight:700; margin-top:4px;">
                                ${stats.refundRate}%
                            </div>
                        </div>
                    </div>

                    <p style="
                        margin:0 0 10px;
                        font-size:14px;
                        color:#475569;
                    ">
                        This report is confidential and for internal use only.
                    </p>

                    <div style="
                         margin-top: 32px;
                         padding-top: 24px;
                         border-top: 1px solid #eef0f4;
                         text-align: center;
                         font-size: 13px;
                         color: #94a3b8;
                    ">
                        © ${new Date().getFullYear()} Bunchly Inc.
                    </div>
                </div>
            </div>
        </div>
        `
    };
};
