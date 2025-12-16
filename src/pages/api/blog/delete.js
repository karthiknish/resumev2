import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { getDocument, deleteDocument } from "@/lib/firebase";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: "Blog ID is required" });
    }

    // Find blog post
    const blog = await getDocument("blogs", id);
    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    // Delete the blog
    await deleteDocument("blogs", id);

    return res.status(200).json({
      success: true,
      message: "Blog post deleted successfully",
    });
  } catch (error) {
    console.error("Delete blog error:", error);
    return res.status(500).json({ message: "Error deleting blog post" });
  }
}
