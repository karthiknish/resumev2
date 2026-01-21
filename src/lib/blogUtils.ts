// Converted to TypeScript - migrated
// src/lib/blogUtils.js

// Helper function to detect if content is HTML
export function isHTML(str) {
  // Basic check, might need refinement
  return /<[a-z][\s\S]*>/i.test(str);
}

// Simple HTML to Markdown converter
export function htmlToMarkdown(html) {
  if (!html) return "";
  let markdown = html;
  markdown = markdown.replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1\n\n");
  markdown = markdown.replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n\n");
  markdown = markdown.replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n\n");
  markdown = markdown.replace(/<h4[^>]*>(.*?)<\/h4>/gi, "#### $1\n\n");
  markdown = markdown.replace(/<h5[^>]*>(.*?)<\/h5>/gi, "##### $1\n\n");
  markdown = markdown.replace(/<h6[^>]*>(.*?)<\/h6>/gi, "###### $1\n\n");
  markdown = markdown.replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n");
  markdown = markdown.replace(/<br\s*\/?>/gi, "\n");
  markdown = markdown.replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**");
  markdown = markdown.replace(/<b[^>]*>(.*?)<\/b>/gi, "**$1**");
  markdown = markdown.replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*");
  markdown = markdown.replace(/<i[^>]*>(.*?)<\/i>/gi, "*$1*");
  markdown = markdown.replace(
    /<a[^>]*href="(.*?)"[^>]*>(.*?)<\/a>/gi,
    "[$2]($1)"
  );
  markdown = markdown.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (match, content) =>
    content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "- $1\n")
  );
  markdown = markdown.replace(
    /<ol[^>]*>([\s\S]*?)<\/ol>/gi,
    (match, content) => {
      let index = 1;
      return content.replace(
        /<li[^>]*>([\s\S]*?)<\/li>/gi,
        (match, item) => `${index++}. ${item}\n`
      );
    }
  );
  markdown = markdown.replace(
    /<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi,
    "```\n$1\n```\n\n"
  );
  markdown = markdown.replace(/<code[^>]*>(.*?)<\/code>/gi, "`$1`");
  markdown = markdown.replace(
    /<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi,
    "> $1\n\n"
  );
  markdown = markdown.replace(/<[^>]*>/g, ""); // Remove remaining tags AFTER specific conversions
  markdown = markdown.replace(/&nbsp;/g, " ");
  markdown = markdown.replace(/&/g, "&");
  markdown = markdown.replace(/</g, "<");
  markdown = markdown.replace(/>/g, ">");
  markdown = markdown.replace(/"/g, '"');
  markdown = markdown.replace(/&#39;/g, "'");
  markdown = markdown.replace(/\n\s*\n\s*\n/g, "\n\n"); // Collapse multiple blank lines
  return markdown.trim();
}

// Validator for blog data fields required for creation/update (excluding status-only updates)
export function validateBlogData(data) {
  if (
    data.hasOwnProperty("title") &&
    (!data.title || typeof data.title !== "string")
  ) {
    return {
      isValid: false,
      message: "Title is required and must be a string",
    };
  }
  if (
    data.hasOwnProperty("content") &&
    (!data.content || typeof data.content !== "string")
  ) {
    return {
      isValid: false,
      message: "Content is required and must be a string",
    };
  }
  if (
    data.hasOwnProperty("description") &&
    (!data.description || typeof data.description !== "string")
  ) {
    return {
      isValid: false,
      message: "Description is required and must be a string",
    };
  }
  if (
    data.hasOwnProperty("imageUrl") &&
    (!data.imageUrl || typeof data.imageUrl !== "string")
  ) {
    return {
      isValid: false,
      message: "Image URL is required and must be a string",
    };
  }
  // Add other field validations as needed
  return { isValid: true };
}

// Helper to generate slug from title
export function generateSlug(title) {
  if (!title || typeof title !== "string") return "";
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-zA-Z0-9\s]/g, "") // Remove non-alphanumeric characters (except spaces)
    .replace(/\s+/g, "-"); // Replace spaces with hyphens
}

