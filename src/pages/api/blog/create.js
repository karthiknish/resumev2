import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
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
  markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
  markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
  markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
  markdown = markdown.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n');
  markdown = markdown.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n');
  markdown = markdown.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n');
  
  // Handle paragraphs
  markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
  
  // Handle line breaks
  markdown = markdown.replace(/<br\s*\/?>/gi, '\n');
  
  // Handle emphasis
  markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
  markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
  markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
  markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');
  
  // Handle links
  markdown = markdown.replace(/<a[^>]*href="(.*?)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');
  
  // Handle unordered lists
  markdown = markdown.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, function(match, content) {
    return content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n');
  });
  
  // Handle ordered lists
  markdown = markdown.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, function(match, content) {
    let index = 1;
    return content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, function(match, item) {
      return `${index++}. ${item}\n`;
    });
  });
  
  // Handle code blocks
  markdown = markdown.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, '```\n$1\n```\n\n');
  
  // Handle inline code
  markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');
  
  // Handle blockquotes
  markdown = markdown.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, '> $1\n\n');
  
  // Remove remaining HTML tags
  markdown = markdown.replace(/<[^>]*>/g, '');
  
  // Decode HTML entities
  markdown = markdown.replace(/&nbsp;/g, ' ');
  markdown = markdown.replace(/&amp;/g, '&');
  markdown = markdown.replace(/&lt;/g, '<');
  markdown = markdown.replace(/&gt;/g, '>');
  markdown = markdown.replace(/&quot;/g, '"');
  markdown = markdown.replace(/&#39;/g, "'");
  
  // Fix multiple consecutive line breaks
  markdown = markdown.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  return markdown;
}

export default async function handler(req, res) {
  // Check for authenticated session
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();

    const { title, content, excerpt, imageUrl, tags, isPublished } = req.body;

    // Validate required fields
    if (!title || !content || !excerpt || !imageUrl) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate field types
    if (
      typeof title !== "string" ||
      typeof content !== "string" ||
      typeof excerpt !== "string" ||
      typeof imageUrl !== "string"
    ) {
      return res.status(400).json({ message: "Invalid field types" });
    }

    // Convert HTML content to markdown if needed
    let processedContent = content;
    if (isHTML(content)) {
      processedContent = htmlToMarkdown(content);
    }

    // Create slug from title
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, "-");

    // Check if slug already exists
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      return res
        .status(400)
        .json({ message: "A blog post with this title already exists" });
    }

    // Create new blog post
    const blog = await Blog.create({
      title: title.trim(),
      content: processedContent,
      description: excerpt.trim(),
      imageUrl: imageUrl.trim(),
      tags: Array.isArray(tags) ? tags : [],
      slug,
      author: session.user.id,
      isPublished: Boolean(isPublished),
      createdAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("Create blog error:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating blog post",
      error: error.message,
    });
  }
}
