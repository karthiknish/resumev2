import { NextApiRequest, NextApiResponse } from "next";
import { getCollection, updateDocument } from "@/lib/firebase";
import crypto from "crypto";
import { sendEmail } from "@/lib/brevoClient";

interface User {
  _id: string;
  email: string;
  name?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email } = req.body as { email: string };

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const emailLower = email.toLowerCase();
    const docId = emailLower.replace(/[^a-z0-9]/g, "_");

    const result = await getCollection<User>("users");
    const users = result.documents || [];
    const user = users.find((u) => u.email === emailLower);

    if (!user) {
      console.log(`Forgot password attempt for non-existent email: ${email}`);
      return res.status(200).json({
        message: "If a matching account was found, a password reset email has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000);

    await updateDocument("users", user._id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetTokenExpiry,
    });

    const resetUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

    try {
      await sendEmail({
        to: user.email,
        toName: user.name || "User",
        subject: "Password Reset Request - Karthik Nishanth",
        htmlContent: `
          <p>Hi ${user.name || "there"}</p>
          <p>You requested a password reset for your account associated with ${user.email}.</p>
          <p>Click this link within the next hour to reset your password:</p>
          <p><a href="${resetUrl}" style="color: #3b82f6; text-decoration: underline;">Reset Password</a></p>
          <p>If you didn't request this, please ignore this email. Your password will remain unchanged.</p>
          <p>Link: ${resetUrl}</p>
        `,
      });
      console.log(`Password reset email sent to: ${user.email}`);
    } catch (sendMailError) {
      console.error("Error sending password reset email:", sendMailError);
      return res.status(500).json({
        message: "Could not send password reset email. Please try again later.",
      });
    }

    return res.status(200).json({
      message: "If a matching account was found, a password reset email has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
