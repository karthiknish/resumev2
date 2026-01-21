import mongoose, { Schema, Document, Model } from "mongoose";

interface IMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface IChatHistory extends Document {
  email?: string;
  messages: IMessage[];
  createdAt: Date;
  lastUpdated: Date;
  device?: string;
  browser?: string;
  ip?: string;
}

const MessageSchema = new Schema<IMessage>({
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ChatHistorySchema = new Schema<IChatHistory>({
  email: { type: String, required: false, index: true },
  messages: [MessageSchema],
  createdAt: { type: Date, default: Date.now, index: true },
  lastUpdated: { type: Date, default: Date.now },
  device: { type: String },
  browser: { type: String },
  ip: { type: String },
});

const ChatHistory: Model<IChatHistory> = mongoose.models.ChatHistory || mongoose.model<IChatHistory>("ChatHistory", ChatHistorySchema);

export default ChatHistory;

export const ChatHistoryFields = {
  email: "email",
  messages: "messages",
  timestamp: "createdAt",
  lastUpdated: "lastUpdated",
  device: "device",
  browser: "browser",
  ip: "ip",
  location: "location",
};

export interface IRequest {
  headers?: {
    "user-agent"?: string;
    "x-forwarded-for"?: string;
  };
  connection?: {
    remoteAddress?: string;
    socket?: {
      remoteAddress?: string;
    };
  };
  socket?: {
    remoteAddress?: string;
  };
}

export function createChatRecord(email: string | undefined, messages: IMessage[], req: IRequest | null = null) {
  const now = new Date();

  const chatRecord: any = {
    [ChatHistoryFields.email]: email,
    [ChatHistoryFields.messages]: messages,
    [ChatHistoryFields.timestamp]: now,
    [ChatHistoryFields.lastUpdated]: now,
  };

  if (req) {
    const userAgent = req.headers?.["user-agent"] || "";

    const ip =
      req.headers?.["x-forwarded-for"] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.connection?.socket?.remoteAddress ||
      "";

    chatRecord[ChatHistoryFields.device] = detectDevice(userAgent);
    chatRecord[ChatHistoryFields.browser] = detectBrowser(userAgent);
    chatRecord[ChatHistoryFields.ip] = ip;
  }

  return chatRecord;
}

function detectDevice(userAgent: string): string {
  if (!userAgent) return "unknown";

  if (/iPhone|iPad|iPod/i.test(userAgent)) return "iOS";
  if (/Android/i.test(userAgent)) return "Android";
  if (/Windows Phone/i.test(userAgent)) return "Windows Phone";
  if (/Windows NT/i.test(userAgent)) return "Windows";
  if (/Macintosh|Mac OS X/i.test(userAgent)) return "Mac";
  if (/Linux/i.test(userAgent)) return "Linux";

  return "other";
}

function detectBrowser(userAgent: string): string {
  if (!userAgent) return "unknown";

  if (/Edg\//i.test(userAgent)) return "Edge";
  if (/Firefox\//i.test(userAgent)) return "Firefox";
  if (/Chrome\//i.test(userAgent) && !/Chromium/i.test(userAgent))
    return "Chrome";
  if (/Safari\//i.test(userAgent) && !/Chrome/i.test(userAgent))
    return "Safari";
  if (/MSIE|Trident/i.test(userAgent)) return "Internet Explorer";
  if (/Opera|OPR\//i.test(userAgent)) return "Opera";

  return "other";
}
