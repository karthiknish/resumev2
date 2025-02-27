import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  // Check if user is authenticated and is an admin
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated" });
  }

  // Check for admin role
  const isAdmin =
    session.user.role === "admin" ||
    session.user.isAdmin === true ||
    session.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  if (!isAdmin) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  // Only allow PATCH method
  if (req.method !== "PATCH") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    // Connect to the database
    await dbConnect();
    const Message = require("@/models/Message").default;

    // Update all unread messages to mark them as read
    const result = await Message.updateMany(
      { isRead: false },
      { $set: { isRead: true } }
    );

    return res.status(200).json({
      success: true,
      message: `${result.modifiedCount} messages marked as read`,
    });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating messages",
    });
  }
}
