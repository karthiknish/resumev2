import dbConnect from "../../lib/dbConnect";
import Contact from "../../models/Contact";
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  const { method } = req;
  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const contacts = await Contact.find();
        return res.status(200).json({ success: true, data: contacts });
      } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
      }
    case "POST":
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
          secure: true,
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
          },
        });

        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: process.env.EMAIL_TO,
          subject: `New Contact Form Submission from ${name}`,
          html: `
            <p>You have a new contact form submission:</p>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong> ${message}</p>
          `,
        });

        return res.status(201).json({ success: true, data: newContact });
      } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
      }
    default:
      return res
        .status(400)
        .json({ success: false, message: "Invalid request method" });
  }
}
