import { getDocument, updateDocument } from "@/lib/firebase";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
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

    // Get session or generate anonymous ID
    const session = await getServerSession(req, res, authOptions);
    const identifierId = session?.user?.id || 
      req.cookies.likeSessionId || 
      `anon_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    // Find the blog post
    const blog = await getDocument("blogs", blogId);
    if (!blog) {
      return ApiResponse.notFound(res, "Blog post not found");
    }

    // Initialize likes array if doesn't exist
    const likes = blog.likes || [];
    const likeIndex = likes.indexOf(identifierId);
    let action;

    if (likeIndex > -1) {
      // Unlike - remove from array
      likes.splice(likeIndex, 1);
      action = "unliked";
    } else {
      // Like - add to array
      likes.push(identifierId);
      action = "liked";
    }

    // Update the blog
    await updateDocument("blogs", blogId, { likes });

    // Set cookie for anonymous users
    if (!session?.user) {
      res.setHeader(
        "Set-Cookie",
        `likeSessionId=${identifierId}; Path=/; Max-Age=${60 * 60 * 24 * 365}; HttpOnly; SameSite=Strict`
      );
    }

    return ApiResponse.success(res, {
      likeCount: likes.length,
      isLiked: action === "liked",
      action,
    }, `Post ${action} successfully`);

  } catch (error) {
    console.error("[Like API] Error:", error);
    return ApiResponse.serverError(res, "Failed to process like");
  }
}
