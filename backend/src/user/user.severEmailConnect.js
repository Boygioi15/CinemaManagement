const nodemailer = require("nodemailer");
require('dotenv').config();

let transporter = null;

const initEmailTransporter = async () => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        await transporter.verify();
        console.log("Email server connected successfully!");
    }
    return transporter;
};

module.exports = initEmailTransporter;