
/**
 * GENERATES A PREMIUM HTML EMAIL TEMPLATE
 * Compatible with most email clients (Gmail, Outlook, Apple Mail).
 */
export const getPremiumEmailHtml = ({
    title,
    messageLines = [],
    actionText,
    actionUrl,
    accentColor = "#4F46E5", // Indigo default
    warning = false
}) => {
    // Colors
    const color = warning ? "#DC2626" : accentColor;
    const bgColor = "#F3F4F6";

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <style>
            body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: ${bgColor}; }
            .container { max-width: 550px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
            .content { padding: 40px; text-align: center; }
            .logo { width: 140px; margin-bottom: 24px; }
            .title { margin: 0 0 16px; font-size: 24px; color: #111827; font-weight: 700; }
            .text { color: #4B5563; line-height: 1.6; margin-bottom: 12px; font-size: 16px; }
            .btn { display: inline-block; background-color: ${color}; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-weight: 600; margin-top: 24px; transition: opacity 0.2s; box-shadow: 0 4px 12px ${color}40; }
            .btn:hover { opacity: 0.9; }
            .footer { background: #FAFAFA; padding: 20px; text-align: center; font-size: 12px; color: #9CA3AF; border-top: 1px solid #E5E7EB; }
            @media only screen and (max-width: 600px) {
                .container { width: 100% !important; border-radius: 0 !important; margin: 0 !important; }
                .content { padding: 30px 20px; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="content">
                <img src="https://bunchly.netlify.app/img/Bunchly-dark.png" alt="Bunchly" class="logo" />
                
                <h1 class="title">${title}</h1>
                
                ${messageLines.map(line => `<p class="text">${line}</p>`).join('')}

                ${actionText && actionUrl ? `
                    <a href="${actionUrl}" class="btn">${actionText}</a>
                ` : ''}
            </div>
            
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Bunchly. All rights reserved.</p>
                <p>You received this email regarding your account status.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};
