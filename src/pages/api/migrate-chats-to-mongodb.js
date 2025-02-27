// src/pages/api/migrate-chats-to-mongodb.js
// This endpoint migrates existing chat data from JSON file to MongoDB

import fs from "fs";
import path from "path";
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
    // Path to JSON file
    const dataDirectory = path.join(process.cwd(), "data");
    const filePath = path.join(dataDirectory, "chatHistory.json");

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Chat history file not found",
      });
    }

    // Read JSON file
    const fileContents = fs.readFileSync(filePath, "utf8");
    let chatData;

    try {
      chatData = JSON.parse(fileContents);
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: "Invalid JSON in chat history file",
        error: e.message,
      });
    }

    if (
      !chatData ||
      !Array.isArray(chatData.chatLogs) ||
      chatData.chatLogs.length === 0
    ) {
      return res.status(200).json({
        success: true,
        message: "No chat logs to migrate",
        count: 0,
      });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection(CHAT_COLLECTION);

    // Process each chat log
    const results = {
      total: chatData.chatLogs.length,
      inserted: 0,
      updated: 0,
      skipped: 0,
      errors: 0,
    };

    for (const chatLog of chatData.chatLogs) {
      try {
        // Check if chat log has required fields
        if (
          !chatLog.email ||
          !chatLog.messages ||
          !Array.isArray(chatLog.messages)
        ) {
          results.skipped++;
          continue;
        }

        // Check if chat already exists in MongoDB
        const existingChat = await collection.findOne({ email: chatLog.email });

        if (existingChat) {
          // Update existing chat with new messages
          const result = await collection.updateOne(
            { email: chatLog.email },
            {
              $set: {
                lastUpdated: new Date().toISOString(),
                messages: chatLog.messages,
              },
              $setOnInsert: {
                timestamp: chatLog.timestamp || new Date().toISOString(),
                device: chatLog.device || "unknown",
                browser: chatLog.browser || "unknown",
                ip: chatLog.ip || "unknown",
              },
            },
            { upsert: true }
          );

          if (result.modifiedCount > 0) {
            results.updated++;
          } else {
            results.skipped++;
          }
        } else {
          // Insert new chat record
          const result = await collection.insertOne({
            email: chatLog.email,
            messages: chatLog.messages,
            timestamp: chatLog.timestamp || new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            device: chatLog.device || "unknown",
            browser: chatLog.browser || "unknown",
            ip: chatLog.ip || "unknown",
          });

          if (result.insertedId) {
            results.inserted++;
          }
        }
      } catch (error) {
        console.error("Error processing chat log:", error);
        results.errors++;
      }
    }

    return res.status(200).json({
      success: true,
      message: "Migration completed",
      results,
    });
  } catch (error) {
    console.error("Error during migration:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to migrate chat data",
      error: error.message,
    });
  }
}
