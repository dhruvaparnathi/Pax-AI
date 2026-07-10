function verifySuccessPage(user) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verified - Pax AI</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #0a0a0a;
                font-family: 'Inter', sans-serif;
                padding: 20px;
            }
            .card {
                background: #1a1a2e;
                border-radius: 20px;
                padding: 48px 40px;
                max-width: 480px;
                width: 100%;
                text-align: center;
                box-shadow: 0 8px 32px rgba(0,0,0,0.4);
                border: 1px solid rgba(255,255,255,0.04);
                animation: fadeIn 0.6s ease-out;
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .icon {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                background: linear-gradient(135deg, #22c55e, #16a34a);
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 24px;
                font-size: 36px;
                box-shadow: 0 4px 20px rgba(34,197,94,0.3);
            }
            h1 {
                color: #ffffff;
                font-size: 24px;
                font-weight: 700;
                margin-bottom: 12px;
            }
            .subtitle {
                color: #a0a0a0;
                font-size: 15px;
                line-height: 1.6;
                margin-bottom: 32px;
            }
            .username {
                color: #4ade80;
                font-weight: 600;
            }
            .badge {
                display: inline-block;
                background: rgba(34,197,94,0.12);
                color: #4ade80;
                padding: 6px 16px;
                border-radius: 20px;
                font-size: 13px;
                font-weight: 600;
                margin-bottom: 32px;
            }
            .btn {
                display: inline-block;
                background: linear-gradient(135deg, #22c55e, #16a34a);
                color: #fff;
                text-decoration: none;
                padding: 14px 36px;
                border-radius: 12px;
                font-size: 15px;
                font-weight: 600;
                transition: transform 0.2s, box-shadow 0.2s;
            }
            .btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(34,197,94,0.3);
            }
            .footer {
                margin-top: 32px;
                color: #505050;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="card">
            <div class="icon">✅</div>
            <h1>Email Verified!</h1>
            <p class="subtitle">
                Congratulations <span class="username">${user.username}</span>, your email has been successfully verified. You now have full access to Pax AI.
            </p>
            <div class="badge">Verified & Active</div>
            <br>
            <a href="${process.env.CLIENT_URL || '/'}" class="btn">Get Started →</a>
            <p class="footer">© ${new Date().getFullYear()} Pax AI. All rights reserved.</p>
        </div>
    </body>
    </html>
    `;
}

function alreadyVerifiedPage(user) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Already Verified - Pax AI</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #0a0a0a;
                font-family: 'Inter', sans-serif;
                padding: 20px;
            }
            .card {
                background: #1a1a2e;
                border-radius: 20px;
                padding: 48px 40px;
                max-width: 480px;
                width: 100%;
                text-align: center;
                box-shadow: 0 8px 32px rgba(0,0,0,0.4);
                border: 1px solid rgba(255,255,255,0.04);
                animation: fadeIn 0.6s ease-out;
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .icon {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 24px;
                font-size: 36px;
                box-shadow: 0 4px 20px rgba(59,130,246,0.3);
            }
            h1 { color: #ffffff; font-size: 24px; font-weight: 700; margin-bottom: 12px; }
            .subtitle { color: #a0a0a0; font-size: 15px; line-height: 1.6; margin-bottom: 32px; }
            .username { color: #60a5fa; font-weight: 600; }
            .badge {
                display: inline-block;
                background: rgba(59,130,246,0.12);
                color: #60a5fa;
                padding: 6px 16px;
                border-radius: 20px;
                font-size: 13px;
                font-weight: 600;
                margin-bottom: 32px;
            }
            .btn {
                display: inline-block;
                background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                color: #fff;
                text-decoration: none;
                padding: 14px 36px;
                border-radius: 12px;
                font-size: 15px;
                font-weight: 600;
                transition: transform 0.2s, box-shadow 0.2s;
            }
            .btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(59,130,246,0.3); }
            .footer { margin-top: 32px; color: #505050; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="card">
            <div class="icon">ℹ️</div>
            <h1>Already Verified</h1>
            <p class="subtitle">
                Hey <span class="username">${user.username}</span>, your email is already verified! No further action is needed.
            </p>
            <div class="badge">Verified & Active</div>
            <br>
            <a href="${process.env.CLIENT_URL || '/'}" class="btn">Go to Dashboard →</a>
            <p class="footer">© ${new Date().getFullYear()} Pax AI. All rights reserved.</p>
        </div>
    </body>
    </html>
    `;
}

function verifyErrorPage(message) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verification Failed - Pax AI</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #0a0a0a;
                font-family: 'Inter', sans-serif;
                padding: 20px;
            }
            .card {
                background: #1a1a2e;
                border-radius: 20px;
                padding: 48px 40px;
                max-width: 480px;
                width: 100%;
                text-align: center;
                box-shadow: 0 8px 32px rgba(0,0,0,0.4);
                border: 1px solid rgba(255,255,255,0.04);
                animation: fadeIn 0.6s ease-out;
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .icon {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                background: linear-gradient(135deg, #ef4444, #dc2626);
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 24px;
                font-size: 36px;
                box-shadow: 0 4px 20px rgba(239,68,68,0.3);
            }
            h1 { color: #ffffff; font-size: 24px; font-weight: 700; margin-bottom: 12px; }
            .subtitle { color: #a0a0a0; font-size: 15px; line-height: 1.6; margin-bottom: 32px; }
            .error-msg {
                display: inline-block;
                background: rgba(239,68,68,0.12);
                color: #f87171;
                padding: 6px 16px;
                border-radius: 20px;
                font-size: 13px;
                font-weight: 600;
                margin-bottom: 32px;
            }
            .btn {
                display: inline-block;
                background: linear-gradient(135deg, #ef4444, #dc2626);
                color: #fff;
                text-decoration: none;
                padding: 14px 36px;
                border-radius: 12px;
                font-size: 15px;
                font-weight: 600;
                transition: transform 0.2s, box-shadow 0.2s;
            }
            .btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(239,68,68,0.3); }
            .footer { margin-top: 32px; color: #505050; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="card">
            <div class="icon">❌</div>
            <h1>Verification Failed</h1>
            <p class="subtitle">
                We couldn't verify your email address. Please try again or request a new verification link.
            </p>
            <div class="error-msg">${message}</div>
            <br>
            <a href="${process.env.CLIENT_URL || '/'}" class="btn">Go Home →</a>
            <p class="footer">© ${new Date().getFullYear()} Pax AI. All rights reserved.</p>
        </div>
    </body>
    </html>
    `;
}

export { verifySuccessPage, alreadyVerifiedPage, verifyErrorPage };
