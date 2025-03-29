// src/pages/api/blog/categories/index.js
import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/Blog";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await dbConnect();

    // Use distinct to get unique category values from published posts
    // Filter out null, undefined, or empty strings, and the default "Uncategorized" if desired
    const categories = await Blog.distinct("category", {
      isPublished: true, // Only consider published posts
      category: { $ne: null, $nin: ["", "Uncategorized"] }, // Exclude null, empty, and "Uncategorized"
    });

    // Sort categories alphabetically
    categories.sort();

    // Optionally add "All" or keep "Uncategorized" if needed for filtering logic
    // For now, just returning the distinct, non-default categories.

    return res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error("Error fetching blog categories:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
  }
}
