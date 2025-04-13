import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import Subscriber from "@/models/Subscriber"; // Import Subscriber model
import nodemailer from "nodemailer"; // Import nodemailer
import mongoose from "mongoose"; // Import mongoose for ID validation

export default async function handler(req, res) {
  // Check for authenticated session
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();

    const { id, ...updateFields } = req.body; // Separate ID from update data

    // Validate ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Valid Blog ID is required." });
    }

    // Find the existing blog post *before* updating
    const existingBlog = await Blog.findById(id).lean(); // Use lean for read-only
    if (!existingBlog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    // Verify ownership or admin status (using existingBlog data)
    let isOwner = false;
    if (existingBlog.author) {
      isOwner = existingBlog.author.toString() === session.user.id;
    }
    const isAdmin =
      session.user.role === "admin" ||
      session.user.isAdmin === true ||
      session.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this post" });
    }

    // --- Prepare Update Data (Handle slug generation if title changes) ---
    const updateData = { ...updateFields }; // Copy fields to update
    if (updateFields.title && updateFields.title !== existingBlog.title) {
      updateData.slug = updateFields.title
        .toLowerCase()
        .trim()
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .replace(/\s+/g, "-");
      // Optional: Check for slug conflicts before saving
      const conflictingBlog = await Blog.findOne({
        slug: updateData.slug,
        _id: { $ne: id },
      }).lean();
      if (conflictingBlog) {
        return res
          .status(409)
          .json({
            success: false,
            message: `Slug "${updateData.slug}" derived from title is already in use.`,
          });
      }
    }
    updateData.updatedAt = new Date(); // Manually set updatedAt

    // --- Update Blog Post in DB ---
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true } // Return the updated document, run validators
    );

    if (!updatedBlog) {
      // Should not happen if findById worked initially, but good practice
      return res
        .status(404)
        .json({ message: "Blog post not found after update attempt" });
    }

    // --- Send Notification Email if *just* published ---
    const wasPublished = existingBlog.isPublished;
    const isNowPublished = updatedBlog.isPublished;

    if (!wasPublished && isNowPublished) {
      console.log(
        `[Blog Edit] Post ${updatedBlog._id} changed status to published. Sending notifications...`
      );
      try {
        const subscribers = await Subscriber.find({}).select("email").lean();
        if (subscribers.length > 0) {
          const recipientEmails = subscribers.map((sub) => sub.email);

          const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SERVER_HOST,
            port: process.env.EMAIL_SERVER_PORT,
            secure: process.env.EMAIL_SERVER_PORT === "465",
            auth: {
              user: process.env.EMAIL_SERVER_USER,
              pass: process.env.EMAIL_SERVER_PASSWORD,
            },
          });

          const blogUrl = `${process.env.URL || "http://localhost:3000"}/blog/${
            updatedBlog.slug
          }`;

          const mailOptions = {
            from: process.env.EMAIL_FROM,
            bcc: recipientEmails,
            subject: `New Blog Post Published: ${updatedBlog.title}`,
            text: `Hi there,\n\nA blog post titled "${updatedBlog.title}" has just been published.\n\nRead it here: ${blogUrl}\n\nBest,\nKarthik Nishanth`,
            html: `
                <p>Hi there,</p>
                <p>A blog post titled "<strong>${updatedBlog.title}</strong>" has just been published.</p>
                <p><a href="${blogUrl}">Read it here</a></p>
                <br/>
                <p>Best,<br/>Karthik Nishanth</p>
                `,
          };

          await transporter.sendMail(mailOptions);
          console.log(
            `[Blog Edit] Sent notification email for published post "${updatedBlog.title}" to ${recipientEmails.length} subscribers.`
          );
        }
      } catch (emailError) {
        console.error(
          `[Blog Edit] Failed to send notification email for published post ${updatedBlog._id}:`,
          emailError
        );
        // Log error but don't fail the main API response
      }
    }
    // --- End Send Notification Email ---

    return res.status(200).json({
      success: true,
      data: updatedBlog, // Return the final updated blog data
    });
  } catch (error) {
    console.error("Edit blog error (outer catch):", error);
    if (error.message.includes("already in use")) {
      return res.status(409).json({ success: false, message: error.message });
    }
    return res
      .status(500)
      .json({ message: "Error updating blog post", error: error.message });
  }
}
