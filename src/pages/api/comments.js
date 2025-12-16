import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import {
  getCollection,
  createDocument,
  runQuery,
  fieldFilter,
} from "@/lib/firebase";
import {
  ApiResponse,
  handleApiError,
  validateBody,
} from "@/lib/apiUtils";

export default async function handler(req, res) {
  const { method } = req;

  const allowedMethods = ["GET", "POST"];
  if (!allowedMethods.includes(method)) {
    return ApiResponse.methodNotAllowed(res, allowedMethods);
  }

  try {
    switch (method) {
      case "GET":
        const { blogPostId } = req.query;

        if (!blogPostId) {
          return ApiResponse.badRequest(res, "Blog post ID is required");
        }

        // Fetch comments for this blog post
        const comments = await runQuery(
          "comments",
          [fieldFilter("blogPostId", "EQUAL", blogPostId)],
          [{ field: { fieldPath: "createdAt" }, direction: "ASCENDING" }]
        );

        return ApiResponse.success(res, comments, "Comments retrieved successfully");

      case "POST":
        const session = await getServerSession(req, res, authOptions);

        const validation = validateBody(req.body, {
          blogPostId: {
            required: true,
            type: "string",
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

        const docId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newComment = await createDocument("comments", docId, {
          blogPostId: validation.data.blogPostId,
          text: validation.data.text,
          authorName: session?.user?.name || validation.data.authorName || "Anonymous",
          authorId: session?.user?.id || null,
          createdAt: new Date(),
        });

        return ApiResponse.created(res, newComment, "Comment posted successfully");

      default:
        return ApiResponse.methodNotAllowed(res, allowedMethods);
    }
  } catch (error) {
    return handleApiError(res, error, "Comments API");
  }
}
