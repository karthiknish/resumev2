import dbConnect from "@/lib/dbConnect";
import { createContactSubmission } from "@/lib/contactService";
import {
  sendEmail,
  generateContactNotificationEmail,
  generateThankYouEmail,
} from "@/lib/brevoClient";

// Simple in-memory rate limiter (resets on server restart)
// In production, consider using Redis or a database
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 5;

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, firstRequest: now });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
  }

  // Reset if window has passed
  if (now - record.firstRequest > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, firstRequest: now });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
  }

  // Check if limit exceeded
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0 };
  }

  // Increment count
  record.count += 1;
  rateLimitMap.set(ip, record);
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - record.count };
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now - record.firstRequest > RATE_LIMIT_WINDOW_MS) {
      rateLimitMap.delete(ip);
    }
  }
}, 10 * 60 * 1000); // Clean every 10 minutes

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ message: "Method Not Allowed. Please use POST." });
  }

  const { name, email, message, _honeypot, _timestamp } = req.body;

  // --- Spam Control: Honeypot ---
  // If the hidden honeypot field is filled, it's likely a bot
  if (_honeypot) {
    console.log("Spam detected: honeypot field was filled");
    // Return success to not alert the bot, but don't process
    return res.status(200).json({
      message: "Message received successfully! Karthik will get back to you soon.",
    });
  }

  // --- Spam Control: Timing Check ---
  // If form was submitted too quickly (less than 3 seconds), likely a bot
  if (_timestamp) {
    const submissionTime = Date.now();
    const formLoadTime = parseInt(_timestamp, 10);
    const timeDiff = submissionTime - formLoadTime;

    if (timeDiff < 3000) {
      console.log(`Spam detected: form submitted too quickly (${timeDiff}ms)`);
      return res.status(200).json({
        message: "Message received successfully! Karthik will get back to you soon.",
      });
    }
  }

  // --- Spam Control: Rate Limiting ---
  const clientIP =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.headers["x-real-ip"] ||
    req.socket?.remoteAddress ||
    "unknown";

  const rateCheck = checkRateLimit(clientIP);
  if (!rateCheck.allowed) {
    console.log(`Rate limit exceeded for IP: ${clientIP}`);
    return res.status(429).json({
      message: "Too many requests. Please try again later.",
    });
  }

  // --- Input Validation ---
  if (!name || !email || !message) {
    const missingFields = [];
    if (!name) missingFields.push("Name");
    if (!email) missingFields.push("Email");
    if (!message) missingFields.push("Message");
    return res.status(400).json({
      message: `Missing required fields: ${missingFields.join(", ")}.`,
    });
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format provided." });
  }

  // Length checks
  if (name.length > 100) {
    return res
      .status(400)
      .json({ message: "Name is too long (max 100 characters)." });
  }
  if (message.length > 5000) {
    return res
      .status(400)
      .json({ message: "Message is too long (max 5000 characters)." });
  }

  // Additional spam detection: Check for suspicious patterns
  const spamPatterns = [
    /\b(viagra|cialis|casino|lottery|winner|congratulations|claim your prize)\b/i,
    /<script/i,
    /\[url=/i,
    /\[link=/i,
  ];
  
  const combinedText = `${name} ${message}`;
  const isSpammy = spamPatterns.some((pattern) => pattern.test(combinedText));
  if (isSpammy) {
    console.log("Spam detected: suspicious content patterns");
    return res.status(200).json({
      message: "Message received successfully! Karthik will get back to you soon.",
    });
  }
  // --- End Validation ---

  try {
    // Connect to database
    await dbConnect();

    // Save contact message to database
    const newContact = await createContactSubmission({ name, email, message });

    // Send notification email to admin using Brevo
    try {
      await sendEmail({
        to: process.env.EMAIL_TO,
        toName: "Karthik Nishanth",
        subject: `New Contact Form Message from ${name}`,
        htmlContent: generateContactNotificationEmail({
          name,
          email,
          message: message.replace(/\n/g, "<br>"),
        }),
        replyTo: email,
      });
      console.log("Admin notification email sent successfully");
    } catch (emailError) {
      console.error("Failed to send admin notification email:", emailError);
      // Don't fail the request, the message is already saved
    }

    // Send thank you email to the sender using Brevo
    try {
      await sendEmail({
        to: email,
        toName: name,
        subject: "Thank you for contacting Karthik Nishanth!",
        htmlContent: generateThankYouEmail({ name }),
      });
      console.log(`Thank you email sent to ${email}`);
    } catch (emailError) {
      console.error(`Failed to send thank you email to ${email}:`, emailError);
      // Don't fail the request, the message is already saved
    }

    return res.status(200).json({
      message: "Message received successfully! Karthik will get back to you soon.",
    });
  } catch (error) {
    console.error("Contact form processing error:", error);

    // Check for specific Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res
        .status(400)
        .json({ message: `Validation failed: ${messages.join(". ")}` });
    }

    // Generic server error
    return res.status(500).json({
      message: "An internal server error occurred. Please try again later.",
    });
  }
}
