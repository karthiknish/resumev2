import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { getCollection, updateDocument } from "@/lib/firebase";
import { checkAdminStatus } from "@/lib/authUtils";
import { IBlog } from "@/models/Blog";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const cronSecret = req.query.secret || req.headers["x-cron-secret"];
  if (cronSecret !== process.env.CRON_SECRET) {
    const session = await getServerSession(req, res, authOptions);
    if (!session || !checkAdminStatus(session)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Invalid cron secret or admin privileges required",
      });
    }
  }

  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const result = await getCollection("blogs");

    const now = new Date();
    const scheduledPosts = (result.documents as unknown as IBlog[]).filter(
      (blog) =>
        !blog.isPublished &&
        blog.scheduledPublishAt &&
        new Date(blog.scheduledPublishAt) <= now
    );

    if (scheduledPosts.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No scheduled posts to publish",
        published: [],
      });
    }

    const publishedPosts: Array<{ id: string; title: string; slug: string }> = [];
    const errors: Array<{ id: string; title: string; error: string }> = [];

    for (const post of scheduledPosts) {
      try {
        const blogId = (post.id || post._id) as string;
        await updateDocument("blogs", blogId, {
          isPublished: true,
          scheduledPublishAt: null,
          publishedAt: now,
        } as Partial<IBlog>);

        publishedPosts.push({
          id: blogId,
          title: post.title,
          slug: post.slug,
        });

        try {
          const subscribersResult = await getCollection("subscribers");
          const subscribers = (subscribersResult.documents || []) as unknown as Array<{ email: string }>;

          for (const subscriber of subscribers) {
            try {
              if (!subscriber.email) continue;
              await fetch("https://api.brevo.com/v3/smtp/email", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "api-key": process.env.BREVO_API_KEY || "",
                },
                body: JSON.stringify({
                  sender: { email: "hello@karthiknish.com", name: "Karthik Nishanth" },
                  to: [{ email: subscriber.email }],
                  subject: `New Blog Post: ${post.title}`,
                  htmlContent: `
                    <p>Hi there!</p>
                    <p>A new blog post titled <strong>${post.title}</strong> has been published!</p>
                    <p><a href="https://karthiknish.com/blog/${post.slug}">Read it here</a></p>
                    <p>Best,<br>Karthik Nishanth</p>
                  `,
                }),
              });
            } catch (e) {
              console.error(`Failed to notify ${subscriber.email}:`, e);
            }
          }
        } catch (e) {
          console.error(`Failed to send notifications for ${post.title}:`, e);
        }
      } catch (error: unknown) {
        const blogId = (post.id || post._id) as string;
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error(`Failed to publish scheduled post ${blogId}:`, error);
        errors.push({
          id: blogId,
          title: post.title,
          error: errorMessage,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: `Published ${publishedPosts.length} scheduled post(s)`,
      published: publishedPosts,
      errors: errors,
    });
  } catch (error) {
    console.error("Publish scheduled posts error:", error);
    return res.status(500).json({
      success: false,
      message: "Error publishing scheduled posts",
      error: (error as Error).message,
    });
  }
}
