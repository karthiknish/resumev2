import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import { ukSeoBlogPost } from "@/data/uk-seo-blog-post";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  // This should be a secure endpoint in production
  const { secret } = req.query;
  if (secret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    await dbConnect();

    // Check if a blog post with this title already exists
    const existingPost = await Blog.findOne({
      title: ukSeoBlogPost.title,
    });

    if (existingPost) {
      return res.status(400).json({
        success: false,
        message: "Blog post already exists",
      });
    }

    // Create the UK-focused blog post
    const post = await Blog.create({
      ...ukSeoBlogPost,
      author: req.query.authorId || "649c4e6ys81dc28n63829f2", // Replace with a valid author ID
      isPublished: true,
    });

    return res.status(201).json({
      success: true,
      message: "UK blog post created successfully",
      data: post,
    });
  } catch (error) {
    console.error("Error seeding UK blog post:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
