// Converted to TypeScript - migrated
import { getCollection, runQuery, fieldFilter } from "@/lib/firebase";
import type { NextApiRequest, NextApiResponse } from "next";
import { IBlog } from "@/models/Blog";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // Get all published blogs
    const blogs = await runQuery(
      "blogs",
      [fieldFilter("isPublished", "EQUAL", true)]
    ) as unknown as IBlog[];

    // Extract unique categories
    const categorySet = new Set<string>();
    blogs.forEach((blog) => {
      if (blog.category && blog.category !== "" && blog.category !== "Uncategorized") {
        categorySet.add(blog.category);
      }
    });

    // Convert to sorted array
    const categories = Array.from(categorySet).sort();

    return res.status(200).json({ success: true, categories });
  } catch (error: unknown) {
    console.error("Error fetching blog categories:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
}

