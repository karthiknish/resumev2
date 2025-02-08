import dbConnect from "../../lib/dbConnect";
import Contact from "../../models/Contact";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const contacts = await Contact.find();
      return res.status(200).json({ success: true, data: contacts });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch contacts: " + error.message,
      });
    }
  } else if (req.method === "POST") {
    try {
      const { name, email, message } = req.body;

      if (!name || !email || !message) {
        return res
          .status(400)
          .json({ success: false, message: "All fields are required." });
      }

      const newContact = new Contact({ name, email, message });
      await newContact.save();

      // Send email notification
      let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        secure: process.env.EMAIL_SERVER_PORT === "465", // Use TLS if port is 465, otherwise STARTTLS for 587
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      });

      try {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: process.env.EMAIL_TO,
          subject: `New Contact Form Submission from ${name}`,
          html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>New Contact Form Submission</title>
              <style>
                body {
                  font-family: 'Arial', sans-serif;
                  background-color: #f4f4f4;
                  color: #333;
                  line-height: 1.6;
                }
                .container {
                  width: 80%;
                  margin: 0 auto;
                  background-color: #fff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                h1 {
                  color: #444;
                }
                p {
                  margin-bottom: 10px;
                }
                .label {
                  font-weight: bold;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>New Contact Form Submission</h1>
                <p><span class="label">Name:</span> ${name}</p>
                <p><span class="label">Email:</span> ${email}</p>
                <p><span class="label">Message:</span> ${message}</p>
              </div>
            </body>
            </html>
          `,
        });
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        //  Return success even if email fails.  Consider logging the failure.
        return res.status(201).json({
          success: true,
          data: newContact,
          emailStatus: "failed",
          emailError: emailError.message,
        });
      }

      return res
        .status(201)
        .json({ success: true, data: newContact, emailStatus: "sent" });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Failed to save contact: " + error.message,
      });
    }
  } else {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }
}
