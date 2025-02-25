import dbConnect from "../../../lib/dbConnect";
import Blog from "../../../models/Blog";

export default async function handler(req, res) {
  const { q } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  if (!q) {
    return res.status(400).json({
      success: false,
      message: "Search query is required",
    });
  }

  try {
    await dbConnect();

    // Create a regex pattern for case-insensitive search
    const searchRegex = new RegExp(q, "i");

    // Find all published posts matching the search query in title, content, or excerpt
    const posts = await Blog.find({
      $and: [
        { status: "published" },
        {
          $or: [
            { title: { $regex: searchRegex } },
            { content: { $regex: searchRegex } },
            { excerpt: { $regex: searchRegex } },
            { category: { $regex: searchRegex } },
            { tags: { $regex: searchRegex } },
          ],
        },
      ],
    })
      .sort({ createdAt: -1 }) // Sort by newest first
      .select("title slug excerpt content image category createdAt updatedAt")
      .lean();

    return res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error("Error searching posts:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error searching posts",
    });
  }
}
