// Converted to TypeScript - migrated
import { NextApiRequest, NextApiResponse } from "next";
import {
  getCollection,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
  runQuery,
  fieldFilter,
} from "@/lib/firebase";
import { sendEmail } from "@/lib/brevoClient";
import { IBlog } from "@/models/Blog";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const query = req.query as {
    slug?: string;
    id?: string;
    publishedOnly?: string;
    page?: string;
    limit?: string;
  };

  try {
    switch (method) {
      case "GET":
        // Handle fetching single blog by slug or ID
        if (query.slug) {
          const blog = await getDocument("blogs", query.slug) as unknown as IBlog | null;
          if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
          }
          return res.status(200).json({
            success: true,
            message: "Blog post retrieved successfully",
            data: blog,
          });
        }

        if (query.id) {
          const blog = await getDocument("blogs", query.id) as unknown as IBlog | null;
          if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
          }
          return res.status(200).json({
            success: true,
            message: "Blog post retrieved successfully",
            data: blog,
          });
        }

        // Handle paginated list with filters
        const publishedOnly = query.publishedOnly === "true";
        let blogs: IBlog[] = [];

        if (publishedOnly) {
          const results = await runQuery<IBlog>(
            "blogs",
            [fieldFilter("isPublished", "EQUAL", true)],
            [{ field: { fieldPath: "createdAt" }, direction: "DESCENDING" }]
          );
          blogs = results;
        } else {
          const result = await getCollection<IBlog>("blogs");
          blogs = result.documents || [];
          // Sort by createdAt descending
          blogs.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          });
        }

        // Handle pagination
        const page = parseInt(query.page || "1", 10);
        const limit = parseInt(query.limit || "10", 10);
        const startIndex = (page - 1) * limit;
        const paginatedBlogs = blogs.slice(startIndex, startIndex + limit);

        return res.status(200).json({
          success: true,
          message: "Blog posts retrieved successfully",
          data: paginatedBlogs,
          pagination: {
            page,
            limit,
            total: blogs.length,
            totalPages: Math.ceil(blogs.length / limit),
          },
        });

      case "POST":
        // Create new blog
        const { title, content, description, imageUrl, tags, isPublished, category } = req.body;

        if (!title || !content || !description) {
          return res.status(400).json({
            success: false,
            message: "Title, content, and description are required",
          });
        }

        // Generate slug from title
        const slug = title
          .toLowerCase()
          .trim()
          .replace(/[^a-zA-Z0-9\s]/g, "")
          .replace(/\s+/g, "-");

        // Check if slug already exists
        const existingBlog = await getDocument("blogs", slug);
        if (existingBlog) {
          return res.status(409).json({
            success: false,
            message: "A blog with this title already exists",
          });
        }

        const newBlog = await createDocument("blogs", slug, {
          title,
          content,
          description,
          imageUrl: imageUrl || "",
          tags: tags || [],
          slug,
          isPublished: isPublished || false,
          category: category || "Uncategorized",
          viewCount: 0,
          likes: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        // Send notification to subscribers if published
        if (isPublished) {
          try {
            const subscribersResult = await getCollection<{ email?: string }>("subscribers");
            const subscribers = subscribersResult.documents || [];
            
            for (const subscriber of subscribers) {
              try {
                if (!subscriber.email) continue;
                await sendEmail({
                  to: subscriber.email,
                  subject: `New Blog Post: ${title}`,
                  htmlContent: `
                    <p>Hi there!</p>
                    <p>A new blog post titled <strong>${title}</strong> has been published!</p>
                    <p><a href="https://karthiknish.com/blog/${slug}">Read it here</a></p>
                    <p>Best,<br>Karthik Nishanth</p>
                  `,
                });
              } catch (e: unknown) {
                console.error(`Failed to notify ${subscriber.email}:`, e);
              }
            }
          } catch (e: unknown) {
            console.error("Failed to send notifications:", e);
          }
        }

        return res.status(201).json({
          success: true,
          message: "Blog post created successfully",
          data: newBlog,
        });

      case "PUT":
        // Update blog
        const { id: updateId, ...updateFields } = req.body;
        if (!updateId) {
          return res.status(400).json({
            success: false,
            message: "Blog ID is required for update",
          });
        }

        const blogToUpdate = await getDocument("blogs", updateId) as unknown as IBlog | null;
        if (!blogToUpdate) {
          return res.status(404).json({
            success: false,
            message: "Blog not found for update",
          });
        }

        updateFields.updatedAt = new Date();
        const updatedBlog = await updateDocument("blogs", updateId, updateFields) as unknown as IBlog;

        return res.status(200).json({
          success: true,
          message: "Blog post updated successfully",
          data: updatedBlog,
        });

      case "DELETE":
        const deleteId = query.id;
        if (!deleteId) {
          return res.status(400).json({
            success: false,
            message: "Blog ID is required for deletion",
          });
        }

        const blogToDelete = await getDocument("blogs", deleteId) as unknown as IBlog | null;
        if (!blogToDelete) {
          return res.status(404).json({
            success: false,
            message: "Blog not found for deletion",
          });
        }

        await deleteDocument("blogs", deleteId);

        return res.status(200).json({
          success: true,
          message: "Blog post deleted successfully",
          data: blogToDelete,
        });

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res.status(405).json({
          success: false,
          message: `Method ${method} Not Allowed`,
        });
    }
  } catch (error: unknown) {
    console.error(`API Error [${method}] /api/blog:`, error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred",
      error: errorMessage,
    });
  }
}
