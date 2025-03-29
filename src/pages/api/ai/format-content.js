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
      return res
        .status(400)
        .json({
          error: "Blog content is required and must be a non-empty string",
        });
    }

    // Step 1: Basic cleaning (optional, but can help)
    let cleanedContent = content
      .replace(/\r\n/g, "\n") // Normalize line breaks
      .replace(/\\{2,}/g, "\\") // Reduce multiple backslashes
      .replace(/ +\n/g, "\n") // Trim trailing spaces on lines
      .trim();

    // Step 2: Call Gemini API for formatting refinement
    const formattingPrompt = `
      Act as a markdown formatting expert. Review the following markdown text and improve its formatting for readability, structure, and consistency according to standard markdown best practices.

      **Formatting Rules to Apply:**
      - **Headings:** Ensure headings (#, ##, ###) are used logically and consistently. Add headings if sections lack them. Ensure proper spacing before and after headings (one blank line). Correct malformed headings (e.g., #Heading without space).
      - **Paragraphs:** Break down long paragraphs (more than 5-6 sentences) into shorter, more readable ones. Ensure single blank lines separate paragraphs.
      - **Lists:** Convert sequences of related items into bulleted (-) or numbered (1.) lists where appropriate. Ensure correct list item indentation and spacing.
      - **Emphasis:** Apply **bold text** to key terms, concepts, or phrases for emphasis, but use it sparingly and strategically. Do not bold entire sentences or paragraphs. Use *italic text* for minor emphasis if needed.
      - **Code Blocks:** Ensure code snippets are enclosed in proper markdown code blocks (\`\`\`language\ncode\n\`\`\`) with language identifiers if possible.
      - **Links & Images:** Ensure markdown links `[text](url)` and images `![alt](url)` are correctly formatted.
      - **Whitespace:** Remove excessive blank lines (more than one consecutive blank line). Ensure consistent spacing around punctuation. Trim leading/trailing whitespace from lines.
      - **Consistency:** Maintain a consistent style throughout the document.

      **Input Markdown:**
      ---
      ${cleanedContent}
      ---

      **Output:** Return *only* the fully reformatted markdown text. Do not add any commentary, explanations, or preamble before or after the markdown content.
    `;

    // Use the utility function
    const generationConfig = {
      temperature: 0.2, // Low temperature for deterministic formatting
      maxOutputTokens: 8192, // Allow for potentially large content
    };
    const formattedMarkdown = await callGemini(
      formattingPrompt,
      generationConfig
    );

    return res.status(200).json({
      success: true,
      data: formattedMarkdown,
    });
  } catch (error) {
    console.error("Error formatting content:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
}
