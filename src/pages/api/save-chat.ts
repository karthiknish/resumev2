// Converted to TypeScript - migrated
import { getDocument, createDocument, updateDocument } from "@/lib/firebase";
import type { NextApiRequest, NextApiResponse } from "next";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, messages } = req.body as { email: string; messages: ChatMessage[] };

    if (!email || !messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Email and messages array are required" });
    }

    // Validate messages
    for (const msg of messages) {
      if (!msg.role || !["user", "assistant"].includes(msg.role)) {
        return res.status(400).json({ 
          error: `Invalid message role. Must be 'user' or 'assistant'.` 
        });
      }
      if (typeof msg.content !== "string" || msg.content.trim() === "") {
        return res.status(400).json({ 
          error: "All messages must have non-empty content." 
        });
      }
    }

    const docId = email.toLowerCase().replace(/[^a-z0-9]/g, "_");
    
    // Check if chat exists
    const existingChat = await getDocument("chatHistory", docId);

    if (existingChat) {
      // Update existing chat
      await updateDocument("chatHistory", docId, {
        messages,
        lastUpdated: new Date(),
      });
    } else {
      // Create new chat
      await createDocument("chatHistory", docId, {
        email: email.toLowerCase(),
        messages,
        createdAt: new Date(),
        lastUpdated: new Date(),
        userAgent: req.headers["user-agent"] || "Unknown",
        ip: (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || 
            req.headers["x-real-ip"] || 
            req.socket?.remoteAddress || "Unknown",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Chat history saved successfully",
    });
  } catch (error: unknown) {
    console.error("Error saving chat history:", error);
    return res.status(500).json({ 
      error: "Internal server error", 
      message: error instanceof Error ? error.message : "An unknown error occurred"
    });
  }
}

