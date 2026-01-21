// Converted to TypeScript - migrated
import { getCollection } from "@/lib/firebase";

export default async function handler(req, res) {
  const { q } = req.query;

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  if (!q || typeof q !== "string" || !q.trim()) {
    return res.status(400).json({
      success: false,
      message: "Search query 'q' is required.",
    });
  }

  try {
    const searchTerm = q.trim().toLowerCase();

    // Fetch blogs and bytes
    const [blogsResult, bytesResult] = await Promise.all([
      getCollection("blogs"),
      getCollection("bytes"),
    ]);

    const blogs = blogsResult.documents || [];
    const bytes = bytesResult.documents || [];

    // Filter published blogs by search term
    const blogResults = blogs
      .filter((blog) => {
        if (!blog.isPublished) return false;
        const searchable = `${blog.title || ""} ${blog.description || ""} ${blog.content || ""} ${(blog.tags || []).join(" ")}`.toLowerCase();
        return searchable.includes(searchTerm);
      })
      .map((blog) => ({
        ...blog,
        type: "blog",
        score: calculateScore(blog, searchTerm),
      }))
      .slice(0, 10);

    // Filter bytes by search term
    const byteResults = bytes
      .filter((byte) => {
        const searchable = `${byte.headline || ""} ${byte.body || ""}`.toLowerCase();
        return searchable.includes(searchTerm);
      })
      .map((byte) => ({
        ...byte,
        type: "byte",
        score: calculateScore(byte, searchTerm),
      }))
      .slice(0, 10);

    // Combine and sort by score
    const combinedResults = [...blogResults, ...byteResults]
      .sort((a, b) => b.score - a.score)
      .slice(0, 15);

    return res.status(200).json({
      success: true,
      results: combinedResults,
    });
  } catch (error) {
    console.error("API Search Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error performing search",
    });
  }
}

function calculateScore(doc, searchTerm) {
  let score = 0;
  const term = searchTerm.toLowerCase();
  
  // Title/headline match (highest weight)
  const title = (doc.title || doc.headline || "").toLowerCase();
  if (title.includes(term)) score += 10;
  if (title.startsWith(term)) score += 5;
  
  // Description/body match
  const desc = (doc.description || doc.body || "").toLowerCase();
  if (desc.includes(term)) score += 3;
  
  // Tags match
  const tags = (doc.tags || []).join(" ").toLowerCase();
  if (tags.includes(term)) score += 5;
  
  return score;
}

