import { connectDB } from "@/lib/db";
import Message from "@/models/Message";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { checkAdminStatus } from "@/lib/authUtils";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    res.setHeader("Allow", ["PUT"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const session = await getServerSession(req, res, authOptions);

  const isAdmin = checkAdminStatus(session);

  if (!session || !isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    await connectDB();

    const result = await Message.updateMany(
      { isRead: false },
      { $set: { isRead: true } }
    );

    if (result.acknowledged) {
      res
        .status(200)
        .json({ success: true, modifiedCount: result.modifiedCount });
    } else {
      res.status(500).json({ message: "Failed to update messages" });
    }
  } catch (error) {
    console.error("Error marking all messages as read:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
