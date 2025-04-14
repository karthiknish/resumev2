import { connectDB } from "@/lib/dbConnect";
import Message from "@/models/Message";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { checkAdminStatus } from "@/lib/authUtils"; // Import the utility

export default async function handler(req, res) {
  await connectDB();
  const session = await getServerSession(req, res, authOptions);

  if (req.method === "GET") {
    // Use the utility function for the admin check
    const isAdmin = checkAdminStatus(session);

    if (!session || !isAdmin) {
      return res.status(403).json({ message: "Forbidden" });
    }

    try {
      const {
        page = 1,
        limit = 10,
        sort = "createdAt",
        order = "desc",
      } = req.query;
      const skip = (page - 1) * limit;
      const sortOrder = order === "asc" ? 1 : -1;

      const messages = await Message.find({})
        .sort({ [sort]: sortOrder })
        .skip(skip)
        .limit(parseInt(limit));

      const totalMessages = await Message.countDocuments();
      const unreadCount = await Message.countDocuments({ isRead: false });

      res.status(200).json({
        success: true,
        data: messages,
        total: totalMessages,
        unread: unreadCount,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalMessages / limit),
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  } else if (req.method === "POST") {
    console.log("[API /api/messages] Handling POST request");
    try {
      const { name, email, message } = req.body;

      if (!message) {
        return res.status(400).json({
          success: false,
          message: "Message content is required",
        });
      }

      // Create new message using Mongoose
      const newMessage = new Message({
        name: name || "Anonymous",
        email: email || "anonymous@example.com",
        message,
        isRead: false,
        createdAt: new Date(),
      });

      const result = await newMessage.save();
      console.log("[API /api/messages] Message created:", result._id);

      return res.status(201).json({
        success: true,
        message: "Message created",
        data: result.toObject(),
      });
    } catch (error) {
      console.error("[API /api/messages] Database error on POST:", error);
      return res.status(500).json({
        success: false,
        message: "Error creating message",
      });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
