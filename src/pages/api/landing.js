import nodemailer from "nodemailer";
import dbConnect from "@/lib/dbConnect";
import Landing from "@/models/Landing";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, budget, timeline, project } = req.body;

  if (!name || !email || !project) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Connect to database
    await dbConnect();

    // Save landing page inquiry to database
    await Landing.create({
      name,
      email,
      budget,
      timeline,
      project,
      createdAt: new Date(),
      status: "new",
    });

    // Send email notification
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: process.env.EMAIL_SERVER_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    // Email to site owner
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: `New Freelancer Inquiry from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Budget: ${budget || "Not specified"}
        Timeline: ${timeline || "Not specified"}
        Project: ${project}
      `,
      html: `
        <h3>New Freelancer Inquiry</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Budget:</strong> ${budget || "Not specified"}</p>
        <p><strong>Timeline:</strong> ${timeline || "Not specified"}</p>
        <p><strong>Project Details:</strong></p>
        <p>${project.replace(/\n/g, "<br>")}</p>
      `,
    });

    // Confirmation email to prospect
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Thank you for your inquiry, ${name}`,
      text: `
        Hi ${name},
        
        Thank you for reaching out about your project. I've received your inquiry and will review the details as soon as possible.
        
        I'll get back to you within 24 hours to discuss how we can work together.
        
        Project Summary:
        - Budget: ${budget || "Not specified"}
        - Timeline: ${timeline || "Not specified"}
        - Details: ${project}
        
        Looking forward to speaking with you soon!
        
        Best regards,
        Karthik Nishanth
        Full Stack Developer
      `,
      html: `
        <h3>Thank you for your inquiry, ${name}</h3>
        <p>I've received your project details and will review them as soon as possible.</p>
        <p>I'll get back to you within 24 hours to discuss how we can work together.</p>
        
        <h4>Your Project Summary:</h4>
        <ul>
          <li><strong>Budget:</strong> ${budget || "Not specified"}</li>
          <li><strong>Timeline:</strong> ${timeline || "Not specified"}</li>
          <li><strong>Details:</strong> ${project.replace(/\n/g, "<br>")}</li>
        </ul>
        
        <p>Looking forward to speaking with you soon!</p>
        
        <p>Best regards,<br>
        <strong>Karthik Nishanth</strong><br>
        Full Stack Developer</p>
      `,
    });

    return res.status(200).json({ message: "Inquiry sent successfully" });
  } catch (error) {
    console.error("Landing form error:", error);
    return res.status(500).json({ message: "Error sending inquiry" });
  }
}
