import { NextApiRequest, NextApiResponse } from "next";
import { createDocument } from "@/lib/firebase";
import {
  sendEmail,
  generateContactNotificationEmail,
  generateThankYouEmail,
} from "@/lib/brevoClient";

interface RateLimitRecord {
  count: number;
  firstRequest: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

interface RateCheckResult {
  allowed: boolean;
  remaining: number;
}

interface ContactRequestBody {
  name: string;
  email: string;
  message: string;
  _honeypot?: string;
  _timestamp?: string;
}

function checkRateLimit(ip: string): RateCheckResult {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, firstRequest: now });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
  }

  if (now - record.firstRequest > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, firstRequest: now });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  rateLimitMap.set(ip, record);
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - record.count };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed. Please use POST." });
  }

  const { name, email, message, _honeypot, _timestamp } = req.body as ContactRequestBody;

  if (_honeypot) {
    console.log("Spam detected: honeypot field was filled");
    return res.status(200).json({
      message: "Message received successfully! Karthik will get back to you soon.",
    });
  }

  if (_timestamp) {
    const timeDiff = Date.now() - parseInt(_timestamp, 10);
    if (timeDiff < 3000) {
      console.log(`Spam detected: form submitted too quickly (${timeDiff}ms)`);
      return res.status(200).json({
        message: "Message received successfully! Karthik will get back to you soon.",
      });
    }
  }

  const clientIP =
    req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() ||
    req.headers["x-real-ip"]?.toString() ||
    req.socket?.remoteAddress ||
    "unknown";

  const rateCheck = checkRateLimit(clientIP);
  if (!rateCheck.allowed) {
    console.log(`Rate limit exceeded for IP: ${clientIP}`);
    return res.status(429).json({ message: "Too many requests. Please try again later." });
  }

  if (!name || !email || !message) {
    const missingFields: string[] = [];
    if (!name) missingFields.push("Name");
    if (!email) missingFields.push("Email");
    if (!message) missingFields.push("Message");
    return res.status(400).json({
      message: `Missing required fields: ${missingFields.join(", ")}.`,
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format provided." });
  }

  if (name.length > 100) {
    return res.status(400).json({ message: "Name is too long (max 100 characters)." });
  }
  if (message.length > 5000) {
    return res.status(400).json({ message: "Message is too long (max 5000 characters)." });
  }

  const spamPatterns = [
    /\b(viagra|cialis|casino|lottery|winner|congratulations|claim your prize)\b/i,
    /<script/i,
    /\[url=/i,
    /\[link=/i,
  ];

  const combinedText = `${name} ${message}`;
  if (spamPatterns.some((pattern) => pattern.test(combinedText))) {
    console.log("Spam detected: suspicious content patterns");
    return res.status(200).json({
      message: "Message received successfully! Karthik will get back to you soon.",
    });
  }

  try {
    const docId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await createDocument("contacts", docId, {
      name,
      email,
      message,
      createdAt: new Date(),
      isRead: false,
    });
    console.log(`Contact saved to Firebase: ${docId}`);

    const [adminEmailResult, thankYouEmailResult] = await Promise.allSettled([
      sendEmail({
        to: process.env.EMAIL_TO,
        toName: "Karthik Nishanth",
        subject: `New Contact Form Message from ${name}`,
        htmlContent: generateContactNotificationEmail({
          name,
          email,
          message: message.replace(/\n/g, "<br>"),
        }),
        replyTo: email,
      }),
      sendEmail({
        to: email,
        toName: name,
        subject: "Thank you for contacting Karthik Nishanth!",
        htmlContent: generateThankYouEmail({ name }),
      })
    ]);

    if (adminEmailResult.status === 'fulfilled') {
      console.log("Admin notification email sent successfully");
    } else {
      console.error("Failed to send admin notification email:", adminEmailResult.reason);
    }

    if (thankYouEmailResult.status === 'fulfilled') {
      console.log(`Thank you email sent to ${email}`);
    } else {
      console.error(`Failed to send thank you email to ${email}:`, thankYouEmailResult.reason);
    }

    return res.status(200).json({
      message: "Message received successfully! Karthik will get back to you soon.",
    });
  } catch (error) {
    console.error("Contact form processing error:", error);
    return res.status(500).json({
      message: "An internal server error occurred. Please try again later.",
    });
  }
}
