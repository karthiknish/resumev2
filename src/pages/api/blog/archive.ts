// Converted to TypeScript - migrated
import { runQuery, fieldFilter } from "@/lib/firebase";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Get all published posts
    const posts = await runQuery(
      "blogs",
      [fieldFilter("isPublished", "EQUAL", true)],
      [{ field: { fieldPath: "createdAt" }, direction: "DESCENDING" }]
    );

    // Organize posts by year and month
    const archiveData = {};

    posts.forEach((post) => {
      const date = new Date(post.createdAt);
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
        createdAt: post.createdAt,
      });
    });

    return res.status(200).json({
      success: true,
      archiveData,
    });
  } catch (error) {
    console.error("Error fetching archive data:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error fetching archive data",
    });
  }
}

