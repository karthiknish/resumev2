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

    const { title, content, imageUrl, description } = req.body;

    // Validate required fields
    if (!title || !content || !imageUrl || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, "-");

    // Create new blog post
    const blog = await Blog.create({
      title,
      content,
      imageUrl,
      description,
      slug,
      author: session.user.id,
      createdAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("Create blog error:", error);
    return res.status(500).json({ message: "Error creating blog post" });
  }
}
