import nodemailer from "nodemailer";

// General email sending function using SendGrid credentials
export const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST, // e.g., smtp.sendgrid.net
    port: parseInt(process.env.EMAIL_SERVER_PORT || "587", 10), // Use 587 for TLS
    secure: parseInt(process.env.EMAIL_SERVER_PORT || "587", 10) === 465, // true for 465, false for other ports (like 587)
    auth: {
      user: process.env.EMAIL_SERVER_USER, // Often 'apikey' for SendGrid
      pass: process.env.EMAIL_SERVER_PASSWORD, // The SendGrid API Key
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM, // Your verified sender email
    to: to, // Recipient email address
    subject: subject,
    html: html, // HTML content
    // text: text, // Optional: plain text version
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Failed to send email:", error);
    // Rethrow the error so the calling function knows it failed
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Keep sendNewsletter if still needed elsewhere, but ensure it uses correct env vars if so.
// If not needed, it can be removed.
const sendNewsletter = async (subject, htmlContent, recipients) => {
   console.warn(
     "sendNewsletter function in mailer.js might be using outdated Zoho config. Consider migrating to sendEmail."
   );
   // ... (existing Zoho implementation - potentially remove or update) ...
   const transporter = nodemailer.createTransport({
     host: "smtppro.zoho.eu", // This is Zoho
     port: 465,
     secure: true,
     auth: {
       user: process.env.NOREPLY_EMAIL, // Different env vars
       pass: process.env.NOREPLY_PASS,
     },
   });

    const mailOptions = {
      from: process.env.NOREPLY_EMAIL,
      to: recipients.join(","),
      subject: subject,
      html: htmlContent,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Newsletter sent successfully (via Zoho config)");
    } catch (error) {
    console.error("Failed to send newsletter (via Zoho config):", error);
    }
};

// Export the general function as default or named export as preferred
// export default sendEmail; // If you want it as default
// Or keep the newsletter one as default if it's primary
export default sendNewsletter;
