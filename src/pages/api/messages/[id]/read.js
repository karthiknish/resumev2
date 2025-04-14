import { connectDB } from "@/lib/dbConnect";
import Message from "@/models/Message";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import mongoose from "mongoose";
import { checkAdminStatus } from "@/lib/authUtils";

export default async function handler(req, res) {
  const { id } = req.query;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid message ID" });
  }

  const session = await getServerSession(req, res, authOptions);

  // Use the utility function for the check
  const isAdmin = checkAdminStatus(session);

  if (!session || !isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (req.method === "PUT") {
    try {
      await connectDB();
      const updatedMessage = await Message.findByIdAndUpdate(
        id,
        { isRead: true },
        { new: true }
      );

      if (!updatedMessage) {
        return res.status(404).json({ message: "Message not found" });
      }

      res.status(200).json({ success: true, data: updatedMessage });
    } catch (error) {
      console.error("Error marking message as read:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
