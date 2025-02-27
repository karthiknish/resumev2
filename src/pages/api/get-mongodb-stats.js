// src/pages/api/get-mongodb-stats.js
// This endpoint retrieves statistics about MongoDB collections

import clientPromise from "@/lib/mongodb";
import { CHAT_COLLECTION } from "@/models/ChatHistory";

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  // Check for authorization
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const token = authHeader.substring(7);
  if (
    token !== process.env.ADMIN_API_KEY &&
    token !== process.env.NEXT_PUBLIC_ADMIN_PASSWORD
  ) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();

    // Get chat collection stats
    const stats = {};

    // Get total number of chat documents
    stats.totalChats = await db.collection(CHAT_COLLECTION).countDocuments();

    // Get the most recent chat
    const latestChat = await db
      .collection(CHAT_COLLECTION)
      .find()
      .sort({ timestamp: -1 })
      .limit(1)
      .toArray();

    if (latestChat.length > 0) {
      stats.latestChatTimestamp = latestChat[0].timestamp;
    }

    // Get total number of messages across all chats
    const messagePipeline = [
      {
        $project: {
          messageCount: { $size: "$messages" },
        },
      },
      {
        $group: {
          _id: null,
          totalMessages: { $sum: "$messageCount" },
        },
      },
    ];

    const messageResult = await db
      .collection(CHAT_COLLECTION)
      .aggregate(messagePipeline)
      .toArray();
    stats.totalMessages =
      messageResult.length > 0 ? messageResult[0].totalMessages : 0;

    // Get user stats (unique users)
    stats.uniqueUsers = await db
      .collection(CHAT_COLLECTION)
      .countDocuments({}, { unique: true });

    // Get device breakdown
    const devicePipeline = [
      {
        $group: {
          _id: "$device",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ];

    stats.deviceBreakdown = await db
      .collection(CHAT_COLLECTION)
      .aggregate(devicePipeline)
      .toArray();

    // Get browser breakdown
    const browserPipeline = [
      {
        $group: {
          _id: "$browser",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ];

    stats.browserBreakdown = await db
      .collection(CHAT_COLLECTION)
      .aggregate(browserPipeline)
      .toArray();

    // Get chat frequency by day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const chatsByDayPipeline = [
      {
        $match: {
          timestamp: { $gte: thirtyDaysAgo.toISOString() },
        },
      },
      {
        $addFields: {
          dateString: {
            $substr: ["$timestamp", 0, 10],
          },
        },
      },
      {
        $group: {
          _id: "$dateString",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ];

    stats.chatsByDay = await db
      .collection(CHAT_COLLECTION)
      .aggregate(chatsByDayPipeline)
      .toArray();

    return res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Error retrieving MongoDB stats:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve MongoDB stats",
      error: error.message,
    });
  }
}
