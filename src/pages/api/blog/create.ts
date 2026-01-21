import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import {
  getDocument,
  createDocument,
  getCollection,
} from "@/lib/firebase";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { title, content, excerpt, imageUrl, tags, isPublished, category, scheduledPublishAt } = req.body as {
      title: string;
      content: string;
      excerpt: string;
      imageUrl: string;
      tags?: string[];
      isPublished?: boolean;
      category?: string;
      scheduledPublishAt?: string;
    };

    if (!title || !content || !excerpt || !imageUrl) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, "-");

    const existingBlog = await getDocument("blogs", slug);
    if (existingBlog) {
      return res.status(400).json({ message: "A blog post with this title already exists" });
    }

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
      scheduledPublishAt: scheduledPublishAt ? new Date(scheduledPublishAt) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (isPublished) {
      try {
        const subscribersResult = await getCollection("subscribers");
        const subscribers = subscribersResult.documents || [];

        for (const subscriber of subscribers) {
          try {
            await fetch("https://api.brevo.com/v3/smtp/email", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "api-key": process.env.BREVO_API_KEY || "",
              },
              body: JSON.stringify({
                sender: { email: "hello@karthiknish.com", name: "Karthik Nishanth" },
                to: [{ email: subscriber.email }],
                subject: `New Blog Post: ${title}`,
                htmlContent: `
                  <p>Hi there!</p>
                  <p>A new blog post titled <strong>${title}</strong> has been published!</p>
                  <p><a href="https://karthiknish.com/blog/${slug}">Read it here</a></p>
                  <p>Best,<br>Karthik Nishanth</p>
                `,
              }),
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
      error: (error as Error).message,
    });
  }
}
