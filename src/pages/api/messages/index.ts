// Converted to TypeScript - migrated
import { getCollection, createDocument } from "@/lib/firebase";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { checkAdminStatus } from "@/lib/authUtils";
import { NextApiRequest, NextApiResponse } from "next";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string | Date;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (req.method === "GET") {
    const isAdmin = checkAdminStatus(session);

    if (!session || !isAdmin) {
      return res.status(403).json({ message: "Forbidden" });
    }

    try {
      const page = parseInt(req.query.page as string || "1");
      const limit = parseInt(req.query.limit as string || "10");
      
      const result = await getCollection<Message>("messages");
      let messages = result.documents || [];
      
      // Sort by createdAt descending
      messages.sort((a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime());
      
      const totalMessages = messages.length;
      const unreadCount = messages.filter(m => !m.isRead).length;
      
      // Paginate
      const startIndex = (page - 1) * limit;
      const paginatedMessages = messages.slice(startIndex, startIndex + limit);

      return res.status(200).json({
        success: true,
        data: paginatedMessages,
        total: totalMessages,
        unread: unreadCount,
        page: page,
        limit: limit,
        totalPages: Math.ceil(totalMessages / limit),
      });
    } catch (error: unknown) {
      console.error("Error fetching messages:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  } else if (req.method === "POST") {
    try {
      const { name, email, message } = req.body;

      if (!message) {
        return res.status(400).json({
          success: false,
          message: "Message content is required",
        });
      }

      const docId = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
      const newMessage = await createDocument("messages", docId, {
        name: name || "Anonymous",
        email: email || "anonymous@example.com",
        message,
        isRead: false,
        createdAt: new Date(),
      }) as unknown as Message;

      return res.status(201).json({
        success: true,
        message: "Message created",
        data: newMessage,
      });
    } catch (error: unknown) {
      console.error("Database error on POST:", error);
      return res.status(500).json({
        success: false,
        message: "Error creating message",
      });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
