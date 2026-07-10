const nodemailer = require("nodemailer");
const getTransportConfig = (emailAddress) => {
    const domain = emailAddress.split("@")[1]?.toLowerCase();

    const serviceMap = {
        "gmail.com": "gmail",

        "yahoo.com": "yahoo",
        "yahoo.co.uk": "yahoo",
        "yahoo.fr": "yahoo",
        "yahoo.de": "yahoo",
        "yahoo.es": "yahoo",
        "ymail.com": "yahoo",

        "outlook.com": "outlook365",
        "hotmail.com": "hotmail",
        "live.com": "hotmail",
        "msn.com": "hotmail",

        "icloud.com": "iCloud",
        "me.com": "iCloud",
        "mac.com": "iCloud",

        "aol.com": "AOL",

        "zoho.com": "Zoho",
        "zohomail.com": "Zoho",
    };

    const service = serviceMap[domain];

    if (service) {
        return {
            service,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        };
    }
    return {
        host: process.env.EMAIL_HOST || domain,
        port: parseInt(process.env.EMAIL_PORT || "587", 10),
        secure: process.env.EMAIL_SECURE === "true",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    };
};

const transporter = nodemailer.createTransport(
    getTransportConfig(process.env.EMAIL_USER || "")
);

const sendEmail = async (to, subject, text, replyTo = null, html = null) => {
    const mailOptions = {
        from: `"Makany" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
    };

    if (html) {
        mailOptions.html = html;
    }

    if (replyTo) {
        mailOptions.replyTo = replyTo;
    }

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
