import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";
import crypto from "crypto";
import nodemailer from "nodemailer";

async function sendResetEmail(email, resetToken) {
  const transporter = nodemailer.createTransport({});

  const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: process.env.NOREPLY_EMAIL,
    to: email,
    subject: "Password Reset Request",
    text: `To reset your password, please click the following link: ${resetLink}`,
    html: `<p>To reset your password, please click the following link: <a href="${resetLink}">${resetLink}</a></p>`,
  };

  await transporter.sendMail(mailOptions);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: "Email is required" });
    return;
  }

  await dbConnect();

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = new Date(Date.now() + 3600000);
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    await sendResetEmail(email, resetToken);

    res.status(200).json({ message: "Reset email sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
