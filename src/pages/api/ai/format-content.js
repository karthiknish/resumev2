import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import TurndownService from "turndown";

// Initialize TurnDown service with specific options
const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  emDelimiter: "*",
  bulletListMarker: "-",
  hr: "---",
});

// Simple function to format markdown content
function formatMarkdown(content) {
  // First, strip excessive backslashes
  let formatted = content.replace(/\\{2,}/g, "");

  // Remove any backslashes that aren't needed for escaping
  formatted = formatted.replace(/\\([^*#_`])/g, "$1");

  // Normalize line breaks (convert \r\n to \n)
  formatted = formatted.replace(/\r\n/g, "\n");

  // Ensure consistent line breaks by first normalizing multiple breaks
  formatted = formatted.replace(/\n{3,}/g, "\n\n");

  // Split into lines for processing
  const lines = formatted.split("\n");
  const result = [];
  let inCodeBlock = false;
  let inList = false;
  let previousLineType = null; // To track what kind of line we just processed

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    let currentLineType = "text"; // Default line type

    // Skip completely empty lines but maintain paragraph breaks
    if (!line) {
      // Only add an empty line if the previous line wasn't empty
      // and we're not at the beginning of the document
      if (result.length > 0 && result[result.length - 1] !== "") {
        result.push("");
      }
      previousLineType = "empty";
      continue;
    }

    // Handle code blocks
    if (line.startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      // Add an empty line before a code block if not already there
      if (
        inCodeBlock &&
        result.length > 0 &&
        result[result.length - 1] !== ""
      ) {
        result.push("");
      }
      result.push(line);
      // Add an empty line after closing a code block
      if (!inCodeBlock) {
        result.push("");
      }
      currentLineType = "codeblock";
      previousLineType = currentLineType;
      continue;
    }

    // Don't process content inside code blocks
    if (inCodeBlock) {
      result.push(line);
      currentLineType = "codeblock-content";
      previousLineType = currentLineType;
      continue;
    }

    // Process headings - ensure proper format
    if (line.match(/^#{1,6}\s/)) {
      const headingMatch = line.match(/^(#{1,6})\s*(.*)/);
      if (headingMatch) {
        // Add an empty line before heading if not at start and previous line isn't empty
        if (result.length > 0 && result[result.length - 1] !== "") {
          result.push("");
        }

        const [_, hashes, text] = headingMatch;
        result.push(`${hashes} ${text}`);

        // Always add empty line after heading
        result.push("");
        currentLineType = "heading";
      }
      previousLineType = currentLineType;
      continue;
    }

    // Fix malformed headings (no space after #)
    if (line.match(/^#{1,6}[^#\s]/)) {
      // Check if it's a hashtag or a heading
      if (line.match(/^#+[a-zA-Z0-9]+$/) && line.length < 20) {
        // It's a hashtag, not a heading
        result.push(line.replace(/^#/, "\\#"));
        currentLineType = "text";
      } else {
        // It's a malformed heading
        // Add an empty line before heading if not at start and previous line isn't empty
        if (result.length > 0 && result[result.length - 1] !== "") {
          result.push("");
        }

        const headingLevel = line.match(/^#+/)[0].length;
        const headingText = line.substring(headingLevel).trim();
        result.push(`${"#".repeat(headingLevel)} ${headingText}`);

        // Always add empty line after heading
        result.push("");
        currentLineType = "heading";
      }
      previousLineType = currentLineType;
      continue;
    }

    // Handle list items
    if (line.match(/^[-*+]\s/) || line.match(/^\d+\.\s/)) {
      // If this is the first list item and previous line isn't empty, add an empty line
      if (
        !inList &&
        previousLineType !== "empty" &&
        result.length > 0 &&
        result[result.length - 1] !== ""
      ) {
        result.push("");
      }

      result.push(line);
      inList = true;
      currentLineType = "list";
      previousLineType = currentLineType;
      continue;
    } else if (inList) {
      // End of list - add an empty line if not already there
      if (result[result.length - 1] !== "") {
        result.push("");
      }
      inList = false;
    }

    // Handle blockquotes
    if (line.startsWith(">")) {
      // If this is the first blockquote line and previous line isn't empty, add an empty line
      if (
        previousLineType !== "blockquote" &&
        previousLineType !== "empty" &&
        result.length > 0 &&
        result[result.length - 1] !== ""
      ) {
        result.push("");
      }

      result.push(line);
      currentLineType = "blockquote";
      previousLineType = currentLineType;
      continue;
    }

    // Handle horizontal rules
    if (line.match(/^(\*{3,}|-{3,}|_{3,})$/)) {
      // Add an empty line before horizontal rule if not already there
      if (result.length > 0 && result[result.length - 1] !== "") {
        result.push("");
      }

      result.push(line);

      // Add an empty line after horizontal rule
      result.push("");
      currentLineType = "hr";
      previousLineType = currentLineType;
      continue;
    }

    // Regular paragraph
    // If transitioning from a different block type, ensure there's a line break
    if (
      previousLineType !== "text" &&
      previousLineType !== "empty" &&
      result.length > 0 &&
      result[result.length - 1] !== ""
    ) {
      result.push("");
    }

    result.push(line);

    // Add empty line after paragraph if not at end and not in a list
    if (i < lines.length - 1 && !inList) {
      // Only add line break if next line isn't empty
      const nextLine = lines[i + 1].trim();
      if (
        nextLine &&
        !nextLine.match(/^[-*+]\s/) &&
        !nextLine.match(/^\d+\.\s/)
      ) {
        result.push("");
      }
    }

    currentLineType = "text";
    previousLineType = currentLineType;
  }

  // Join lines and return
  return result.join("\n").trim();
}

// Main handler function
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
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }

    // Step 1: Clean the content of excessive backslashes
    const cleanedContent = content
      .replace(/\\{2,}/g, "")
      .replace(/\\([^*#_`])/g, "$1");

    // Step 2: Convert HTML to Markdown if present
    const markdown = turndownService.turndown(cleanedContent);

    // Step 3: Format the markdown for better readability
    const formattedMarkdown = formatMarkdown(markdown);

    return res.status(200).json({
      success: true,
      data: formattedMarkdown,
    });
  } catch (error) {
    console.error("Error formatting content:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error formatting content",
    });
  }
}
