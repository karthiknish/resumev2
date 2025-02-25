import dbConnect from "../../../../lib/dbConnect";
import Blog from "../../../../models/Blog";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();

    // Get all published posts
    const posts = await Blog.find({ status: "published" })
      .select("category")
      .lean();

    // Count posts by category
    const categoryMap = {};

    posts.forEach((post) => {
      if (post.category) {
        const category = post.category.trim();
        if (category) {
          categoryMap[category] = (categoryMap[category] || 0) + 1;
        }
      }
    });

    // Convert to array format
    const categories = Object.keys(categoryMap)
      .map((name) => ({
        name,
        count: categoryMap[name],
      }))
      .sort((a, b) => {
        // Sort by count (descending) then by name (ascending)
        if (b.count !== a.count) {
          return b.count - a.count;
        }
        return a.name.localeCompare(b.name);
      });

    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error fetching categories",
    });
  }
}
