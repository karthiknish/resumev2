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
  const users = result.documents || [];
  const user = users.find((u: any) =>
    u.email === emailLower &&
    (u as any).resetPasswordToken === token &&
    (u as any).resetPasswordExpires &&
    new Date((u as any).resetPasswordExpires) > new Date()
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
    resetPasswordExpires: null as any,
  });

  return res.status(200).json({ message: "Password has been reset successfully" });
}
