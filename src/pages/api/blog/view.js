import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import { ApiResponse, isValidObjectId } from "@/lib/apiUtils";

export default async function handler(req, res) {
  const { method } = req;

  if (method !== "POST") {
    return ApiResponse.methodNotAllowed(res, ["POST"]);
  }

  try {
    await dbConnect();
  } catch (error) {
    console.error("[View API] Database connection error:", error);
    return ApiResponse.serverError(res, "Database connection failed");
  }

  try {
    const { blogId } = req.body;

    if (!blogId || !isValidObjectId(blogId)) {
      return ApiResponse.badRequest(res, "Valid blog ID is required");
    }

    // Increment view count
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { $inc: { viewCount: 1 } },
      { new: true, select: "viewCount" }
    );

    if (!blog) {
      return ApiResponse.notFound(res, "Blog post not found");
    }

    return ApiResponse.success(res, {
      viewCount: blog.viewCount,
    }, "View recorded");

  } catch (error) {
    console.error("[View API] Error:", error);
    return ApiResponse.serverError(res, "Failed to record view");
  }
}
