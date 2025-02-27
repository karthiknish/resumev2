// src/pages/api/save-chat.js
// This endpoint saves chat sessions to MongoDB

import clientPromise from "@/lib/mongodb";
import { CHAT_COLLECTION, createChatRecord } from "@/models/ChatHistory";

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, messages } = req.body;

    if (!email || !messages || !Array.isArray(messages)) {
      return res
        .status(400)
        .json({ error: "Email and messages array are required" });
    }

    // Create a chat record with metadata from the request
    const chatRecord = createChatRecord(email, messages, req);

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "resume-chatbot");
    const collection = db.collection(CHAT_COLLECTION);

    // Try to find an existing chat record with the same email
    const existingChat = await collection.findOne({ email });

    if (existingChat) {
      // Update existing chat with new messages and lastUpdated timestamp
      await collection.updateOne(
        { email },
        {
          $set: {
            messages,
            lastUpdated: new Date().toISOString(),
          },
        }
      );
    } else {
      // Insert new chat record
      await collection.insertOne(chatRecord);
    }

    // Return success message
    return res
      .status(200)
      .json({
        success: true,
        message: "Chat history saved successfully to MongoDB",
      });
  } catch (error) {
    console.error("Error saving chat history to MongoDB:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
}
