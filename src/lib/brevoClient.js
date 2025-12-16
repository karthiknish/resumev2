/**
 * Brevo Email Client
 * Provides transactional email sending using Brevo API
 */

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

/**
 * Send a transactional email using Brevo API
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.toName - Recipient name (optional)
 * @param {string} options.subject - Email subject
 * @param {string} options.htmlContent - HTML content of the email
 * @param {string} options.textContent - Plain text content (optional)
 * @param {string} options.replyTo - Reply-to email address (optional)
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
export async function sendEmail({
  to,
  toName = "",
  subject,
  htmlContent,
  textContent = "",
  replyTo = null,
}) {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    console.error("BREVO_API_KEY is not configured");
    throw new Error("Email service is not configured");
  }

  const payload = {
    sender: {
      name: "Karthik Nishanth",
      email: "noreply@karthiknish.com",
    },
    to: [
      {
        email: to,
        name: toName,
      },
    ],
    subject,
    htmlContent,
  };

  // Add optional fields
  if (textContent) {
    payload.textContent = textContent;
  }

  if (replyTo) {
    payload.replyTo = {
      email: replyTo,
    };
  }

  try {
    const response = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Brevo API error:", data);
      throw new Error(data.message || "Failed to send email");
    }

    console.log("Email sent successfully via Brevo:", data.messageId);
    return { success: true, messageId: data.messageId };
  } catch (error) {
    console.error("Failed to send email via Brevo:", error);
    throw error;
  }
}

/**
 * Generate a professional HTML email template for contact form notifications
 */
export function generateContactNotificationEmail({ name, email, message }) {
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
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 32px 40px; border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">New Contact Form Message</h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <!-- Sender Info Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <p style="margin: 0 0 8px 0; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">From</p>
                    <p style="margin: 0 0 4px 0; font-size: 18px; font-weight: 600; color: #1e293b;">${name}</p>
                    <p style="margin: 0; font-size: 14px; color: #475569;">
                      <a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a>
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- Message -->
              <div style="margin-bottom: 24px;">
                <p style="margin: 0 0 12px 0; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">Message</p>
                <div style="background-color: #fafafa; border-left: 4px solid #3b82f6; padding: 16px 20px; border-radius: 0 8px 8px 0;">
                  <p style="margin: 0; font-size: 15px; color: #334155; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                </div>
              </div>
              
              <!-- Reply Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <a href="mailto:${email}?subject=Re: Contact Form Inquiry" style="display: inline-block; background-color: #1e293b; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">Reply to ${name}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">This message was sent from your website contact form at karthiknish.com</p>
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

/**
 * Generate a thank you email for the person who submitted the contact form
 */
export function generateThankYouEmail({ name }) {
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
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 32px 40px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Thank You for Reaching Out!</h1>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #334155; line-height: 1.6;">Hi ${name},</p>
              
              <p style="margin: 0 0 16px 0; font-size: 16px; color: #334155; line-height: 1.6;">Thank you for getting in touch! I've received your message and will get back to you as soon as possible, typically within 24-48 hours.</p>
              
              <p style="margin: 0 0 24px 0; font-size: 16px; color: #334155; line-height: 1.6;">In the meantime, feel free to explore my work or connect with me on social media.</p>
              
              <!-- CTA Buttons -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td>
                    <a href="https://karthiknish.com/blog" style="display: inline-block; background-color: #1e293b; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; margin-right: 12px;">Read My Blog</a>
                    <a href="https://karthiknish.com" style="display: inline-block; background-color: #f1f5f9; color: #1e293b; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">View Portfolio</a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0; font-size: 16px; color: #334155; line-height: 1.6;">Looking forward to connecting with you!</p>
              
              <p style="margin: 24px 0 0 0; font-size: 16px; color: #334155; line-height: 1.6;">
                Best regards,<br>
                <strong>Karthik Nishanth</strong><br>
                <span style="color: #64748b; font-size: 14px;">Cross Platform Developer</span>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #94a3b8;">You received this email because you submitted the contact form at karthiknish.com</p>
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                <a href="https://karthiknish.com" style="color: #3b82f6; text-decoration: none;">karthiknish.com</a>
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

export default { sendEmail, generateContactNotificationEmail, generateThankYouEmail };
