import { getServerSession } from "next-auth/next";
import { authOptions } from "./[...nextauth]";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/User";

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Get the session
    const session = await getServerSession(req, res, authOptions);

    // Check if user is authenticated
    if (!session) {
      return res.status(401).json({
        isAdmin: false,
        message: "Not authenticated",
      });
    }

    // Connect to database
    await dbConnect();

    // Get user from database to verify role
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return res.status(404).json({
        isAdmin: false,
        message: "User not found",
      });
    }

    // Check if user is admin
    const isAdmin =
      user.role === "admin" ||
      session.user.role === "admin" ||
      session.user.email === process.env.ADMIN_EMAIL;

    // Return admin status
    return res.status(200).json({
      isAdmin,
      session: {
        email: session.user.email,
        role: session.user.role || "undefined",
      },
      dbUser: {
        email: user.email,
        role: user.role || "undefined",
      },
      adminEmail: process.env.ADMIN_EMAIL ? "set" : "not set",
    });
  } catch (error) {
    console.error("Error checking admin status:", error);
    return res.status(500).json({
      isAdmin: false,
      message: "Error checking admin status",
    });
  }
}
