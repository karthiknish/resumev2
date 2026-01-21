import { NextApiRequest, NextApiResponse } from "next";
import { getDocument, updateDocument, runQuery, fieldFilter } from "@/lib/firebase";
import { ApiResponse } from "@/lib/apiUtils";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== "POST") {
    return ApiResponse.methodNotAllowed(res, ["POST"]);
  }

  try {
    const { blogId } = req.body;

    if (!blogId) {
      return ApiResponse.badRequest(res, "Blog ID is required");
    }

    let blog: any;
    try {
      blog = await getDocument("blogs", blogId);
    } catch (error) {
      const results = await runQuery("blogs", [fieldFilter("slug", "EQUAL", blogId)]);
      if (results.length > 0) {
        blog = results[0];
      }
    }

    if (!blog) {
      return ApiResponse.notFound(res, "Blog post not found");
    }

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
