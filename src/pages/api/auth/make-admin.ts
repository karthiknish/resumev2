import { NextApiRequest, NextApiResponse } from "next";
import { getCollection, updateDocument } from "@/lib/firebase";

interface User {
  _id: string;
  email: string;
  name?: string;
  role?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, adminSecret } = req.body as { email: string; adminSecret: string };

  if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET_KEY) {
    return res.status(401).json({ message: "Unauthorized: Invalid admin secret" });
  }

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const emailLower = email.toLowerCase();

    const result = await getCollection<User>("users");
    const users = result.documents || [];
    const user = users.find((u) => u.email === emailLower);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await updateDocument("users", user._id, { role: "admin" });

    return res.status(200).json({
      message: "User role updated to admin successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: "admin",
      },
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return res.status(500).json({ message: "Error updating user role" });
  }
}
