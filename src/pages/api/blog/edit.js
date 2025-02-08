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

  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();

    const { id, title, content, imageUrl, description } = req.body;

    // Validate required fields
    if (!id || !title || !content || !imageUrl || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find blog post and verify ownership
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    // Verify ownership or admin status
    if (blog.author.toString() !== session.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this post" });
    }

    // Update slug if title changed
    const slug = title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, "-");

    // Update blog post
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        title,
        content,
        imageUrl,
        description,
        slug,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      data: updatedBlog,
    });
  } catch (error) {
    console.error("Edit blog error:", error);
    return res.status(500).json({ message: "Error updating blog post" });
  }
}
