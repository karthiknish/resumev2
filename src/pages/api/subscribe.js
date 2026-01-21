import { sendEmail } from "@/lib/brevoClient";

// Firebase REST API configuration
const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;

// In-memory rate limiter (resets on server restart)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS_PER_WINDOW = 5;

// Check if request should be rate limited
function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, firstRequest: now });
    return false;
  }

  if (now - record.firstRequest > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, firstRequest: now });
    return false;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  record.count++;
  return false;
}

// Spam pattern detection
function containsSpamPatterns(email) {
  const spamPatterns = [
    /test\d+@/i,
    /spam@/i,
  ];
  return spamPatterns.some((pattern) => pattern.test(email));
}

// Convert JS object to Firestore document format
function toFirestoreValue(value) {
  if (value === null || value === undefined) {
    return { nullValue: null };
  }
  if (typeof value === "boolean") {
    return { booleanValue: value };
  }
  if (typeof value === "number") {
    return { integerValue: String(value) };
  }
  if (typeof value === "string") {
    return { stringValue: value };
  }
  if (value instanceof Date) {
    return { timestampValue: value.toISOString() };
  }
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(toFirestoreValue) } };
  }
  if (typeof value === "object") {
    const fields = {};
    for (const [k, v] of Object.entries(value)) {
      fields[k] = toFirestoreValue(v);
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(value) };
}

// Check if subscriber exists in Firebase
async function subscriberExists(email) {
  const docId = encodeURIComponent(email.toLowerCase());
  const url = `${FIRESTORE_URL}/subscribers/${docId}?key=${FIREBASE_API_KEY}`;
  
  const response = await fetch(url);
  return response.ok;
}

// Create subscriber in Firebase
async function createSubscriber(email) {
  const docId = encodeURIComponent(email.toLowerCase());
  const url = `${FIRESTORE_URL}/subscribers?documentId=${docId}&key=${FIREBASE_API_KEY}`;
  
  const data = {
    email: email.toLowerCase(),
    subscribedAt: new Date(),
    preferences: {
      weeklyDigest: true,
      projectUpdates: true,
      careerTips: true,
      industryNews: true,
      productUpdates: true,
    },
  };
  
  const fields = {};
  for (const [key, value] of Object.entries(data)) {
    fields[key] = toFirestoreValue(value);
  }
  
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Failed to create subscriber");
  }
  
  return data;
}

// Generate welcome email HTML
function generateWelcomeEmail(email) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          <tr>
            <td style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 32px 40px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Welcome to the Newsletter!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #334155; line-height: 1.6;">Hi there!</p>
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #334155; line-height: 1.6;">Thank you for subscribing! You're now part of a community of developers and tech enthusiasts.</p>
              <p style="margin: 0 0 24px 0; font-size: 16px; color: #334155; line-height: 1.6;">You'll receive weekly insights, project updates, and exclusive content.</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://karthiknish.com/blog" style="display: inline-block; background-color: #1e293b; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">Explore My Blog</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 24px 0 0 0; font-size: 16px; color: #334155; line-height: 1.6;">
                Best regards,<br>
                <strong>Karthik Nishanth</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                <a href="https://karthiknish.com/newsletter/preferences" style="color: #3b82f6; text-decoration: none;">Manage Preferences</a> · 
                <a href="https://karthiknish.com/api/unsubscribe?email=${encodeURIComponent(email)}" style="color: #3b82f6; text-decoration: none;">Unsubscribe</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  // Get client IP for rate limiting
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "unknown";

  // Check rate limit
  if (checkRateLimit(ip)) {
    console.log(`Rate limit exceeded for IP: ${ip}`);
    return res.status(429).json({
      success: false,
      message: "Too many subscription requests. Please try again later.",
    });
  }

  const { email, _honeypot, _timestamp } = req.body;

  // Honeypot check
  if (_honeypot && _honeypot.trim() !== "") {
    console.log(`Honeypot triggered for email: ${email}`);
    return res.status(201).json({ success: true, message: "Subscription successful!" });
  }

  // Timing check
  if (_timestamp) {
    const submissionTime = Date.now() - _timestamp;
    if (submissionTime < 3000) {
      console.log(`Too fast submission for email: ${email} (${submissionTime}ms)`);
      return res.status(201).json({ success: true, message: "Subscription successful!" });
    }
  }

  // Basic validation
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email address provided." });
  }

  // Check for spam patterns
  if (containsSpamPatterns(email)) {
    console.log(`Spam pattern detected in email: ${email}`);
    return res.status(201).json({ success: true, message: "Subscription successful!" });
  }

  try {
    // Check if already subscribed
    const exists = await subscriberExists(email);
    if (exists) {
      return res
        .status(409)
        .json({ success: false, message: "This email is already subscribed." });
    }

    // Create subscriber in Firebase
    await createSubscriber(email);
    console.log(`New subscriber added to Firebase: ${email}`);

    // Send welcome email via Brevo (fire and forget for faster response)
    sendEmail({
      to: email.toLowerCase(),
      subject: "Welcome to Newsletter!",
      htmlContent: generateWelcomeEmail(email.toLowerCase()),
    })
      .then(() => console.log(`Welcome email sent to ${email}`))
      .catch((emailError) => console.error(`Failed to send welcome email to ${email}:`, emailError));

    return res
      .status(201)
      .json({ success: true, message: "Subscription successful!" });
  } catch (error) {
    console.error("Subscription API Error:", error);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred.",
    });
  }
}
