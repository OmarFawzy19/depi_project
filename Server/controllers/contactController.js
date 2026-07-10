const sendEmail = require("../utils/sendEmail");

const SUPPORT_EMAIL = "makany.site@gmail.com";

exports.sendContactForm = async (req, res) => {
    const { name, email, phone, category, message } = req.body;

    if (!name || !email || !category || !message) {
        return res.status(400).json({ message: "name, email, category and message are required." });
    }

    const emailBody =
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `📬 NEW CONTACT FORM SUBMISSION\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `👤 SENDER\n` +
        `Name    : ${name}\n` +
        `Email   : ${email}\n` +
        `Phone   : ${phone || "Not provided"}\n\n` +
        `🏷️  CATEGORY\n` +
        `${category}\n\n` +
        `💬 MESSAGE\n` +
        `${message}\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `Reply to this email to respond directly to the sender.\n` +
        `Sent via Makany Contact Form.`;

    await sendEmail(
        SUPPORT_EMAIL,
        `[Contact Form] ${category} – from ${name}`,
        emailBody,
        email
    );

    res.status(200).json({ message: "Your message has been sent successfully." });
};
