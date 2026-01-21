// Converted to TypeScript - migrated
import { getDocument, updateDocument } from "@/lib/firebase";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import { checkAdminStatus } from "@/lib/authUtils";

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "Invalid message ID" });
  }

  const session = await getServerSession(req, res, authOptions);
  const isAdmin = checkAdminStatus(session);

  if (!session || !isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (req.method !== "PUT") {
    res.setHeader("Allow", ["PUT"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const message = await getDocument("messages", id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    const updatedMessage = await updateDocument("messages", id, { isRead: true });
    return res.status(200).json({ success: true, data: updatedMessage });
  } catch (error) {
    console.error("Error marking message as read:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

