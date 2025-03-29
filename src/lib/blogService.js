// src/lib/blogService.js
import mongoose from "mongoose";
import Blog from "@/models/Blog"; // Adjust path if needed
import { isHTML, htmlToMarkdown, generateSlug } from "./blogUtils"; // Import helpers

// --- Read Operations ---

export async function getBlogBySlug(slug) {
  if (!slug) throw new Error("Slug is required to fetch blog post.");
  // Populate author details when fetching single post
  const blog = await Blog.findOne({ slug })
    .populate({
      path: "author",
      select: "name image", // Select fields you need from the author
    })
    .lean(); // Use lean for performance if not modifying
  if (!blog) {
    // Consider returning null instead of throwing for API handler
    return null;
    // throw new Error("Blog not found");
  }
  return blog;
}

export async function getBlogById(id) {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Valid Blog ID is required.");
  }
  // Populate author details when fetching single post
  const blog = await Blog.findById(id)
    .populate({
      path: "author",
      select: "name image",
    })
    .lean();
  if (!blog) {
    // Consider returning null instead of throwing for API handler
    return null;
    // throw new Error("Blog not found");
  }
  return blog;
}

export async function getPaginatedBlogs(page = 1, limit = 10, filter = {}) {
  const startIndex = (page - 1) * limit;
  const total = await Blog.countDocuments(filter);

  // Define the fields to select for the list view
  const selection =
    "title slug imageUrl createdAt isPublished description category tags";

  const blogs = await Blog.find(filter)
    .select(selection)
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit)
    .lean(); // Use lean for better performance on read-only operations

  const totalPages = Math.ceil(total / limit);
  return { blogs, pagination: { page, limit, totalPages, total } };
}

// --- Write Operations ---

export async function createBlog(blogData) {
  // Basic validation (can be enhanced)
  if (
    !blogData.title ||
    !blogData.content ||
    !blogData.description ||
    !blogData.imageUrl ||
    !blogData.author // Ensure author is provided
  ) {
    throw new Error(
      "Missing required fields for blog creation (title, content, description, imageUrl, author)."
    );
  }

  // Process content and slug
  if (blogData.content && isHTML(blogData.content)) {
    blogData.content = htmlToMarkdown(blogData.content);
  }
  blogData.slug = generateSlug(blogData.title);

  // Check for duplicate slug before creating
  const existing = await Blog.findOne({ slug: blogData.slug }).lean();
  if (existing) {
    throw new Error(`Blog post with slug "${blogData.slug}" already exists.`);
  }

  const blog = await Blog.create(blogData);
  return blog;
}

export async function updateBlog(id, updateData) {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Valid Blog ID is required for update.");
  }

  // Process content and slug if they are being updated
  if (updateData.content && isHTML(updateData.content)) {
    updateData.content = htmlToMarkdown(updateData.content);
  }
  if (updateData.title) {
    updateData.slug = generateSlug(updateData.title);
    // Optional: Check if the new slug conflicts with another post (excluding itself)
    const existing = await Blog.findOne({
      slug: updateData.slug,
      _id: { $ne: id },
    }).lean();
    if (existing) {
      throw new Error(
        `Another blog post with the slug "${updateData.slug}" already exists.`
      );
    }
  }

  // Determine if this is just a status update based *only* on fields in updateData
  const keys = Object.keys(updateData);
  const isStatusUpdateOnly = keys.length === 1 && keys[0] === "isPublished";

  const options = {
    new: true, // Return the modified document
    runValidators: !isStatusUpdateOnly, // Skip validators ONLY if just isPublished is present
  };

  const blog = await Blog.findOneAndUpdate({ _id: id }, updateData, options);
  if (!blog) {
    throw new Error("Blog not found during update");
  }
  return blog;
}

export async function deleteBlog(id) {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Valid Blog ID is required for deletion.");
  }
  const blog = await Blog.findOneAndDelete({ _id: id });
  if (!blog) {
    throw new Error("Blog not found for deletion");
  }
  // Optionally: Add logic here to delete associated comments or other related data
  return blog; // Return the deleted document
}
