import nodemailer from "nodemailer";

let transporter;

try {
  transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE || "gmail",
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
} catch (err) {
  console.warn("Nodemailer init error:", err.message);
}

export const sendEmail = async ({ to, subject, html, text }) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("Email skipped: SMTP credentials not set.");
    return;
  }
  try {
    const info = await transporter.sendMail({
      from: `"MWU Clearance System" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text: text || "",
      html: html || text,
    });
    console.log(`📧 Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Email Send Failed to ${to}:`, error.message);
  }
};
