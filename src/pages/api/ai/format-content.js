// src/pages/api/ai/format-content.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { callGemini } from "@/lib/gemini"; // Import the utility function

// Main handler function
export default async function handler(req, res) {
  // Check for authenticated session
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Basic admin check
  const isAdmin =
    session?.user?.role === "admin" ||
    session?.user?.isAdmin === true ||
    session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  if (!isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { content } = req.body;

    if (!content || typeof content !== "string" || !content.trim()) {
      return res.status(400).json({
        error: "Blog content is required and must be a non-empty string",
      });
    }

    // Step 1: Basic cleaning
    let cleanedContent = content
      .replace(/\r\n/g, "\n") // Normalize line breaks
      .replace(/\\{2,}/g, "\\") // Reduce multiple backslashes
      .replace(/ +\n/g, "\n") // Trim trailing spaces on lines
      .trim();

    // Define HTML examples as constants to avoid parsing issues
    const h2Example = "<h2>";
    const pExample = "<p>";
    const ulExample = "<ul><li>";
    const olExample = "<ol><li>";
    const strongExample = "<strong>";
    const emExample = "<em>";
    const codeExample = "<code>";
    const preCodeExample = "<pre><code>";
    const aExample = "<a>";
    const imgExample = "<img>";

    // Step 2: Call Gemini API for formatting refinement
    const formattingPrompt = `
      Act as an HTML formatting expert. Review the following potentially messy HTML text and improve its formatting for readability, structure, and consistency according to standard HTML best practices.

      **Formatting Rules to Apply:**
      - **Headings:** Ensure headings (e.g., ${h2Example}, <h3>) are used logically and consistently. Add appropriate heading tags if sections lack them. Ensure proper structure.
      - **Paragraphs:** Ensure text content is wrapped in ${pExample} tags. Break down overly long paragraphs into shorter ones. Ensure proper spacing between paragraphs.
      - **Lists:** Convert sequences of related items into unordered (${ulExample}) or ordered (${olExample}) lists where appropriate. Ensure correct list item structure with closing tags.
      - **Emphasis:** Apply ${strongExample} tags for strong emphasis and ${emExample} tags for emphasis, but use them sparingly and semantically.
      - **Code Blocks:** Ensure code snippets are enclosed in ${codeExample} tags for inline code or ${preCodeExample} blocks for multi-line code.
      - **Links & Images:** Ensure links (${aExample}) and images (${imgExample}) are correctly formatted with necessary attributes (href, src, alt).
      - **Whitespace:** Remove excessive whitespace within the HTML structure.
      - **Validity & Structure:** Ensure tags are properly nested and closed. Clean up potentially malformed or invalid HTML snippets.
      - **Consistency:** Maintain a consistent style throughout the document.

      **Input HTML:**
      ${cleanedContent}

      Please return only the reformatted HTML content without any markdown formatting or code block tags.
    `.trim();

    const generationConfig = {
      temperature: 0.2,
      maxOutputTokens: 8192,
    };

    const formattedContentRaw = await callGemini(
      formattingPrompt,
      generationConfig
    );

    if (!formattedContentRaw) {
      throw new Error("AI failed to return formatted content.");
    }

    // More robust cleanup using regex to remove potential ```html ... ``` fences
    const formattedContent = formattedContentRaw
      .replace(/^\s*```(?:html)?\s*\n?|\s*\n?```\s*$/g, "")
      .trim();

    return res.status(200).json({
      success: true,
      data: formattedContent,
    });
  } catch (error) {
    console.error("Error formatting content:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message,
    });
  }
}
