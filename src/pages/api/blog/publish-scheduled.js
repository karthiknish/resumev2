import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { getCollection, updateDocument } from "@/lib/firebase";
import { sendEmail } from "@/lib/brevoClient";
import { checkAdminStatus } from "@/lib/authUtils";

/**
 * API endpoint to publish scheduled blog posts
 * This should be called by a cron job or scheduled task service
 *
 * GET /api/blog/publish-scheduled?secret=YOUR_CRON_SECRET
 *
 * The secret parameter is required to prevent unauthorized access
 */
export default async function handler(req, res) {
  // Verify cron secret for security
  const cronSecret = req.query.secret || req.headers["x-cron-secret"];
  if (cronSecret !== process.env.CRON_SECRET) {
    // Also allow admin users to trigger manually
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
    // Fetch all unpublished blogs that have a scheduled publish date
    // Note: Firebase REST API doesn't support complex queries well,
    // so we'll fetch all and filter, or use a structured query
    const result = await getCollection("blogs");

    const now = new Date();
    const scheduledPosts = result.documents.filter(
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

    const publishedPosts = [];
    const errors = [];

    // Publish each scheduled post
    for (const post of scheduledPosts) {
      try {
        const updatedPost = await updateDocument("blogs", post.id || post._id, {
          isPublished: true,
          scheduledPublishAt: null, // Clear the scheduled date
          publishedAt: now, // Track when it was actually published
        });

        publishedPosts.push({
          id: post.id || post._id,
          title: post.title,
          slug: post.slug,
        });

        // Send notifications to subscribers
        try {
          const subscribersResult = await getCollection("subscribers");
          const subscribers = subscribersResult.documents || [];

          for (const subscriber of subscribers) {
            try {
              await sendEmail({
                to: subscriber.email,
                subject: `New Blog Post: ${post.title}`,
                htmlContent: `
                  <p>Hi there!</p>
                  <p>A new blog post titled <strong>${post.title}</strong> has been published!</p>
                  <p><a href="https://karthiknish.com/blog/${post.slug}">Read it here</a></p>
                  <p>Best,<br>Karthik Nishanth</p>
                `,
              });
            } catch (e) {
              console.error(`Failed to notify ${subscriber.email}:`, e);
            }
          }
        } catch (e) {
          console.error(`Failed to send notifications for ${post.title}:`, e);
        }
      } catch (error) {
        console.error(`Failed to publish scheduled post ${post.id || post._id}:`, error);
        errors.push({
          id: post.id || post._id,
          title: post.title,
          error: error.message,
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
      error: error.message,
    });
  }
}
