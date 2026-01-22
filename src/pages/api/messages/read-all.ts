// Converted to TypeScript - migrated
import { getCollection, updateDocument } from "@/lib/firebase";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { checkAdminStatus } from "@/lib/authUtils";
import { NextApiRequest, NextApiResponse } from "next";

interface Message {
  _id: string;
  isRead: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
    const result = await getCollection<Message>("messages");
    const messages = result.documents || [];
    
    // Find unread messages and mark them as read
    const unreadMessages = messages.filter(m => !m.isRead);
    let modifiedCount = 0;
    
    for (const message of unreadMessages) {
      await updateDocument("messages", message._id, { isRead: true });
      modifiedCount++;
    }

    return res.status(200).json({ success: true, modifiedCount });
  } catch (error: unknown) {
    console.error("Error marking all messages as read:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
