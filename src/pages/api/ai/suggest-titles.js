// src/pages/api/ai/suggest-titles.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { callGemini } from "@/lib/gemini";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const isAdmin =
    session?.user?.role === "admin" ||
    session?.user?.isAdmin === true ||
    session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  if (!session || !isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { currentTitle, contentSnippet } = req.body;

    if (
      !currentTitle ||
      typeof currentTitle !== "string" ||
      !currentTitle.trim()
    ) {
      return res
        .status(400)
        .json({ error: "Current title is required to suggest alternatives." });
    }

    // Construct the prompt for Gemini
    const prompt = `
      Act as an expert SEO copywriter and blog title generator.
      Given the following blog post title (and optional content snippet), generate 3-5 alternative titles that are more engaging, clear, and optimized for search engines (SEO).
      Consider using keywords naturally, creating curiosity, or highlighting the main benefit/topic. Keep titles reasonably concise.

      Output *only* the suggested titles, each on a new line. Do not add numbering, labels, explanations, or any other text.

      Current Title: ${currentTitle}
      Content Snippet (Optional): ${
        contentSnippet ? contentSnippet.substring(0, 500) + "..." : "N/A"
      }

      Suggested Titles (each on a new line):
    `;

    // Configure Gemini call
    const generationConfig = {
      temperature: 0.7, // Allow more creativity for titles
      maxOutputTokens: 300, // Enough for a few titles
    };

    // Call the Gemini utility function
    const suggestionsString = await callGemini(prompt, generationConfig);

    // Process the response string into an array (split by newline)
    const suggestedTitles = suggestionsString
      .split("\n")
      .map((title) => title.trim().replace(/^- /, "")) // Trim and remove potential list markers
      .filter((title) => title && title.length > 5); // Filter out empty or very short strings

    if (!suggestedTitles || suggestedTitles.length === 0) {
      console.warn("Gemini returned no valid title suggestions for:", {
        currentTitle,
      });
      return res.status(200).json({ success: true, suggestions: [] }); // Return empty array
    }

    return res
      .status(200)
      .json({ success: true, suggestions: suggestedTitles });
  } catch (error) {
    console.error("Error suggesting titles:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error generating title suggestions.",
      error: error.message,
    });
  }
}
