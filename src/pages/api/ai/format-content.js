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
      Act as an expert content editor who specializes in making technical blog posts more readable and engaging. Review the following HTML content and improve its formatting to enhance readability and flow.

      **Your Goal:** Transform the content to feel more human-written and engaging while maintaining technical accuracy.

      **Formatting Guidelines:**
      - **Headings:** Use ${h2Example} tags for main sections. Ensure headings are descriptive and create a logical flow. Add headings if content sections lack them.
      - **Paragraphs:** Wrap text in ${pExample} tags. Keep paragraphs concise (2-4 sentences). Break up dense blocks of text.
      - **Lists:** Convert related items into ${ulExample} or ${olExample} lists for better scannability. Ensure proper structure.
      - **Emphasis:** Use ${strongExample} for key terms and concepts. Use sparingly to maintain impact.
      - **Code:** Format code snippets with ${codeExample} for inline or ${preCodeExample} for blocks. Ensure readability.
      - **Links & Images:** Format ${aExample} and ${imgExample} with proper attributes. Keep alt text descriptive.
      - **Readability Enhancements:**
        * Add transition phrases between sections
        * Break up complex ideas into digestible parts
        * Use contractions for a conversational tone
        * Vary sentence structure for rhythm
      - **Structure:** Ensure proper nesting and closing of all HTML tags.

      **Input HTML:**
      ${cleanedContent}

      Return only the improved HTML content. Do not include explanations or markdown formatting.
    `.trim();

    const generationConfig = {
      temperature: 0.3, // Slightly higher for more natural improvements
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
