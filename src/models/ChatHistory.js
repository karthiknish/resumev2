// src/models/ChatHistory.js
import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ChatHistorySchema = new mongoose.Schema({
  email: { type: String, required: false, index: true }, // Allow anonymous chats
  messages: [MessageSchema],
  createdAt: { type: Date, default: Date.now, index: true },
  lastUpdated: { type: Date, default: Date.now },
  device: { type: String },
  browser: { type: String },
  ip: { type: String },
  // Add other fields if needed
});

// Ensure the model is only compiled once and export it
const ChatHistory =
  mongoose.models.ChatHistory ||
  mongoose.model("ChatHistory", ChatHistorySchema);
export default ChatHistory;

// This file defines the structure for chat history documents

// Define collection name - No longer needed if using mongoose.model
// export const CHAT_COLLECTION = "chatHistories";

// Define chat history fields - Keep if used elsewhere
export const ChatHistoryFields = {
  email: "email",
  messages: "messages",
  timestamp: "createdAt", // Map timestamp to createdAt for consistency
  lastUpdated: "lastUpdated",
  device: "device",
  browser: "browser",
  ip: "ip",
  location: "location", // Assuming location might be added later
};

// Helper function to create a new chat history record - Keep if used
export function createChatRecord(email, messages, req = null) {
  const now = new Date(); // Use Date object directly

  // Basic chat record
  const chatRecord = {
    [ChatHistoryFields.email]: email,
    [ChatHistoryFields.messages]: messages,
    [ChatHistoryFields.timestamp]: now, // Maps to createdAt
    [ChatHistoryFields.lastUpdated]: now,
  };

  // Add additional metadata if request object is provided
  if (req) {
    // Get user agent information
    const userAgent = req.headers["user-agent"] || "";

    // Get IP address (handle various proxy scenarios)
    const ip =
      req.headers["x-forwarded-for"] ||
      req.connection?.remoteAddress || // Optional chaining
      req.socket?.remoteAddress || // Optional chaining
      req.connection?.socket?.remoteAddress || // Optional chaining
      "";

    chatRecord[ChatHistoryFields.device] = detectDevice(userAgent);
    chatRecord[ChatHistoryFields.browser] = detectBrowser(userAgent);
    chatRecord[ChatHistoryFields.ip] = ip;
  }

  return chatRecord;
}

// Helper functions to extract device and browser information - Keep
function detectDevice(userAgent) {
  if (!userAgent) return "unknown";

  if (/iPhone|iPad|iPod/i.test(userAgent)) return "iOS";
  if (/Android/i.test(userAgent)) return "Android";
  if (/Windows Phone/i.test(userAgent)) return "Windows Phone";
  if (/Windows NT/i.test(userAgent)) return "Windows"; // More specific check
  if (/Macintosh|Mac OS X/i.test(userAgent)) return "Mac";
  if (/Linux/i.test(userAgent)) return "Linux";

  return "other";
}

function detectBrowser(userAgent) {
  if (!userAgent) return "unknown";

  // Order matters: Edge before Chrome
  if (/Edg\//i.test(userAgent)) return "Edge"; // Modern Edge
  if (/Firefox\//i.test(userAgent)) return "Firefox";
  if (/Chrome\//i.test(userAgent) && !/Chromium/i.test(userAgent))
    return "Chrome";
  if (/Safari\//i.test(userAgent) && !/Chrome/i.test(userAgent))
    return "Safari";
  if (/MSIE|Trident/i.test(userAgent)) return "Internet Explorer";
  if (/Opera|OPR\//i.test(userAgent)) return "Opera";

  return "other";
}
