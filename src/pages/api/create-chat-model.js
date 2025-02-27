// src/pages/api/create-chat-model.js
// This endpoint creates the chat history collection and indices if they don't exist

import clientPromise from "@/lib/mongodb";
import { CHAT_COLLECTION } from "@/models/ChatHistory";

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  // Check for secret to prevent unauthorized access
  const { secret } = req.body;
  if (!secret || secret !== process.env.API_SECRET) {
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }

  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();

    // Check if collection exists
    const collections = await db
      .listCollections({ name: CHAT_COLLECTION })
      .toArray();

    if (collections.length > 0) {
      // Collection already exists
      return res.status(200).json({
        success: true,
        message: `Collection ${CHAT_COLLECTION} already exists`,
      });
    }

    // Create collection
    await db.createCollection(CHAT_COLLECTION);

    // Create indices for better query performance
    await db.collection(CHAT_COLLECTION).createIndex({ email: 1 });
    await db.collection(CHAT_COLLECTION).createIndex({ timestamp: -1 });

    return res.status(200).json({
      success: true,
      message: `Collection ${CHAT_COLLECTION} created with indices`,
    });
  } catch (error) {
    console.error("Error creating chat collection:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create chat collection",
      error: error.message,
    });
  }
}
