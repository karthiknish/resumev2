import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import crypto from "crypto";
import { sendEmail } from "@/lib/mailer"; // Import the new sendEmail function

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
      // Still return success to prevent email enumeration
      console.log(`Forgot password attempt for non-existent email: ${email}`);
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
      // Use await with findOneAndUpdate to ensure it completes
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id }, // Use _id for reliability
        {
          resetPasswordToken: resetToken,
          resetPasswordExpires: resetTokenExpiry,
        },
        { new: true, runValidators: false } // Return updated doc, skip validators for this update
      );

      if (!updatedUser) {
        // This shouldn't happen if findOne found the user, but good to check
        console.error(`Failed to update user ${user.email} with reset token.`);
        throw new Error("Error saving reset token");
      }
      console.log(`Reset token saved for user: ${user.email}`);
    } catch (error) {
      console.error("Error saving reset token:", error);
      return res
        .status(500)
        .json({ message: "Error preparing password reset" });
    }

    // Construct Reset URL
    // Ensure NEXTAUTH_URL is set correctly in your environment (.env.local or production env)
    const resetUrl = `${
      process.env.NEXTAUTH_URL || "http://localhost:3000"
    }/reset-password?token=${resetToken}`;

    // Email content
    const emailHtml = `
        <p>Hi ${user.name || "there"},</p>
        <p>You requested a password reset for your account associated with ${
          user.email
        }.</p>
        <p>Click this link within the next hour to reset your password:</p>
        <p><a href="${resetUrl}" style="color: #3b82f6; text-decoration: underline;">Reset Password</a></p>
        <p>If you didn't request this, please ignore this email. Your password will remain unchanged.</p>
        <p>Link: ${resetUrl}</p>
      `;

    // Send email using the mailer utility
    try {
      console.log(`Attempting to send password reset email to: ${user.email}`);
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request - Karthik Nishanth",
        html: emailHtml,
      });
      console.log(`Password reset email sent successfully to: ${user.email}`);
    } catch (sendMailError) {
      console.error("Error sending password reset email:", sendMailError);
      // Don't reveal specific email errors to the client
      return res
        .status(500)
        .json({
          message:
            "Could not send password reset email. Please try again later.",
        });
    }

    // Return generic success message regardless of user existence or email success
    return res.status(200).json({
      message:
        "If a matching account was found, a password reset email has been sent.",
    });
  } catch (error) {
    console.error("Forgot password general error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
