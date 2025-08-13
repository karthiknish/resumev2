import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();
    const { token, email, password } = req.body;

    // Validate input
    if (!token || !email || !password) {
      return res
        .status(400)
        .json({ message: "Token, email, and password are required" });
    }

    // Check password strength
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }

    // Find user with valid reset token
    const user = await User.findOne({
      email,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message:
          "Password reset token is invalid or has expired. Please request a new password reset.",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user's password and clear reset token
    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
    });

    return res
      .status(200)
      .json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}