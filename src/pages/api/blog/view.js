import { getDocument, updateDocument, runQuery, fieldFilter } from "@/lib/firebase";
import { ApiResponse } from "@/lib/apiUtils";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return ApiResponse.methodNotAllowed(res, ["POST"]);
  }

  try {
    const { blogId } = req.body;

    if (!blogId) {
      return ApiResponse.badRequest(res, "Blog ID is required");
    }

    // Try to get blog directly by ID (slug)
    let blog = await getDocument("blogs", blogId);
    
    // If not found, try to find by slug field (for legacy MongoDB ObjectId references)
    if (!blog) {
      const results = await runQuery("blogs", [fieldFilter("slug", "EQUAL", blogId)]);
      if (results.length > 0) {
        blog = results[0];
      }
    }

    if (!blog) {
      return ApiResponse.notFound(res, "Blog post not found");
    }

    // Increment view count
    const newViewCount = (blog.viewCount || 0) + 1;
    await updateDocument("blogs", blog._id, { viewCount: newViewCount });

    return ApiResponse.success(res, {
      viewCount: newViewCount,
    }, "View recorded");

  } catch (error) {
    console.error("[View API] Error:", error);
    return ApiResponse.serverError(res, "Failed to record view");
  }
}
