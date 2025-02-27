// src/pages/api/get-chat-logs.js
// This endpoint retrieves saved chat logs from MongoDB for admin viewing

import clientPromise from "@/lib/mongodb";
import { CHAT_COLLECTION } from "@/models/ChatHistory";

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Check for authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Extract the token/password
    const token = authHeader.substring(7);

    // In a real app, use a proper authentication system
    // This is a simple check for demonstration purposes
    if (token !== process.env.ADMIN_PASSWORD && token !== "admin123") {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "resume-chatbot");
    const collection = db.collection(CHAT_COLLECTION);

    // Get page parameters for pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Get filter parameters
    const emailFilter = req.query.email;
    const query = emailFilter
      ? { email: { $regex: emailFilter, $options: "i" } }
      : {};

    // Get total count for pagination
    const totalCount = await collection.countDocuments(query);

    // Get chat logs sorted by timestamp (newest first)
    const chatLogs = await collection
      .find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Return the chat logs with pagination metadata
    return res.status(200).json({
      chatLogs,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error retrieving chat logs from MongoDB:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
}
