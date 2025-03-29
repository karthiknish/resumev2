import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]"; // Adjust path if needed
import dbConnect from "@/lib/dbConnect"; // Adjust path if needed
import { getCommentsByPostId, createComment } from "@/lib/commentService"; // Import service functions
import mongoose from "mongoose";

export default async function handler(req, res) {
  const { method } = req;
  await dbConnect();

  switch (method) {
    case "GET":
      // Fetch comments for a specific blog post
      try {
        const { blogPostId } = req.query;
        // Validation is handled within the service function now
        const comments = await getCommentsByPostId(blogPostId);
        res.status(200).json({ success: true, data: comments });
      } catch (error) {
        console.error("GET Comments API Error:", error);
        // Handle specific errors thrown by the service
        if (error.message.includes("Valid Blog Post ID is required")) {
          return res
            .status(400)
            .json({ success: false, message: error.message });
        }
        res
          .status(500)
          .json({ success: false, message: "Failed to fetch comments." });
      }
      break;

    case "POST":
      // Create a new comment (Allow anonymous)
      try {
        const session = await getServerSession(req, res, authOptions); // Get session if available
        const { blogPostId, text, authorName: anonymousName } = req.body;

        // Call the service function to handle creation and validation
        const newComment = await createComment({
          blogPostId,
          text,
          sessionUser: session?.user, // Pass user object from session if exists
          anonymousName,
        });

        res.status(201).json({ success: true, data: newComment });
      } catch (error) {
        console.error("POST Comment API Error:", error);
        // Handle specific errors thrown by the service
        if (
          error.message.includes("required") ||
          error.message.includes("cannot be empty") ||
          error.message.includes("exceeds maximum length")
        ) {
          return res
            .status(400)
            .json({ success: false, message: error.message });
        }
        if (error.message.includes("not found")) {
          return res
            .status(404)
            .json({ success: false, message: error.message });
        }
        // Handle potential duplicate key error from unique email constraint if applicable later
        if (error.code === 11000) {
          return res
            .status(409)
            .json({ success: false, message: "Duplicate entry error." }); // More generic for comments
        }
        res
          .status(500)
          .json({ success: false, message: "Failed to post comment." });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
