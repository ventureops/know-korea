import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

interface SendReplyParams {
  to: string;
  name: string;
  category: string;
  message: string;
}

export async function sendContactReply({ to, name, category, message }: SendReplyParams) {
  await transporter.verify();
  const mailOptions = {
    from: `Know Korea <${process.env.GMAIL_USER}>`,
    to,
    subject: `Re: Your ${category} — Know Korea`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #202d51;">
        <p>Hi ${name},</p>
        <div style="white-space: pre-wrap; line-height: 1.7;">${message}</div>
        <hr style="border: none; border-top: 1px solid #e2e7ff; margin: 24px 0;" />
        <p style="color: #69769e; font-size: 14px;">
          — Know Korea<br />
          <a href="https://knowkorea.com" style="color: #425c85;">knowkorea.com</a>
        </p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}
