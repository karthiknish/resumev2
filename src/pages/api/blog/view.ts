import { NextApiRequest, NextApiResponse } from "next";
import { getDocument, updateDocument, runQuery, fieldFilter } from "@/lib/firebase";
import { ApiResponse } from "@/lib/apiUtils";
import { IBlog } from "@/models/Blog";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== "POST") {
    return ApiResponse.methodNotAllowed(res, ["POST"]);
  }

  try {
    const { blogId } = req.body;

    if (!blogId) {
      return ApiResponse.badRequest(res, "Blog ID is required");
    }

    let blog: IBlog | null = null;
    try {
      blog = (await getDocument("blogs", blogId)) as unknown as IBlog;
    } catch (error) {
      const results = (await runQuery("blogs", [
        fieldFilter("slug", "EQUAL", blogId),
      ])) as unknown as IBlog[];
      if (results.length > 0) {
        blog = results[0];
      }
    }

    if (!blog) {
      return ApiResponse.notFound(res, "Blog post not found");
    }

    const newViewCount = (blog.viewCount || 0) + 1;
    await updateDocument("blogs", blog._id || (blog as any).id, { viewCount: newViewCount });

    return ApiResponse.success(res, {
      viewCount: newViewCount,
    }, "View recorded");
  } catch (error) {
    console.error("[View API] Error:", error);
    return ApiResponse.serverError(res, "Failed to record view");
  }
}
