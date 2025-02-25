import dbConnect from "../../../../lib/dbConnect";
import Blog from "../../../../models/Blog";

export default async function handler(req, res) {
  const { category } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();

    // Find all published posts in the specified category
    const posts = await Blog.find({
      category: { $regex: new RegExp(category, "i") }, // Case insensitive search
      status: "published",
    })
      .sort({ createdAt: -1 }) // Sort by newest first
      .select("title slug excerpt content image category createdAt updatedAt")
      .lean();

    return res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error("Error fetching category posts:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error fetching category posts",
    });
  }
}
