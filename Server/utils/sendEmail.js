const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendEmail = async (to, subject, text, replyTo = null) => {
    const mailOptions = {
        from: `"Makany" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
    };

    // If a replyTo email is provided, replies will go directly to that address
    // (e.g., the buyer's email) instead of the Makany platform email
    if (replyTo) {
        mailOptions.replyTo = replyTo;
    }

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;