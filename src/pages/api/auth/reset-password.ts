import { NextApiRequest, NextApiResponse } from "next";
import { getCollection, updateDocument } from "@/lib/firebase";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { token, email, password } = req.body as { token: string; email: string; password: string };

  if (!token || !email || !password) {
    return res.status(400).json({ message: "Token, email, and password are required" });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters long" });
  }

  const emailLower = email.toLowerCase();

  const result = await getCollection("users");
  const users = (result.documents || []) as unknown as Array<{
    _id: string;
    email: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: string | Date;
  }>;
  const user = users.find((u) =>
    u.email === emailLower &&
    u.resetPasswordToken === token &&
    u.resetPasswordExpires &&
    new Date(u.resetPasswordExpires) > new Date()
  );

  if (!user) {
    return res.status(400).json({
      message: "Password reset token is invalid or has expired. Please request a new password reset.",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await updateDocument("users", user._id, {
    password: hashedPassword,
    resetPasswordToken: null,
    resetPasswordExpires: null,
  });

  return res.status(200).json({ message: "Password has been reset successfully" });
}
