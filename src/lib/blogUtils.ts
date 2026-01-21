export function isHTML(str: string): boolean {
  return /<[a-z][\s\S]*>/i.test(str);
}

export function htmlToMarkdown(html: string): string {
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
  markdown = markdown.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_match: string, content: string) =>
    content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "- $1\n")
  );
  markdown = markdown.replace(
    /<ol[^>]*>([\s\S]*?)<\/ol>/gi,
    (_match: string, content: string) => {
      let index = 1;
      return content.replace(
        /<li[^>]*>([\s\S]*?)<\/li>/gi,
        (_match2: string, item: string) => `${index++}. ${item}\n`
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
  markdown = markdown.replace(/<[^>]*>/g, "");
  markdown = markdown.replace(/&nbsp;/g, " ");
  markdown = markdown.replace(/&/g, "&");
  markdown = markdown.replace(/</g, "<");
  markdown = markdown.replace(/>/g, ">");
  markdown = markdown.replace(/"/g, '"');
  markdown = markdown.replace(/&#39;/g, "'");
  markdown = markdown.replace(/\n\s*\n\s*\n/g, "\n\n");
  return markdown.trim();
}

export interface BlogData {
  title?: string;
  content?: string;
  description?: string;
  imageUrl?: string;
}

interface ValidationResult {
  isValid: boolean;
  message?: string;
}

export function validateBlogData(data: BlogData): ValidationResult {
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
  return { isValid: true };
}

export function generateSlug(title: string): string {
  if (!title || typeof title !== "string") return "";
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .replace(/\s+/g, "-");
}
