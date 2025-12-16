import { getCollection, updateDocument } from "@/lib/firebase";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { token, email, password } = req.body;

    if (!token || !email || !password) {
      return res.status(400).json({ message: "Token, email, and password are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    const emailLower = email.toLowerCase();

    // Find user with valid reset token
    const result = await getCollection("users");
    const users = result.documents || [];
    const user = users.find(u => 
      u.email === emailLower && 
      u.resetPasswordToken === token &&
      u.resetPasswordExpires && new Date(u.resetPasswordExpires) > new Date()
    );

    if (!user) {
      return res.status(400).json({
        message: "Password reset token is invalid or has expired. Please request a new password reset.",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user's password and clear reset token
    await updateDocument("users", user._id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    return res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}