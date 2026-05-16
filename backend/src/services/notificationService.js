const nodemailer = require('nodemailer');

/**
 * Sends an email notification.
 * @param {string} to - Recipient email.
 * @param {string} subject - Email subject.
 * @param {string} text - Email body.
 */
const sendEmail = async (to, subject, text) => {
    // Create a transporter
    // NOTE: In production, use real credentials from .env
    // For testing, you can use ethereal.email or a real Gmail account with app password
    // Skip sending if credentials are missing
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('[EMAIL] Skipped: Missing SMTP credentials in .env');
        return null;
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.ethereal.email',
        port: process.env.SMTP_PORT || 587,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const mailOptions = {
        from: '"Emergency Health Monitor" <emergency@healthmonitor.com>',
        to,
        subject,
        text
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`[EMAIL] Sent: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error('[EMAIL] Error:', error.message);
        return null;
    }
};

module.exports = { sendEmail };
