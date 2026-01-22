// Converted to TypeScript - migrated to Firebase
export interface IMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface IChatHistory {
  _id?: string;
  id?: string;
  email?: string;
  messages: IMessage[];
  createdAt: Date;
  lastUpdated: Date;
  device?: string;
  browser?: string;
  ip?: string;
}

export type ChatHistoryType = IChatHistory;

export function detectDevice(userAgent: string): string {
  if (!userAgent) return "unknown";
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "iOS";
  if (/Android/i.test(userAgent)) return "Android";
  if (/Windows Phone/i.test(userAgent)) return "Windows Phone";
  if (/Windows NT/i.test(userAgent)) return "Windows";
  if (/Macintosh|Mac OS X/i.test(userAgent)) return "Mac";
  if (/Linux/i.test(userAgent)) return "Linux";
  return "other";
}

export function detectBrowser(userAgent: string): string {
  if (!userAgent) return "unknown";
  if (/Edg\//i.test(userAgent)) return "Edge";
  if (/Firefox\//i.test(userAgent)) return "Firefox";
  if (/Chrome\//i.test(userAgent) && !/Chromium/i.test(userAgent)) return "Chrome";
  if (/Safari\//i.test(userAgent) && !/Chrome/i.test(userAgent)) return "Safari";
  if (/MSIE|Trident/i.test(userAgent)) return "Internet Explorer";
  if (/Opera|OPR\//i.test(userAgent)) return "Opera";
  return "other";
}

