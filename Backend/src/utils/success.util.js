function registerSuccessHtml(user, verifyUrl) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - Pax AI</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a; padding: 40px 0;">
            <tr>
                <td align="center">
                    <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #1a1a2e; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.4);">
                        
                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 40px 30px; text-align: center;">
                                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                                    Welcome to Pax AI ✨
                                </h1>
                                <p style="margin: 10px 0 0; color: rgba(255,255,255,0.85); font-size: 15px;">
                                    Just one more step to get started
                                </p>
                            </td>
                        </tr>

                        <!-- Body -->
                        <tr>
                            <td style="padding: 36px 40px;">
                                <p style="margin: 0 0 20px; color: #e0e0e0; font-size: 16px; line-height: 1.6;">
                                    Hey <strong style="color: #a78bfa;">${user.username}</strong>, welcome aboard! 🎉
                                </p>
                                <p style="margin: 0 0 28px; color: #b0b0b0; font-size: 15px; line-height: 1.6;">
                                    Please verify your email address to activate your account. Click the button below to confirm your email:
                                </p>

                                <!-- Account Details Card -->
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #16213e; border-radius: 12px; border: 1px solid rgba(255,255,255,0.06);">
                                    <tr>
                                        <td style="padding: 24px;">
                                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                                <tr>
                                                    <td style="padding: 8px 0; color: #8b8b8b; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Username</td>
                                                    <td style="padding: 8px 0; color: #e0e0e0; font-size: 15px; text-align: right; font-weight: 600;">${user.username}</td>
                                                </tr>
                                                <tr>
                                                    <td colspan="2" style="border-bottom: 1px solid rgba(255,255,255,0.06);"></td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 8px 0; color: #8b8b8b; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Email</td>
                                                    <td style="padding: 8px 0; color: #e0e0e0; font-size: 15px; text-align: right; font-weight: 600;">${user.email}</td>
                                                </tr>
                                                <tr>
                                                    <td colspan="2" style="border-bottom: 1px solid rgba(255,255,255,0.06);"></td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 8px 0; color: #8b8b8b; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Status</td>
                                                    <td style="padding: 8px 0; text-align: right;">
                                                        <span style="background-color: rgba(234,179,8,0.15); color: #facc15; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600;">Pending Verification</span>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Verify Button -->
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 32px;">
                                    <tr>
                                        <td align="center">
                                            <a href="${verifyUrl}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 36px; border-radius: 10px; font-size: 15px; font-weight: 600; letter-spacing: 0.3px;">
                                                Verify My Email →
                                            </a>
                                        </td>
                                    </tr>
                                </table>

                                <p style="margin: 24px 0 0; color: #6b6b6b; font-size: 13px; text-align: center; line-height: 1.5;">
                                    This link will expire in 24 hours.<br>
                                    If the button doesn't work, copy and paste this link in your browser:
                                </p>
                                <p style="margin: 8px 0 0; color: #a78bfa; font-size: 12px; text-align: center; word-break: break-all;">
                                    ${verifyUrl}
                                </p>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="padding: 24px 40px; background-color: rgba(0,0,0,0.2); text-align: center; border-top: 1px solid rgba(255,255,255,0.04);">
                                <p style="margin: 0 0 8px; color: #6b6b6b; font-size: 13px;">
                                    © ${new Date().getFullYear()} Pax AI. All rights reserved.
                                </p>
                                <p style="margin: 0; color: #4a4a4a; font-size: 12px;">
                                    If you didn't create this account, please ignore this email.
                                </p>
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
}

function emailVerifiedHtml(user) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verified - Pax AI</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a; padding: 40px 0;">
            <tr>
                <td align="center">
                    <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #1a1a2e; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.4);">
                        
                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 40px 40px 30px; text-align: center;">
                                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                                    Email Verified ✅
                                </h1>
                                <p style="margin: 10px 0 0; color: rgba(255,255,255,0.85); font-size: 15px;">
                                    Your account is now fully activated
                                </p>
                            </td>
                        </tr>

                        <!-- Body -->
                        <tr>
                            <td style="padding: 36px 40px;">
                                <p style="margin: 0 0 20px; color: #e0e0e0; font-size: 16px; line-height: 1.6;">
                                    Awesome, <strong style="color: #4ade80;">${user.username}</strong>! Your email has been successfully verified. 🎉
                                </p>
                                <p style="margin: 0 0 28px; color: #b0b0b0; font-size: 15px; line-height: 1.6;">
                                    You now have full access to all Pax AI features. Start exploring and make the most of your account!
                                </p>

                                <!-- Status Card -->
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #16213e; border-radius: 12px; border: 1px solid rgba(255,255,255,0.06);">
                                    <tr>
                                        <td style="padding: 24px; text-align: center;">
                                            <p style="margin: 0 0 8px; color: #8b8b8b; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Account Status</p>
                                            <span style="background-color: rgba(34,197,94,0.15); color: #4ade80; padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: 600;">Verified & Active</span>
                                        </td>
                                    </tr>
                                </table>

                                <!-- CTA Button -->
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 32px;">
                                    <tr>
                                        <td align="center">
                                            <a href="${process.env.CLIENT_URL || '#'}" style="display: inline-block; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: #ffffff; text-decoration: none; padding: 14px 36px; border-radius: 10px; font-size: 15px; font-weight: 600; letter-spacing: 0.3px;">
                                                Start Exploring →
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="padding: 24px 40px; background-color: rgba(0,0,0,0.2); text-align: center; border-top: 1px solid rgba(255,255,255,0.04);">
                                <p style="margin: 0; color: #6b6b6b; font-size: 13px;">
                                    © ${new Date().getFullYear()} Pax AI. All rights reserved.
                                </p>
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
}

function alreadyVerifiedHtml(user) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Already Verified - Pax AI</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0a0a0a; padding: 40px 0;">
            <tr>
                <td align="center">
                    <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #1a1a2e; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.4);">
                        
                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 40px 40px 30px; text-align: center;">
                                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                                    Already Verified ℹ️
                                </h1>
                                <p style="margin: 10px 0 0; color: rgba(255,255,255,0.85); font-size: 15px;">
                                    No action needed
                                </p>
                            </td>
                        </tr>

                        <!-- Body -->
                        <tr>
                            <td style="padding: 36px 40px;">
                                <p style="margin: 0 0 20px; color: #e0e0e0; font-size: 16px; line-height: 1.6;">
                                    Hey <strong style="color: #60a5fa;">${user.username}</strong>, your email is already verified! 👍
                                </p>
                                <p style="margin: 0 0 28px; color: #b0b0b0; font-size: 15px; line-height: 1.6;">
                                    Your account is active and you have full access to all features. No further action is required.
                                </p>

                                <!-- CTA Button -->
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 16px;">
                                    <tr>
                                        <td align="center">
                                            <a href="${process.env.CLIENT_URL || '#'}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; padding: 14px 36px; border-radius: 10px; font-size: 15px; font-weight: 600; letter-spacing: 0.3px;">
                                                Go to Dashboard →
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="padding: 24px 40px; background-color: rgba(0,0,0,0.2); text-align: center; border-top: 1px solid rgba(255,255,255,0.04);">
                                <p style="margin: 0; color: #6b6b6b; font-size: 13px;">
                                    © ${new Date().getFullYear()} Pax AI. All rights reserved.
                                </p>
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
}

export { registerSuccessHtml, emailVerifiedHtml, alreadyVerifiedHtml };