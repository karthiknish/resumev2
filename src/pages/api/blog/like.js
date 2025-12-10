import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { ApiResponse, isValidObjectId } from "@/lib/apiUtils";

export default async function handler(req, res) {
  const { method } = req;

  if (method !== "POST") {
    return ApiResponse.methodNotAllowed(res, ["POST"]);
  }

  try {
    await dbConnect();
  } catch (error) {
    console.error("[Like API] Database connection error:", error);
    return ApiResponse.serverError(res, "Database connection failed");
  }

  try {
    const { blogId } = req.body;

    if (!blogId || !isValidObjectId(blogId)) {
      return ApiResponse.badRequest(res, "Valid blog ID is required");
    }

    // Get session or generate anonymous ID
    const session = await getServerSession(req, res, authOptions);
    const identifierId = session?.user?.id || 
      req.cookies.likeSessionId || 
      `anon_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    // Find the blog post
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return ApiResponse.notFound(res, "Blog post not found");
    }

    // Toggle like
    const likeIndex = blog.likes.indexOf(identifierId);
    let action;

    if (likeIndex > -1) {
      // Unlike - remove from array
      blog.likes.splice(likeIndex, 1);
      action = "unliked";
    } else {
      // Like - add to array
      blog.likes.push(identifierId);
      action = "liked";
    }

    await blog.save();

    // Set cookie for anonymous users
    if (!session?.user) {
      res.setHeader(
        "Set-Cookie",
        `likeSessionId=${identifierId}; Path=/; Max-Age=${60 * 60 * 24 * 365}; HttpOnly; SameSite=Strict`
      );
    }

    return ApiResponse.success(res, {
      likeCount: blog.likes.length,
      isLiked: action === "liked",
      action,
    }, `Post ${action} successfully`);

  } catch (error) {
    console.error("[Like API] Error:", error);
    return ApiResponse.serverError(res, "Failed to process like");
  }
}
