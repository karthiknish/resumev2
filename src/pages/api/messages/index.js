import { getCollection, createDocument } from "@/lib/firebase";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { checkAdminStatus } from "@/lib/authUtils";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (req.method === "GET") {
    const isAdmin = checkAdminStatus(session);

    if (!session || !isAdmin) {
      return res.status(403).json({ message: "Forbidden" });
    }

    try {
      const { page = 1, limit = 10 } = req.query;
      
      const result = await getCollection("messages");
      let messages = result.documents || [];
      
      // Sort by createdAt descending
      messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      const totalMessages = messages.length;
      const unreadCount = messages.filter(m => !m.isRead).length;
      
      // Paginate
      const startIndex = (parseInt(page) - 1) * parseInt(limit);
      const paginatedMessages = messages.slice(startIndex, startIndex + parseInt(limit));

      return res.status(200).json({
        success: true,
        data: paginatedMessages,
        total: totalMessages,
        unread: unreadCount,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalMessages / parseInt(limit)),
      });
    } catch (error) {
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

      const docId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newMessage = await createDocument("messages", docId, {
        name: name || "Anonymous",
        email: email || "anonymous@example.com",
        message,
        isRead: false,
        createdAt: new Date(),
      });

      return res.status(201).json({
        success: true,
        message: "Message created",
        data: newMessage,
      });
    } catch (error) {
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
