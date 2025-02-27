import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Check admin secret to authorize this operation
  const { email, adminSecret } = req.body;

  if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET_KEY) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid admin secret" });
  }

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    await dbConnect();

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user role to admin
    user.role = "admin";
    await user.save();

    return res.status(200).json({
      message: "User role updated to admin successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return res.status(500).json({ message: "Error updating user role" });
  }
}
