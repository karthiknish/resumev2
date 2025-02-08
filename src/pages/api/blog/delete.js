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

  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();

    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: "Blog ID is required" });
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
        .json({ message: "Not authorized to delete this post" });
    }

    await Blog.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    console.error("Delete blog error:", error);
    return res.status(500).json({ message: "Error deleting blog post" });
  }
}
