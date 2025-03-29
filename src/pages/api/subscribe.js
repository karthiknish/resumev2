import dbConnect from "@/lib/dbConnect"; // Adjust path if needed
import Subscriber from "@/models/Subscriber"; // Adjust path if needed
import nodemailer from "nodemailer"; // Import nodemailer

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  const { email } = req.body;

  // Basic validation
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email address provided." });
  }

  try {
    await dbConnect();

    // Check if email already exists (case-insensitive)
    const existingSubscriber = await Subscriber.findOne({
      email: email.toLowerCase(),
    });

    if (existingSubscriber) {
      return res
        .status(409)
        .json({ success: false, message: "This email is already subscribed." });
    }

    // Create new subscriber
    const newSubscriber = await Subscriber.create({
      email: email.toLowerCase(),
    }); // Save lowercase email

    // --- Send Welcome Email ---
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        secure: process.env.EMAIL_SERVER_PORT === "465", // Use true for port 465, false for others
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: newSubscriber.email, // Send to the newly subscribed email
        subject: "Welcome to the Newsletter!",
        text: `Hi there,\n\nThanks for subscribing to the newsletter! You'll receive updates on new articles and bytes.\n\nBest,\nKarthik Nishanth`,
        html: `
                <p>Hi there,</p>
                <p>Thanks for subscribing to the newsletter! You'll receive updates on new articles and bytes.</p>
                <p>Best,<br/>Karthik Nishanth</p>
            `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`Welcome email sent successfully to ${newSubscriber.email}`);
    } catch (emailError) {
      console.error(
        `Failed to send welcome email to ${newSubscriber.email}:`,
        emailError
      );
      // Don't fail the API request if email fails, just log it.
      // Optionally, you could add logic to retry sending later.
    }
    // --- End Send Welcome Email ---

    return res
      .status(201)
      .json({ success: true, message: "Subscription successful!" });
  } catch (error) {
    console.error("Subscription API Error:", error);
    // Handle potential database errors (like unique constraint violation if somehow missed)
    if (error.code === 11000) {
      return res
        .status(409)
        .json({ success: false, message: "This email is already subscribed." });
    }
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred.",
      error: error.message, // Avoid sending detailed errors in production
    });
  }
}
