import { NextApiRequest, NextApiResponse } from "next";
import { getDocument, createDocument } from "@/lib/firebase";
import bcrypt from "bcryptjs";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { name, email, password } = req.body as { name: string; email: string; password: string };

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const emailLower = email.toLowerCase();
    const docId = emailLower.replace(/[^a-z0-9]/g, "_");

    const existingUser = await getDocument("users", docId);
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await createDocument("users", docId, {
      name,
      email: emailLower,
      password: hashedPassword,
      role: "user",
      createdAt: new Date(),
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Error creating user" });
  }
}
