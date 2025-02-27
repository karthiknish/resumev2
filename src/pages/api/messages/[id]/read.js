import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import mongoose from "mongoose";

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

  // Get message ID from the URL
  const { id } = req.query;

  if (!id || id === "undefined") {
    return res
      .status(400)
      .json({ success: false, message: "Message ID is required" });
  }

  try {
    // Connect to the database
    await dbConnect();
    const Message = require("@/models/Message").default;

    // Check if the ID is a valid ObjectId
    if (!mongoose.isValidObjectId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid message ID format" });
    }

    // Update the message to mark it as read
    const result = await Message.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true } // Return the updated document
    );

    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Message marked as read",
    });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating message",
    });
  }
}
