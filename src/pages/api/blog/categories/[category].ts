// Converted to TypeScript - migrated
import { NextApiRequest, NextApiResponse } from "next";
import { runQuery, fieldFilter } from "@/lib/firebase";
import { IBlog } from "@/models/Blog";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { category } = req.query as { category: string };

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Get all published posts
    const allPosts = await runQuery<IBlog>(
      "blogs",
      [fieldFilter("isPublished", "EQUAL", true)],
      [{ field: { fieldPath: "createdAt" }, direction: "DESCENDING" }]
    );

    // Filter by category (case insensitive)
    const posts = allPosts.filter((post) => {
      if (typeof post.category !== "string") return false;
      return post.category.toLowerCase() === category.toLowerCase();
    });

    return res.status(200).json({
      success: true,
      posts: posts.map((post) => ({
        title: post.title,
        slug: post.slug,
        description: post.description,
        imageUrl: post.imageUrl,
        category: post.category,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      })),
    });
  } catch (error: unknown) {
    console.error("Error fetching category posts:", error);
    const errorMessage = error instanceof Error ? error.message : "Error fetching category posts";
    return res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
}
