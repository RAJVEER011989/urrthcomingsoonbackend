import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post("/send-enquiry", async (req, res) => {
  const { firstName, lastName, email, message } = req.body;

  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  try {
    // 1) Send enquiry to your mailbox

    const adminEmail = "truelip@urrthhotels.com";
    const customerEmail = email.trim().toLowerCase();
    await transporter.sendMail({
  from: `"URRTH Website" <${process.env.EMAIL_USER}>`,
  to: adminEmail,
  replyTo: customerEmail,
  subject: "New URRTH Enquiry",
  html: `
    <h2>New URRTH Enquiry</h2>
    <p><strong>First Name:</strong> ${firstName}</p>
    <p><strong>Last Name:</strong> ${lastName}</p>
    <p><strong>Email:</strong> ${customerEmail}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
  `,
});

if (customerEmail !== adminEmail.toLowerCase()) {
    await transporter.sendMail({
  from: `"URRTH Hotels" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: "Thank you for contacting URRTH",
   attachments: [
    {
      filename: "logo.png",
      path: "./assets/urrth_logo_transparent.png",
      cid: "urrthlogo"
    }
  ],
  html: `
  <div style="margin:0;padding:0;background-color:#f6f1ea;">
    <div style="max-width:680px;margin:0 auto;padding:32px 18px;font-family:Arial,Helvetica,sans-serif;color:#2b241d;line-height:1.7;">

      <div style="background:#fffdf9;border:1px solid #eadfce;border-radius:22px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.06);">

        <div style="background:linear-gradient(135deg,#1f1a16,#3b2c21);padding:28px 24px 20px;text-align:center;">
          <p style="margin:0;font-size:12px;letter-spacing:0.28em;text-transform:uppercase;color:#d6b07a;">
            URRTH Hotels
          </p>
          <h1 style="margin:12px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:30px;font-weight:500;color:#fff8ef;">
            Thank you for your enquiry
          </h1>
        </div>

        <div style="padding:32px 26px;">

          <p style="margin:0 0 14px;">Dear ${firstName},</p>

          <p style="margin:0 0 14px;">
            Thank you for reaching out to <strong>URRTH</strong>. We have received your enquiry successfully
            and truly appreciate your interest in our upcoming hospitality destination.
          </p>

          <p style="margin:0 0 18px;">
            Our team will review your message and get back to you shortly with the relevant details.
          </p>

          <div style="margin:24px 0;padding:18px 18px;background:#f8f2e8;border:1px solid #eadbc4;border-radius:14px;">
            <p style="margin:0 0 10px;font-size:13px;letter-spacing:0.14em;text-transform:uppercase;color:#a67843;">
              Your Submitted Message
            </p>
            <p style="margin:0;white-space:pre-line;color:#3b3128;">${message}</p>
          </div>

          <p style="margin:0 0 10px;">
            We look forward to welcoming you soon.
          </p>

          <p style="margin:24px 0 0;">
            Warm regards,<br/>
            <strong>URRTH Team</strong>
          </p>

          <div style="margin:22px 0 0;">
            <div style="width:100%;height:1px;background:#eadfce;margin-bottom:18px;"></div>
            <img src="cid:urrthlogo"
              style="width:150px;max-width:100%;display:block;"
            />
          </div>

          <div style="margin-top:24px;padding-top:18px;border-top:1px solid #efe5d8;">
            <p style="margin:0 0 6px;font-size:14px;color:#6e5a47;">
              <strong>Email:</strong> truelip@urrthhotels.com
            </p>
            <p style="margin:0 0 6px;font-size:14px;color:#6e5a47;">
              <strong>Phone / WhatsApp:</strong> +91 9479282528
            </p>
            <p style="margin:0;font-size:14px;color:#6e5a47;">
              <strong>Website:</strong> urrthhotels.com
            </p>
          </div>

        </div>
      </div>

      <p style="margin:14px 0 0;text-align:center;font-size:12px;color:#8a7765;">
        This is an automated acknowledgement from URRTH Hotels.
      </p>
    </div>
  </div>
  `
});
}

    return res.json({
      success: true,
      message: "Enquiry sent successfully.",
    });
  } catch (error) {
    console.error("Email send error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send enquiry.",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});