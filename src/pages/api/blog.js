import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";
import { validateBlogData } from "@/lib/blogUtils"; // Import validator
import {
  getBlogBySlug,
  getBlogById,
  getPaginatedBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} from "@/lib/blogService"; // Import service functions
import Subscriber from "@/models/Subscriber"; // Import Subscriber model
import nodemailer from "nodemailer"; // Import nodemailer for sending emails
import '@/models/User'; // Import User model to ensure schema is registered

export default async function handler(req, res) {
  const { method } = req;
  await dbConnect(); // Ensure DB connection

  try {
    switch (method) {
      case "GET":
        // Handle fetching single blog by slug or ID, or paginated list
        if (req.query.slug) {
          console.log(
            `[/api/blog] Attempting to fetch blog with slug: ${req.query.slug}`
          ); // Log requested slug
          const blog = await getBlogBySlug(req.query.slug);
          console.log(
            `[/api/blog] Data returned by getBlogBySlug for slug '${req.query.slug}':`,
            JSON.stringify(blog, null, 2)
          ); // Log the result

          if (!blog)
            return res
              .status(404)
              .json({ success: false, message: "Blog not found" });
          return res.status(200).json({
            success: true,
            message: "Blog post retrieved successfully",
            data: blog,
          });
        }
        if (req.query.id) {
          if (!mongoose.Types.ObjectId.isValid(req.query.id)) {
            return res
              .status(400)
              .json({ success: false, message: "Invalid Blog ID format" });
          }
          const blog = await getBlogById(req.query.id);
          if (!blog)
            return res
              .status(404)
              .json({ success: false, message: "Blog not found" });
          return res.status(200).json({
            success: true,
            message: "Blog post retrieved successfully",
            data: blog,
          });
        }
        // Handle general fetching with potential filters from query
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const publishedOnly = req.query.publishedOnly === "true";
        let filter = publishedOnly ? { isPublished: true } : {};

        // Allow generic find query via 'find' parameter
        if (req.query.find) {
          try {
            filter = {
              ...filter,
              ...JSON.parse(decodeURIComponent(req.query.find)),
            };
          } catch (e) {
            return res.status(400).json({
              success: false,
              message:
                "Invalid 'find' query parameter format. Must be URL-encoded JSON.",
            });
          }
        }

        // Handle select parameter
        const select = req.query.select
          ? req.query.select.split(",").join(" ")
          : null;
        // Handle sort parameter (e.g., sort=-createdAt or sort=title)
        const sort = req.query.sort
          ? req.query.sort.split(",").join(" ")
          : "-createdAt";

        // Modified getPaginatedBlogs to accept select and sort
        const { blogs, pagination } = await getPaginatedBlogs(
          page,
          limit,
          filter,
          select,
          sort
        );

        return res.status(200).json({
          success: true,
          message: "Blog posts retrieved successfully",
          data: blogs,
          pagination,
        });

      case "POST":
        // Handle blog creation
        // Basic validation (can be enhanced in service/utils)
        if (!req.body.author) {
          // TODO: Replace with actual logged-in user ID from session
          req.body.author = new mongoose.Types.ObjectId(
            "60d5ec49a4d3f5a3c8a0b1f2"
          ); // Placeholder
          console.warn(
            "Blog POST request missing author, using default placeholder."
          );
        }
        const validationResultCreate = validateBlogData(req.body);
        if (!validationResultCreate.isValid) {
          return res
            .status(400)
            .json({ success: false, message: validationResultCreate.message });
        }

        const newBlog = await createBlog(req.body);

        // Send notification to subscribers if the blog is published
        if (newBlog.isPublished) {
          try {
            const subscribers = await Subscriber.find({}).lean();
            if (subscribers.length > 0) {
              const transporter = nodemailer.createTransport({
                host: process.env.EMAIL_SERVER_HOST,
                port: process.env.EMAIL_SERVER_PORT,
                secure: process.env.EMAIL_SERVER_PORT === "465",
                auth: {
                  user: process.env.EMAIL_SERVER_USER,
                  pass: process.env.EMAIL_SERVER_PASSWORD,
                },
              });

              const mailOptions = {
                from: process.env.EMAIL_FROM,
                subject: `New Blog Post: ${newBlog.title}`,
                text: `Hi there,\n\nA new blog post titled "${newBlog.title}" has been published! Check it out here: https://karthiknish.com/blog/${newBlog.slug}\n\nBest,\nKarthik Nishanth`,
                html: `
                  <p>Hi there,</p>
                  <p>A new blog post titled <strong>${newBlog.title}</strong> has been published!</p>
                  <p>Check it out <a href="https://karthiknish.com/blog/${newBlog.slug}" style="color: #3b82f6; text-decoration: underline;">here</a>.</p>
                  <p>Best,<br/>Karthik Nishanth</p>
                `,
              };

              // Send email to each subscriber
              for (const subscriber of subscribers) {
                try {
                  mailOptions.to = subscriber.email;
                  await transporter.sendMail(mailOptions);
                  console.log(`Notification email sent to ${subscriber.email}`);
                } catch (emailError) {
                  console.error(
                    `Failed to send email to ${subscriber.email}:`,
                    emailError
                  );
                }
              }
            } else {
              console.log("No subscribers found to notify about new blog.");
            }
          } catch (notificationError) {
            console.error(
              "Error sending newsletter notifications:",
              notificationError
            );
            // Don't fail the API response if notification fails
          }
        }

        return res.status(201).json({
          success: true,
          message: "Blog post created successfully",
          data: newBlog,
        });

      case "PUT":
        // Handle blog update
        const { id, ...updateFields } = req.body;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({
            success: false,
            message: "Valid Blog ID is required for update.",
          });
        }

        // Determine if it's a status-only update
        const isStatusUpdateOnly =
          Object.keys(updateFields).length === 1 &&
          updateFields.isPublished !== undefined;

        // Validate only if NOT a status-only update
        if (!isStatusUpdateOnly) {
          const validationResultUpdate = validateBlogData(updateFields);
          if (!validationResultUpdate.isValid) {
            return res.status(400).json({
              success: false,
              message: validationResultUpdate.message,
            });
          }
        }

        const updatedBlog = await updateBlog(id, updateFields);
        if (!updatedBlog)
          return res
            .status(404)
            .json({ success: false, message: "Blog not found for update" });
        return res.status(200).json({
          success: true,
          message: "Blog post updated successfully",
          data: updatedBlog,
        });

      case "DELETE":
        // Handle blog deletion
        const deleteId = req.query.id;
        if (!deleteId || !mongoose.Types.ObjectId.isValid(deleteId)) {
          return res.status(400).json({
            success: false,
            message:
              "Valid Blog ID is required in query parameter for deletion.",
          });
        }
        const deletedBlog = await deleteBlog(deleteId);
        if (!deletedBlog)
          return res
            .status(404)
            .json({ success: false, message: "Blog not found for deletion" });
        return res.status(200).json({
          success: true,
          message: "Blog post deleted successfully",
          data: deletedBlog,
        }); // Consider returning 204 No Content

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        return res
          .status(405)
          .json({ success: false, message: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error(`API Error [${method}] /api/blog:`, error);
    // Basic error handling, can be refined
    if (error.message.includes("not found")) {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.message.includes("already exists")) {
      return res.status(409).json({ success: false, message: error.message }); // Conflict
    }
    if (
      error.name === "ValidationError" ||
      error.message.includes("required")
    ) {
      return res.status(400).json({ success: false, message: error.message });
    }
    // Generic server error
    return res
      .status(500)
      .json({ success: false, message: "An internal server error occurred." });
  }
}
