import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import mongoose from "mongoose";

// Define LinkedIn Post schema if it doesn't exist
let LinkedInPost;
try {
  LinkedInPost = mongoose.model("LinkedInPost");
} catch {
  const LinkedInPostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    scheduledFor: { type: Date, default: null },
    postedAt: { type: Date, default: null },
    posted: { type: Boolean, default: false },
    images: [{ type: String }],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userEmail: { type: String, required: true },
  });

  LinkedInPost = mongoose.model("LinkedInPost", LinkedInPostSchema);
}

export default async function handler(req, res) {
  // Check authentication
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Connect to database
  try {
    await dbConnect();
  } catch (error) {
    console.error("Database connection error:", error);
    return res.status(500).json({ error: "Failed to connect to database" });
  }

  // Find user ID
  const User = mongoose.model("User");
  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Handle different HTTP methods
  switch (req.method) {
    case "GET":
      return getPosts(req, res, user);
    case "POST":
      return createPost(req, res, user);
    case "PUT":
      return updatePost(req, res, user);
    case "DELETE":
      return deletePost(req, res, user);
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}

// Get all LinkedIn posts for the user
async function getPosts(req, res, user) {
  try {
    const posts = await LinkedInPost.find({ userId: user._id }).sort({
      createdAt: -1,
    });
    return res.status(200).json({ posts });
  } catch (error) {
    console.error("Error fetching LinkedIn posts:", error);
    return res.status(500).json({ error: "Failed to fetch LinkedIn posts" });
  }
}

// Create a new LinkedIn post
async function createPost(req, res, user) {
  try {
    const { title, content, scheduledFor, images = [] } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const newPost = new LinkedInPost({
      title,
      content,
      scheduledFor: scheduledFor || null,
      images,
      userId: user._id,
      userEmail: user.email,
    });

    await newPost.save();
    return res.status(201).json({ post: newPost });
  } catch (error) {
    console.error("Error creating LinkedIn post:", error);
    return res.status(500).json({ error: "Failed to create LinkedIn post" });
  }
}

// Update an existing LinkedIn post
async function updatePost(req, res, user) {
  try {
    const { id, title, content, scheduledFor, posted, postedAt, images } =
      req.body;

    if (!id) {
      return res.status(400).json({ error: "Post ID is required" });
    }

    // Find post and verify ownership
    const post = await LinkedInPost.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.userId.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this post" });
    }

    // Update post fields
    const updateData = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (scheduledFor !== undefined) updateData.scheduledFor = scheduledFor;
    if (posted !== undefined) updateData.posted = posted;
    if (postedAt !== undefined) updateData.postedAt = postedAt;
    if (images) updateData.images = images;

    const updatedPost = await LinkedInPost.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return res.status(200).json({ post: updatedPost });
  } catch (error) {
    console.error("Error updating LinkedIn post:", error);
    return res.status(500).json({ error: "Failed to update LinkedIn post" });
  }
}

// Delete a LinkedIn post
async function deletePost(req, res, user) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "Post ID is required" });
    }

    // Find post and verify ownership
    const post = await LinkedInPost.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.userId.toString() !== user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this post" });
    }

    await LinkedInPost.findByIdAndDelete(id);
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting LinkedIn post:", error);
    return res.status(500).json({ error: "Failed to delete LinkedIn post" });
  }
}
