// Converted to TypeScript - migrated
import { NextApiRequest, NextApiResponse } from "next";
import { runQuery, fieldFilter } from "@/lib/firebase";
import { IBlog } from "@/models/Blog";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Get all published posts
    const posts = await runQuery<IBlog>(
      "blogs",
      [fieldFilter("isPublished", "EQUAL", true)],
      [{ field: { fieldPath: "createdAt" }, direction: "DESCENDING" }]
    );

    // Organize posts by year and month
    const archiveData: Record<number, Record<number, Array<{
      title: string;
      slug: string;
      description: string;
      imageUrl?: string;
      category: string;
      createdAt: string | Date;
    }>>> = {};

    (posts || []).forEach((post) => {
      const date = new Date(post.createdAt || new Date());
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      if (!archiveData[year]) {
        archiveData[year] = {};
      }

      if (!archiveData[year][month]) {
        archiveData[year][month] = [];
      }

      archiveData[year][month].push({
        title: post.title,
        slug: post.slug,
        description: post.description,
        imageUrl: post.imageUrl,
        category: post.category,
        createdAt: post.createdAt ?? date,
      });
    });

    return res.status(200).json({
      success: true,
      archiveData,
    });
  } catch (error) {
    console.error("Error fetching archive data:", error);
    const message = error instanceof Error ? error.message : "Error fetching archive data";
    return res.status(500).json({
      success: false,
      message,
    });
  }
}
