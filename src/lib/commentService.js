// src/lib/commentService.js
import mongoose from "mongoose";
import Comment from "@/models/Comment"; // Adjust path if needed
import Blog from "@/models/Blog"; // Adjust path if needed

/**
 * Fetches comments for a specific blog post, populating author details.
 * @param {string} blogPostId - The ID of the blog post.
 * @returns {Promise<Array>} - A promise that resolves to an array of comments.
 */
export async function getCommentsByPostId(blogPostId) {
  if (!blogPostId || !mongoose.Types.ObjectId.isValid(blogPostId)) {
    throw new Error("Valid Blog Post ID is required.");
  }

  // Fetch comments and populate author details (select specific fields)
  // Only populate if author exists (for non-anonymous comments)
  const comments = await Comment.find({ blogPost: blogPostId })
    .populate({
      path: "author",
      select: "name image _id", // Select only necessary fields from User
      match: { _id: { $ne: null } }, // Ensure author is not null before populating
    })
    .sort({ createdAt: 1 }) // Sort oldest first
    .lean(); // Use lean for performance

  return comments;
}

/**
 * Creates a new comment for a blog post.
 * @param {object} commentData - Data for the new comment.
 * @param {string} commentData.blogPostId - The ID of the blog post.
 * @param {string} commentData.text - The comment text.
 * @param {object} [sessionUser] - Optional session user object (if logged in).
 * @param {string} [anonymousName] - Optional name for anonymous users.
 * @returns {Promise<object>} - A promise that resolves to the created and populated comment.
 */
export async function createComment({
  blogPostId,
  text,
  sessionUser,
  anonymousName,
}) {
  // Validate input (basic checks, more can be added)
  if (!blogPostId || !mongoose.Types.ObjectId.isValid(blogPostId)) {
    throw new Error("Valid Blog Post ID is required.");
  }
  if (!text || typeof text !== "string" || !text.trim()) {
    throw new Error("Comment text cannot be empty.");
  }
  if (text.length > 2000) {
    throw new Error("Comment exceeds maximum length of 2000 characters.");
  }

  // Verify blog post exists
  const blogPost = await Blog.findById(blogPostId).lean(); // Use lean if just checking existence
  if (!blogPost) {
    throw new Error("Blog post not found.");
  }

  // Prepare comment data
  const dataToCreate = {
    blogPost: blogPostId,
    text: text.trim(),
    author: null,
    authorName: "Anonymous",
    authorImage: null,
  };

  // If user is logged in, use their details
  if (sessionUser) {
    dataToCreate.author = sessionUser.id;
    dataToCreate.authorName = sessionUser.name || "User";
    dataToCreate.authorImage = sessionUser.image || null;
  } else {
    // If anonymous, use the provided name if available and not empty
    if (
      anonymousName &&
      typeof anonymousName === "string" &&
      anonymousName.trim()
    ) {
      dataToCreate.authorName = anonymousName.trim().substring(0, 50); // Limit name length
    }
  }

  // Create the comment
  const newComment = await Comment.create(dataToCreate);

  // Populate author details for the response immediately if author exists
  // Need to fetch again to populate after creation
  const populatedComment = await Comment.findById(newComment._id)
    .populate({
      path: "author",
      select: "name image _id",
      match: { _id: { $ne: null } },
    })
    .lean();

  if (!populatedComment) {
    // Should not happen, but handle defensively
    throw new Error("Failed to retrieve created comment for population.");
  }

  return populatedComment;
}

// Potential future functions: updateComment, deleteComment
