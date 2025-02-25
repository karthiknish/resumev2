import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/Blog";

// Helper function to detect if content is HTML
function isHTML(str) {
  return /<[a-z][\s\S]*>/i.test(str);
}

// Simple HTML to Markdown converter
function htmlToMarkdown(html) {
  // Replace common HTML elements with markdown equivalents
  let markdown = html;

  // Handle headings
  markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1\n\n");
  markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n\n");
  markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n\n");
  markdown = markdown.replace(/<h4[^>]*>(.*?)<\/h4>/gi, "#### $1\n\n");
  markdown = markdown.replace(/<h5[^>]*>(.*?)<\/h5>/gi, "##### $1\n\n");
  markdown = markdown.replace(/<h6[^>]*>(.*?)<\/h6>/gi, "###### $1\n\n");

  // Handle paragraphs
  markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n");

  // Handle line breaks
  markdown = markdown.replace(/<br\s*\/?>/gi, "\n");

  // Handle emphasis
  markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**");
  markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, "**$1**");
  markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*");
  markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, "*$1*");

  // Handle links
  markdown = markdown.replace(
    /<a[^>]*href="(.*?)"[^>]*>(.*?)<\/a>/gi,
    "[$2]($1)"
  );

  // Handle unordered lists
  markdown = markdown.replace(
    /<ul[^>]*>([\s\S]*?)<\/ul>/gi,
    function (match, content) {
      return content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "- $1\n");
    }
  );

  // Handle ordered lists
  markdown = markdown.replace(
    /<ol[^>]*>([\s\S]*?)<\/ol>/gi,
    function (match, content) {
      let index = 1;
      return content.replace(
        /<li[^>]*>([\s\S]*?)<\/li>/gi,
        function (match, item) {
          return `${index++}. ${item}\n`;
        }
      );
    }
  );

  // Handle code blocks
  markdown = markdown.replace(
    /<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi,
    "```\n$1\n```\n\n"
  );

  // Handle inline code
  markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, "`$1`");

  // Handle blockquotes
  markdown = markdown.replace(
    /<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi,
    "> $1\n\n"
  );

  // Remove remaining HTML tags
  markdown = markdown.replace(/<[^>]*>/g, "");

  // Decode HTML entities
  markdown = markdown.replace(/&nbsp;/g, " ");
  markdown = markdown.replace(/&amp;/g, "&");
  markdown = markdown.replace(/&lt;/g, "<");
  markdown = markdown.replace(/&gt;/g, ">");
  markdown = markdown.replace(/&quot;/g, '"');
  markdown = markdown.replace(/&#39;/g, "'");

  // Fix multiple consecutive line breaks
  markdown = markdown.replace(/\n\s*\n\s*\n/g, "\n\n");

  return markdown;
}

function validateBlogData(data) {
  if (!data.title || !data.content) {
    return { isValid: false, message: "Title and content are required" };
  }
  return { isValid: true };
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
  // Convert HTML content to markdown if needed
  if (blogData.content && isHTML(blogData.content)) {
    blogData.content = htmlToMarkdown(blogData.content);
  }

  const blog = await Blog.create(blogData);
  return blog;
}

async function updateBlog(id, updateData) {
  // Convert HTML content to markdown if needed
  if (updateData.content && isHTML(updateData.content)) {
    updateData.content = htmlToMarkdown(updateData.content);
  }

  if (updateData.title) {
    updateData.slug = updateData.title
      .toLowerCase()
      .trim()
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, "-");
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
