import dbConnect from "../../lib/dbConnect";
import Blog from "../../models/Blog";
import sendNewsletter from "../../lib/mailer";
import Subscriber from "../../models/Subscriber";

function validateBlogData(data) {
  const requiredFields = ["title", "content", "imageUrl"];
  for (const field of requiredFields) {
    if (!data[field]) {
      return {
        isValid: false,
        message: `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required`,
      };
    }
  }
  return { isValid: true, message: "" };
}

async function getBlogBySlug(slug) {
  const blog = await Blog.findOne({ slug });
  if (!blog) {
    throw new Error("Blog not found");
  }
  return blog;
}

async function getBlogById(id) {
  const blog = await Blog.findById(id);
  if (!blog) {
    throw new Error("Blog not found");
  }
  return blog;
}

async function getPaginatedBlogs(page, limit) {
  const startIndex = (page - 1) * limit;
  const total = await Blog.countDocuments();
  const blogs = await Blog.find().skip(startIndex).limit(limit);
  const totalPages = Math.ceil(total / limit);
  return { blogs, pagination: { page, limit, totalPages, total } };
}

async function createBlog(blogData) {
  const blog = await Blog.create(blogData);
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
  return blog;
}

async function updateBlog(id, updateData) {
  if (updateData.title) {
    updateData.slug = updateData.title.split(" ").join("-");
  }
  const blog = await Blog.findOneAndUpdate({ _id: id }, updateData, {
    new: true,
    runValidators: true,
  });
  if (!blog) {
    throw new Error("Blog not found");
  }
  return blog;
}

async function deleteBlog(id) {
  const blog = await Blog.findOneAndDelete({ _id: id });
  if (!blog) {
    throw new Error("Blog not found");
  }
  return blog;
}

export default async function handler(req, res) {
  const { method } = req;
  await dbConnect();

  try {
    switch (method) {
      case "GET":
        if (req.query.slug) {
          const blog = await getBlogBySlug(req.query.slug);
          return res.status(200).json({ success: true, data: blog });
        }
        if (req.query.id) {
          const blog = await getBlogById(req.query.id);
          return res.status(200).json({ success: true, data: blog });
        }
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const { blogs, pagination } = await getPaginatedBlogs(page, limit);
        return res.status(200).json({ success: true, data: blogs, pagination });

      case "POST":
        const validationResult = validateBlogData(req.body);
        if (!validationResult.isValid) {
          return res
            .status(400)
            .json({ success: false, message: validationResult.message });
        }
        const newBlog = await createBlog(req.body);
        return res.status(201).json({ success: true, data: newBlog });

      case "PUT":
        if (!req.body.id) {
          return res
            .status(400)
            .json({ success: false, message: "Missing blog ID" });
        }
        const validationResultUpdate = validateBlogData(req.body);
        if (!validationResultUpdate.isValid) {
          return res
            .status(400)
            .json({ success: false, message: validationResultUpdate.message });
        }
        const updatedBlog = await updateBlog(req.body.id, req.body);
        return res.status(200).json({ success: true, data: updatedBlog });

      case "DELETE":
        if (!req.body.id) {
          return res
            .status(400)
            .json({ success: false, message: "Missing blog ID" });
        }
        const deletedBlog = await deleteBlog(req.body.id);
        return res.status(200).json({ success: true, data: deletedBlog });

      default:
        return res
          .status(400)
          .json({ success: false, message: "Invalid request method" });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
}
