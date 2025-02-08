import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import crypto from "crypto";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Do not reveal if a user exists or not.
      return res.status(200).json({
        message:
          "If a matching account was found, a password reset email has been sent.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    // Update user with reset token
    try {
      await User.findOneAndUpdate(
        { email },
        {
          resetPasswordToken: resetToken,
          resetPasswordExpires: resetTokenExpiry,
        },
        { runValidators: false }
      );
    } catch (error) {
      console.error("Error saving reset token:", error);
      return res.status(500).json({ message: "Error saving reset token" });
    }

    // Create transporter
    let transporter;
    try {
      transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      });
    } catch (transporterError) {
      console.error("Transporter creation error:", transporterError);
      return res
        .status(500)
        .json({ message: "Error creating email transporter" });
    }

    // Reset link
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <p>You requested a password reset.</p>
        <p>Click this link to reset your password:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (sendMailError) {
      console.error("Error sending email:", sendMailError);
      return res.status(500).json({ message: "Error sending reset email" });
    }

    return res.status(200).json({
      message:
        "If a matching account was found, a password reset email has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
