import dbConnect from "../../../lib/dbConnect";
import Blog from "../../../models/Blog";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();

    // Get all published posts
    const posts = await Blog.find({ status: "published" })
      .sort({ createdAt: -1 }) // Sort by newest first
      .select("title slug excerpt content image category createdAt")
      .lean();

    // Organize posts by year and month
    const archiveData = {};

    posts.forEach((post) => {
      const date = new Date(post.createdAt);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // JavaScript months are 0-indexed

      // Initialize year if it doesn't exist
      if (!archiveData[year]) {
        archiveData[year] = {};
      }

      // Initialize month if it doesn't exist
      if (!archiveData[year][month]) {
        archiveData[year][month] = [];
      }

      // Add post to the appropriate year and month
      archiveData[year][month].push(post);
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
