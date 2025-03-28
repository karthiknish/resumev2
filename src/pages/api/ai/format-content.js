import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

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
        success: false,
        message: "Content is required and must be a non-empty string",
      });
    }

    // Step 1: Basic cleaning (optional, but can help)
    // Normalize line breaks and remove excessive whitespace/backslashes if needed
    let cleanedContent = content
      .replace(/\r\n/g, "\n") // Normalize line breaks
      .replace(/\\{2,}/g, "\\") // Reduce multiple backslashes
      .replace(/ +\n/g, "\n") // Trim trailing spaces on lines
      .trim();

    // Step 2: Call Gemini API for formatting refinement
    const formattingPrompt = `
      Review the following markdown text and improve its formatting for readability and structure. Apply these rules:
      - Ensure consistent use of markdown headings (#, ##, ###). Identify logical sections and apply appropriate heading levels if missing.
      - Break down long paragraphs into shorter ones (2-5 sentences).
      - Use bullet points (-) or numbered lists (1.) for items that should be lists.
      - Apply **bold text** for emphasis on key terms or important phrases where appropriate.
      - Ensure proper spacing around headings, lists, and paragraphs (usually one blank line).
      - Correct any minor markdown syntax errors.
      - Do NOT add any introductory or concluding remarks, just return the formatted markdown content.

      Here is the markdown content to format:
      ---
      ${cleanedContent}
      ---
    `;

    const formatResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: formattingPrompt }] }],
          generationConfig: {
            temperature: 0.3, // Lower temperature for more deterministic formatting
            maxOutputTokens: 8192,
          },
        }),
      }
    );

    const formatData = await formatResponse.json();

    if (!formatResponse.ok) {
      console.error("Gemini Formatting API Error:", formatData);
      throw new Error(
        formatData?.error?.message ||
          `Gemini formatting request failed with status ${formatResponse.status}`
      );
    }

    if (
      !formatData.candidates ||
      !formatData.candidates[0] ||
      !formatData.candidates[0].content ||
      !formatData.candidates[0].content.parts ||
      !formatData.candidates[0].content.parts[0]
    ) {
      console.error(
        "Unexpected Gemini formatting response structure:",
        formatData
      );
      throw new Error("Invalid response structure from AI formatting model.");
    }

    const formattedMarkdown =
      formatData.candidates[0].content.parts[0].text.trim();

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
