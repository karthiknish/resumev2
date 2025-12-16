import { runQuery, fieldFilter } from "@/lib/firebase";

export default async function handler(req, res) {
  const { category } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Get all published posts
    const allPosts = await runQuery(
      "blogs",
      [fieldFilter("isPublished", "EQUAL", true)],
      [{ field: { fieldPath: "createdAt" }, direction: "DESCENDING" }]
    );

    // Filter by category (case insensitive)
    const posts = allPosts.filter(post => {
      if (!post.category) return false;
      return post.category.toLowerCase() === category.toLowerCase();
    });

    return res.status(200).json({
      success: true,
      posts: posts.map(post => ({
        title: post.title,
        slug: post.slug,
        description: post.description,
        imageUrl: post.imageUrl,
        category: post.category,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching category posts:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error fetching category posts",
    });
  }
}
