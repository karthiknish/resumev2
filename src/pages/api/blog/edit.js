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

    // Add 'category' to destructuring
    const { id, title, content, imageUrl, description, category } = req.body;

    // Improved validation for required fields
    const missingFields = [];
    if (!id) missingFields.push("Blog ID (id)");
    if (!title) missingFields.push("Title");
    if (!content) missingFields.push("Content");
    if (!imageUrl) missingFields.push("Image URL");
    if (!description) missingFields.push("Description"); // Assuming description is required for edit

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required field(s): ${missingFields.join(", ")}`,
        missing: missingFields, // Optionally return the list of missing fields
      });
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

    // --- Removed Audio Summary Generation ---

    // Prepare update data (excluding audioSummaryUrl)
    const updateData = {
      title,
      content, // Use the new content from req.body
      imageUrl,
      description,
      slug,
      category: category ? category.trim() : undefined,
      // audioSummaryUrl is no longer managed here
      updatedAt: new Date(),
    };

    // Update blog post in DB
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedBlog) {
      // Should not happen if findById worked, but good practice
      return res
        .status(404)
        .json({ message: "Blog post not found after update attempt" });
    }

    return res.status(200).json({
      success: true,
      data: updatedBlog, // Return the final updated blog data
    });
  } catch (error) {
    console.error("Edit blog error (outer catch):", error);
    return res.status(500).json({ message: "Error updating blog post" });
  }
}
