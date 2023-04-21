import dbConnect from "../../lib/dbConnect";
import Blog from "../../models/Blog";
import sendNewsletter from "../../lib/mailer";
import Subscriber from "../../models/Subscriber";
import cors from "./middlewares/cors";
function validateBlogData(data) {
  if (!data.title) {
    return { isValid: false, message: "Title is required" };
  }
  if (!data.content) {
    return { isValid: false, message: "Content is required" };
  }
  if (!data.imageUrl) {
    return { isValid: false, message: "Image is required" };
  }
  return { isValid: true, message: "" };
}

export default async function handler(req, res) {
  const { method } = req;
  await cors(req, res);
  await dbConnect();

  switch (method) {
    case "GET":
      try {
        if (req.query.id) {
          const blog = await Blog.findById(req.query.id);
          if (!blog) {
            return res
              .status(404)
              .json({ success: false, message: "Blog not found" });
          }
          return res.status(200).json({ success: true, data: blog });
        }
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        const total = await Blog.countDocuments();

        const blogs = await Blog.find().skip(startIndex).limit(limit);

        const totalPages = Math.ceil(total / limit);
        const pagination = { page, limit, totalPages, total };

        return res.status(200).json({ success: true, data: blogs, pagination });
      } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
      }
    case "POST":
      try {
        const validationResult = validateBlogData(req.body);
        if (!validationResult.isValid) {
          return res
            .status(400)
            .json({ success: false, message: validationResult.message });
        }

        const blog = await Blog.create(req.body);
        const subscribers = await Subscriber.find({});
        const emails = subscribers.map((subscriber) => subscriber.email);
        const subject = `New blog post: ${blog.title}`;
        const content = `
          Hello,
    
          We have just published a new blog post on our website: ${blog.title}.
    
          Read the full post here: https://karthiknish.com/blog/${blog.slug}
    
          Thank you for subscribing to our newsletter.
    
          Best regards,
          Karthik Nishanth
        `;

        await sendNewsletter(subject, content, emails);
        return res.status(201).json({ success: true, data: blog });
      } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
      }
    case "PUT":
      try {
        if (!req.body.id) {
          return res
            .status(400)
            .json({ success: false, message: "Missing blog ID" });
        }

        const validationResult = validateBlogData(req.body);
        if (!validationResult.isValid) {
          return res
            .status(400)
            .json({ success: false, message: validationResult.message });
        }
        const blog = await Blog.findByIdAndUpdate(req.body.id, req.body, {
          new: true,
        });
        console.log(blog);
        if (!blog) {
          return res
            .status(404)
            .json({ success: false, message: "Blog not found" });
        }
        return res.status(200).json({ success: true, data: blog });
      } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
      }
    case "DELETE":
      try {
        if (!req.body.id) {
          return res
            .status(400)
            .json({ success: false, message: "Missing blog ID" });
        }
        const blog = await Blog.findOneAndDelete({ _id: req.body.id });
        if (!blog) {
          return res
            .status(404)
            .json({ success: false, message: "Blog not found" });
        }
        return res.status(200).json({ success: true, data: blog });
      } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
      }
    default:
      return res
        .status(400)
        .json({ success: false, message: "Invalid request method" });
  }
}
