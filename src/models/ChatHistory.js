// src/models/ChatHistory.js
// This file defines the structure for chat history documents

// Define collection name
export const CHAT_COLLECTION = "chatHistories";

// Define chat history fields
export const ChatHistoryFields = {
  email: "email",
  messages: "messages",
  timestamp: "timestamp",
  lastUpdated: "lastUpdated",
  device: "device",
  browser: "browser",
  ip: "ip",
  location: "location",
};

// Helper function to create a new chat history record
export function createChatRecord(email, messages, req = null) {
  const now = new Date().toISOString();

  // Basic chat record
  const chatRecord = {
    [ChatHistoryFields.email]: email,
    [ChatHistoryFields.messages]: messages,
    [ChatHistoryFields.timestamp]: now,
    [ChatHistoryFields.lastUpdated]: now,
  };

  // Add additional metadata if request object is provided
  if (req) {
    // Get user agent information
    const userAgent = req.headers["user-agent"] || "";

    // Get IP address (handle various proxy scenarios)
    const ip =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket?.remoteAddress ||
      "";

    chatRecord[ChatHistoryFields.device] = detectDevice(userAgent);
    chatRecord[ChatHistoryFields.browser] = detectBrowser(userAgent);
    chatRecord[ChatHistoryFields.ip] = ip;
  }

  return chatRecord;
}

// Helper functions to extract device and browser information
function detectDevice(userAgent) {
  if (!userAgent) return "unknown";

  if (/iPhone|iPad|iPod/i.test(userAgent)) return "iOS";
  if (/Android/i.test(userAgent)) return "Android";
  if (/Windows Phone/i.test(userAgent)) return "Windows Phone";
  if (/Windows/i.test(userAgent)) return "Windows";
  if (/Macintosh|Mac OS X/i.test(userAgent)) return "Mac";
  if (/Linux/i.test(userAgent)) return "Linux";

  return "other";
}

function detectBrowser(userAgent) {
  if (!userAgent) return "unknown";

  if (/Edge/i.test(userAgent)) return "Edge";
  if (/Firefox/i.test(userAgent)) return "Firefox";
  if (/Chrome/i.test(userAgent)) return "Chrome";
  if (/Safari/i.test(userAgent)) return "Safari";
  if (/MSIE|Trident/i.test(userAgent)) return "Internet Explorer";
  if (/Opera|OPR/i.test(userAgent)) return "Opera";

  return "other";
}
