import dbConnect from "@/lib/dbConnect"; // Adjusted path assuming lib is at root src level
import Blog from "@/models/Blog"; // Adjusted path
import Byte from "@/models/Byte"; // Adjusted path

export default async function handler(req, res) {
  const { q } = req.query; // Search query parameter

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  if (!q || typeof q !== "string" || !q.trim()) {
    return res.status(400).json({
      success: false,
      message: "Search query 'q' is required.",
    });
  }

  try {
    await dbConnect();

    const searchQuery = { $text: { $search: q.trim() } };
    const projection = { score: { $meta: "textScore" } }; // Project the text search score

    // --- Search Blogs ---
    const blogResults = await Blog.find(
      { ...searchQuery, isPublished: true }, // Only search published blogs
      projection
    )
      .select("title slug createdAt description imageUrl") // Select fields needed for display
      .sort({ score: { $meta: "textScore" } }) // Sort by relevance
      .limit(10) // Limit results per type
      .lean(); // Use lean for performance

    // Add type identifier
    const typedBlogResults = blogResults.map((doc) => ({
      ...doc,
      type: "blog",
    }));

    // --- Search Bytes ---
    const byteResults = await Byte.find(searchQuery, projection)
      .select("headline body createdAt link imageUrl") // Select fields needed for display
      .sort({ score: { $meta: "textScore" } }) // Sort by relevance
      .limit(10) // Limit results per type
      .lean();

    // Add type identifier
    const typedByteResults = byteResults.map((doc) => ({
      ...doc,
      type: "byte",
    }));

    // --- Combine and Sort Results ---
    const combinedResults = [...typedBlogResults, ...typedByteResults];

    // Sort combined results by textScore (descending)
    combinedResults.sort((a, b) => b.score - a.score);

    // Optional: Limit total results
    const finalResults = combinedResults.slice(0, 15); // Limit total combined results

    return res.status(200).json({
      success: true,
      results: finalResults,
    });
  } catch (error) {
    console.error("API Search Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error performing search",
    });
  }
}
