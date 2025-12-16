import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import {
  getDocument,
  updateDocument,
  getCollection,
} from "@/lib/firebase";
import { sendEmail } from "@/lib/brevoClient";
import { checkAdminStatus } from "@/lib/authUtils";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const isAdmin = checkAdminStatus(session);
  if (!isAdmin) {
    return res.status(403).json({ message: "Forbidden: Admin privileges required" });
  }

  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { id, ...updateFields } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "Blog ID is required." });
    }

    // Find existing blog
    const existingBlog = await getDocument("blogs", id);
    if (!existingBlog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    // Prepare update data
    const updateData = { ...updateFields };
    
    // Handle slug generation if title changes
    if (updateFields.title && updateFields.title !== existingBlog.title) {
      updateData.slug = updateFields.title
        .toLowerCase()
        .trim()
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .replace(/\s+/g, "-");
      
      // Check for slug conflicts
      const conflictingBlog = await getDocument("blogs", updateData.slug);
      if (conflictingBlog && conflictingBlog._id !== id) {
        return res.status(409).json({
          success: false,
          message: `Slug "${updateData.slug}" is already in use.`,
        });
      }
    }
    
    updateData.updatedAt = new Date();

    // Update blog post
    const updatedBlog = await updateDocument("blogs", id, updateData);

    // Send notification if just published
    const wasPublished = existingBlog.isPublished;
    const isNowPublished = updateData.isPublished;

    if (!wasPublished && isNowPublished) {
      try {
        const subscribersResult = await getCollection("subscribers");
        const subscribers = subscribersResult.documents || [];
        
        for (const subscriber of subscribers) {
          try {
            await sendEmail({
              to: subscriber.email,
              subject: `New Blog Post Published: ${updatedBlog.title || existingBlog.title}`,
              htmlContent: `
                <p>Hi there!</p>
                <p>A blog post titled <strong>${updatedBlog.title || existingBlog.title}</strong> has just been published!</p>
                <p><a href="https://karthiknish.com/blog/${updatedBlog.slug || existingBlog.slug}">Read it here</a></p>
                <p>Best,<br>Karthik Nishanth</p>
              `,
            });
          } catch (e) {
            console.error(`Failed to notify ${subscriber.email}:`, e);
          }
        }
      } catch (e) {
        console.error("Failed to send notifications:", e);
      }
    }

    return res.status(200).json({
      success: true,
      data: updatedBlog,
    });
  } catch (error) {
    console.error("Edit blog error:", error);
    return res.status(500).json({
      message: "Error updating blog post",
      error: error.message,
    });
  }
}
