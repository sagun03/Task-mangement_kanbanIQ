import nodemailer from "nodemailer";
require("dotenv").config();

class EmailService {
  private transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: process.env.EMAIL_USER, // Add your email to .env
        pass: process.env.EMAIL_PASS, // Add your email password to .env
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string, html?: string) {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        html,
      });
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
}

export default EmailService;
