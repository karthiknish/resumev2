import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { checkAdminStatus } from "@/lib/authUtils";
import Blog from "@/models/Blog";
import dbConnect from "@/lib/dbConnect";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const isAdmin = checkAdminStatus(session);
  if (!isAdmin) {
    return res.status(403).json({ message: "Forbidden: Admin privileges required" });
  }

  const { blogId } = req.query;

  if (!blogId) {
    return res.status(400).json({ success: false, message: "Blog ID is required." });
  }

  try {
    await dbConnect();

    const blog = await Blog.findById(blogId).populate("versions.author", "name email image");

    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    if (req.method === "GET") {
      return res.status(200).json({
        success: true,
        data: {
          currentVersion: blog.currentVersion,
          versions: blog.versions || [],
        },
      });
    }

    if (req.method === "POST") {
      const { versionNumber, changeDescription } = req.body as { versionNumber: number; changeDescription?: string };

      if (!versionNumber) {
        return res.status(400).json({
          success: false,
          message: "Version number is required.",
        });
      }

      const versionToRestore = blog.versions?.find(
        (v: any) => v.versionNumber === versionNumber
      );

      if (!versionToRestore) {
        return res.status(404).json({
          success: false,
          message: "Version not found.",
        });
      }

      const currentSnapshot: any = {
        versionNumber: blog.currentVersion,
        title: blog.title,
        content: blog.content,
        description: blog.description,
        imageUrl: blog.imageUrl,
        tags: blog.tags,
        category: blog.category,
        author: blog.author,
        createdAt: blog.updatedAt,
        changeDescription: changeDescription || "Before restoring to version " + versionNumber,
      };

      blog.title = versionToRestore.title;
      blog.content = versionToRestore.content;
      blog.description = versionToRestore.description;
      blog.imageUrl = versionToRestore.imageUrl || "";
      blog.tags = versionToRestore.tags || [];
      blog.category = versionToRestore.category || "Uncategorized";
      blog.currentVersion = (blog.currentVersion || 1) + 1;

      blog.versions?.push(currentSnapshot);

      if (blog.versions && blog.versions.length > 20) {
        blog.versions = blog.versions.slice(-20);
      }

      await blog.save();

      return res.status(200).json({
        success: true,
        message: `Restored to version ${versionNumber}`,
        data: {
          currentVersion: blog.currentVersion,
          title: blog.title,
          content: blog.content,
          description: blog.description,
          imageUrl: blog.imageUrl,
          tags: blog.tags,
          category: blog.category,
        },
      });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Version history error:", error);
    return res.status(500).json({
      message: "Error managing version history",
      error: (error as Error).message,
    });
  }
}
