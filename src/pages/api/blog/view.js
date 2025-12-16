import { getDocument, updateDocument } from "@/lib/firebase";
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

    // Get current blog
    const blog = await getDocument("blogs", blogId);
    if (!blog) {
      return ApiResponse.notFound(res, "Blog post not found");
    }

    // Increment view count
    const newViewCount = (blog.viewCount || 0) + 1;
    await updateDocument("blogs", blogId, { viewCount: newViewCount });

    return ApiResponse.success(res, {
      viewCount: newViewCount,
    }, "View recorded");

  } catch (error) {
    console.error("[View API] Error:", error);
    return ApiResponse.serverError(res, "Failed to record view");
  }
}
