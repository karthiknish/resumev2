import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/Blog";

export default async function handler(req, res) {
  // Check for authenticated session
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();

    const { title, content, excerpt, imageUrl, tags, isPublished } = req.body;

    // Validate required fields
    if (!title || !content || !excerpt || !imageUrl) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate field types
    if (
      typeof title !== "string" ||
      typeof content !== "string" ||
      typeof excerpt !== "string" ||
      typeof imageUrl !== "string"
    ) {
      return res.status(400).json({ message: "Invalid field types" });
    }

    // Create slug from title
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, "-");

    // Check if slug already exists
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      return res
        .status(400)
        .json({ message: "A blog post with this title already exists" });
    }

    // Create new blog post
    const blog = await Blog.create({
      title: title.trim(),
      content,
      description: excerpt.trim(),
      imageUrl: imageUrl.trim(),
      tags: Array.isArray(tags) ? tags : [],
      slug,
      author: session.user.id,
      isPublished: Boolean(isPublished),
      createdAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("Create blog error:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating blog post",
      error: error.message,
    });
  }
}
