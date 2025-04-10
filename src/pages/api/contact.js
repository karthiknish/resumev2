import nodemailer from "nodemailer";
import dbConnect from "@/lib/dbConnect";
import { createContactSubmission } from "@/lib/contactService"; // Import the service function

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ message: "Method Not Allowed. Please use POST." });
  }

  const { name, email, message } = req.body;

  // --- Input Validation ---
  if (!name || !email || !message) {
    // More specific message for missing fields
    const missingFields = [];
    if (!name) missingFields.push("Name");
    if (!email) missingFields.push("Email");
    if (!message) missingFields.push("Message");
    return res
      .status(400)
      .json({
        message: `Missing required fields: ${missingFields.join(", ")}.`,
      });
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format provided." });
  }

  // Optional: Add length checks if desired
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
  // --- End Validation ---

  try {
    // Connect to database
    await dbConnect();

    // Save contact message using the service function (includes validation)
    const newContact = await createContactSubmission({ name, email, message });

    // If saving to DB was successful, proceed to send email notification
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: process.env.EMAIL_SERVER_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: `New Contact Form Message from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
      html: `
        <h3>New Contact Form Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    return res
      .status(200)
      .json({
        message:
          "Message received successfully! Karthik will get back to you soon.",
      });
  } catch (error) {
    console.error("Contact form processing error:", error);

    // Check for specific Mongoose validation errors (if applicable from contactService)
    if (error.name === "ValidationError") {
      // Extract specific field errors if possible, otherwise return a general validation message
      const messages = Object.values(error.errors).map((e) => e.message);
      return res
        .status(400)
        .json({ message: `Validation failed: ${messages.join(". ")}` });
    }

    // Check if the error originated from Nodemailer
    if (error.code && error.command && error.responseCode) {
      // Heuristic for Nodemailer error
      console.error("Nodemailer specific error:", error.code, error.command);
      return res
        .status(500)
        .json({
          message:
            "Failed to send notification email. Please try again later or contact Karthik directly.",
        });
    }

    // Generic server error for other issues (DB connection, etc.)
    return res
      .status(500)
      .json({
        message: "An internal server error occurred. Please try again later.",
      });
  }
}
