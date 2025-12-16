import { getCollection, updateDocument } from "@/lib/firebase";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, adminSecret } = req.body;

  if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET_KEY) {
    return res.status(401).json({ message: "Unauthorized: Invalid admin secret" });
  }

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const emailLower = email.toLowerCase();
    
    // Find user in Firebase
    const result = await getCollection("users");
    const users = result.documents || [];
    const user = users.find(u => u.email === emailLower);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user role to admin
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
