import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import {
  getDocument,
  createDocument,
  getCollection,
} from "@/lib/firebase";
import { sendEmail } from "@/lib/brevoClient";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { title, content, excerpt, imageUrl, tags, isPublished, category } = req.body;

    if (!title || !content || !excerpt || !imageUrl) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create slug from title
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, "-");

    // Check if slug already exists
    const existingBlog = await getDocument("blogs", slug);
    if (existingBlog) {
      return res.status(400).json({ message: "A blog post with this title already exists" });
    }

    // Create new blog post in Firebase
    const blog = await createDocument("blogs", slug, {
      title: title.trim(),
      content,
      description: excerpt.trim(),
      imageUrl: imageUrl.trim(),
      tags: Array.isArray(tags) ? tags : [],
      slug,
      authorId: session.user.id,
      isPublished: Boolean(isPublished),
      category: category ? category.trim() : "Uncategorized",
      viewCount: 0,
      likes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Send notification to subscribers if published
    if (isPublished) {
      try {
        const subscribersResult = await getCollection("subscribers");
        const subscribers = subscribersResult.documents || [];
        
        for (const subscriber of subscribers) {
          try {
            await sendEmail({
              to: subscriber.email,
              subject: `New Blog Post: ${title}`,
              htmlContent: `
                <p>Hi there!</p>
                <p>A new blog post titled <strong>${title}</strong> has been published!</p>
                <p><a href="https://karthiknish.com/blog/${slug}">Read it here</a></p>
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

    return res.status(201).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("Create blog error:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating blog post",
      error: error.message,
    });
  }
}
