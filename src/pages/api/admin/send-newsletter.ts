import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { sendEmail } from "@/lib/brevoClient";
import { getCollection } from "@/lib/firebase";
import { NextApiRequest, NextApiResponse } from "next";
import logger from "@/utils/logger";

interface NewsletterParams {
  subject: string;
  content: string;
  previewText?: string;
}

// Generate newsletter email HTML
function generateNewsletterEmail({ subject, content, previewText }: NewsletterParams) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
  <div style="display: none; max-height: 0px; overflow: hidden;">
    ${previewText || subject}
  </div>
  
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          <tr>
            <td style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 32px 40px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">${subject}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <div style="font-size: 16px; color: #334155; line-height: 1.7;">
                ${content}
              </div>
              <hr style="margin: 32px 0; border: none; border-top: 1px solid #e2e8f0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://karthiknish.com/blog" style="display: inline-block; background-color: #1e293b; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">Read More on the Blog</a>
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
            <td style="padding: 24px 40px; border-top: 1px solid #e2e8f0; text-align: center; background-color: #f8fafc; border-radius: 0 0 12px 12px;">
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #94a3b8;">You're receiving this because you subscribed to karthiknish.com</p>
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                <a href="https://karthiknish.com/newsletter/preferences" style="color: #3b82f6; text-decoration: none;">Manage Preferences</a> · 
                <a href="https://karthiknish.com/api/unsubscribe" style="color: #3b82f6; text-decoration: none;">Unsubscribe</a>
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  // Check authentication
  const session = await getServerSession(req, res, authOptions);
  const isAdmin =
    (session?.user as { role?: string; isAdmin?: boolean })?.role === "admin" ||
    (session?.user as { role?: string; isAdmin?: boolean })?.isAdmin === true ||
    session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  if (!isAdmin) {
    // Localhost bypass for testing
    const isLocalhost = req.headers.host?.includes("localhost");
    if (!isLocalhost) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }
  }

  const { subject, content, previewText, testEmail } = req.body as {
    subject?: string;
    content?: string;
    previewText?: string;
    testEmail?: string;
  };

  if (!subject || !content) {
    return res.status(400).json({ 
      success: false, 
      message: "Subject and content are required" 
    });
  }

  try {
    const htmlContent = generateNewsletterEmail({ subject, content, previewText });

    // Test email mode
    if (typeof testEmail === "string" && testEmail) {
      logger.info("Newsletter", `Sending test email to ${testEmail}`, { subject });
      await sendEmail({
        to: testEmail,
        subject: `[TEST] ${subject}`,
        htmlContent,
      });

      return res.status(200).json({
        success: true,
        message: `Test email sent to ${testEmail}`,
        sentCount: 1,
        testMode: true,
      });
    }

    // Get all subscribers from Firebase
    logger.info("Newsletter", "Fetching subscribers...");
    const { documents } = await getCollection("subscribers");
    const subscribers = documents
      .map((doc) => (doc as { email?: unknown }).email)
      .filter((email): email is string => typeof email === "string" && email.length > 0);

    if (subscribers.length === 0) {
      logger.warn("Newsletter", "No subscribers found");
      return res.status(400).json({
        success: false,
        message: "No subscribers found",
      });
    }

    logger.info("Newsletter", `Sending newsletter to ${subscribers.length} subscribers`, { subject });

    // Send to all subscribers
    let successCount = 0;
    let failCount = 0;
    const errors: Array<{ email: string; error: string }> = [];

    for (const email of subscribers) {
      try {
        await sendEmail({
          to: email,
          subject,
          htmlContent,
        });
        successCount++;
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        logger.error("Newsletter", `Failed to send to ${email}`, { error: message });
        failCount++;
        errors.push({ email, error: message });
      }
    }

    logger.info("Newsletter", `Mass send complete`, { successCount, failCount });

    return res.status(200).json({
      success: true,
      message: `Newsletter sent to ${successCount} subscribers`,
      sentCount: successCount,
      failedCount: failCount,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    logger.error("Newsletter", "Critical API Error", { error: errorMsg });
    return res.status(500).json({
      success: false,
      message: "Failed to send newsletter",
      error: errorMsg,
    });
  }
}
