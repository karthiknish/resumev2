// Converted to TypeScript - migrated
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import {
  getDocument,
  updateDocument,
  getCollection,
} from "@/lib/firebase";
import { sendEmail } from "@/lib/brevoClient";
import { checkAdminStatus } from "@/lib/authUtils";
import { IBlog } from "@/models/Blog";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const isAdmin = checkAdminStatus(session);
  if (!isAdmin) {
    res.status(403).json({ message: "Forbidden: Admin privileges required" });
    return;
  }

  if (req.method !== "PUT") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  try {
    const { id, ...updateFields } = req.body as { id: string } & Partial<IBlog>;

    if (!id) {
      res.status(400).json({ success: false, message: "Blog ID is required." });
      return;
    }

    // Find existing blog
    const existingBlog = (await getDocument("blogs", id)) as unknown as IBlog;
    if (!existingBlog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    // Prepare update data
    const updateData: Partial<IBlog> & { updatedAt?: Date; slug?: string } = {
      ...updateFields,
    };

    // Handle slug generation if title changes
    if (updateFields.title && updateFields.title !== existingBlog.title) {
      updateData.slug = updateFields.title
        .toLowerCase()
        .trim()
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .replace(/\s+/g, "-");

      // Check for slug conflicts
      const conflictingBlog = (await getDocument(
        "blogs",
        updateData.slug
      )) as unknown as IBlog;
      if (conflictingBlog && conflictingBlog.id !== id) {
        return res.status(409).json({
          success: false,
          message: `Slug "${updateData.slug}" is already in use.`,
        });
      }
    }

    updateData.updatedAt = new Date();

    // Update blog post
    const updatedBlog = (await updateDocument(
      "blogs",
      id,
      updateData
    )) as unknown as IBlog;

    // Send notification if just published
    const wasPublished = existingBlog.isPublished;
    const isNowPublished = updateData.isPublished;

    if (!wasPublished && isNowPublished) {
      try {
        const subscribersResult = await getCollection<{ email?: string }>("subscribers");
        const subscribers = subscribersResult.documents || [];
        
        for (const subscriber of subscribers) {
          try {
            if (!subscriber.email) continue;
            await sendEmail({
              to: subscriber.email,
              subject: `New Blog Post Published: ${updatedBlog?.title || existingBlog.title}`,
              htmlContent: `
                <p>Hi there!</p>
                <p>A blog post titled <strong>${updatedBlog?.title || existingBlog.title}</strong> has just been published!</p>
                <p><a href="https://karthiknish.com/blog/${updatedBlog?.slug || existingBlog.slug}">Read it here</a></p>
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
  } catch (error: unknown) {
    console.error("Edit blog error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return res.status(500).json({
      message: "Error updating blog post",
      error: errorMessage,
    });
  }
}
