import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import dbConnect from "@/lib/dbConnect";
import { getCommentsByPostId, createComment } from "@/lib/commentService";
import {
  ApiResponse,
  handleApiError,
  validateBody,
  isValidObjectId,
} from "@/lib/apiUtils";

export default async function handler(req, res) {
  const { method } = req;

  // Validate allowed methods
  const allowedMethods = ["GET", "POST"];
  if (!allowedMethods.includes(method)) {
    return ApiResponse.methodNotAllowed(res, allowedMethods);
  }

  try {
    await dbConnect();
  } catch (error) {
    console.error("[Comments API] Database connection error:", error);
    return ApiResponse.serverError(res, "Database connection failed");
  }

  try {
    switch (method) {
      case "GET":
        const { blogPostId } = req.query;

        if (!blogPostId) {
          return ApiResponse.badRequest(res, "Blog post ID is required");
        }

        if (!isValidObjectId(blogPostId)) {
          return ApiResponse.badRequest(res, "Invalid blog post ID format");
        }

        const comments = await getCommentsByPostId(blogPostId);
        return ApiResponse.success(res, comments, "Comments retrieved successfully");

      case "POST":
        const session = await getServerSession(req, res, authOptions);

        // Validate request body
        const validation = validateBody(req.body, {
          blogPostId: {
            required: true,
            type: "string",
            validate: (v) => isValidObjectId(v) || "Invalid blog post ID",
          },
          text: {
            required: true,
            type: "string",
            minLength: 1,
            maxLength: 2000,
            sanitize: true,
            message: "Comment text is required (max 2000 characters)",
          },
          authorName: {
            required: false,
            type: "string",
            maxLength: 100,
            sanitize: true,
          },
        });

        if (!validation.isValid) {
          return ApiResponse.badRequest(res, "Validation failed", validation.errors);
        }

        const newComment = await createComment({
          blogPostId: validation.data.blogPostId,
          text: validation.data.text,
          sessionUser: session?.user,
          anonymousName: validation.data.authorName,
        });

        return ApiResponse.created(res, newComment, "Comment posted successfully");

      default:
        return ApiResponse.methodNotAllowed(res, allowedMethods);
    }
  } catch (error) {
    return handleApiError(res, error, "Comments API");
  }
}
