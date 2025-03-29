// src/pages/api/ai/suggest-description.js
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
    const { title, content } = req.body;

    if (!title && !content) {
      return res.status(400).json({
        error:
          "Please provide at least a title or content snippet to suggest descriptions.",
      });
    }

    // Construct the prompt for Gemini
    // Focus on SEO and preview suitability
    const prompt = `
      Analyze the following blog post title and content snippet.
      Generate 2-3 concise and compelling meta descriptions (excerpts) for this blog post.
      Each description should be:
      - Between 120 and 155 characters long.
      - Accurately reflect the main topic of the post.
      - Include relevant keywords naturally.
      - Be engaging and encourage clicks (suitable for search results and social previews).

      Output *only* the suggested descriptions, each on a new line. Do not add numbering, labels, or any other text.

      Title: ${title || "N/A"}
      Content Snippet: ${content ? content.substring(0, 800) + "..." : "N/A"}

      Suggested Descriptions (each on a new line):
    `;

    // Configure Gemini call
    const generationConfig = {
      temperature: 0.6, // Allow for some creativity
      maxOutputTokens: 500, // Enough for a few descriptions
    };

    // Call the Gemini utility function
    const suggestionsString = await callGemini(prompt, generationConfig);

    // Process the response string into an array (split by newline)
    const suggestedDescriptions = suggestionsString
      .split("\n")
      .map((desc) => desc.trim()) // Trim whitespace
      .filter((desc) => desc && desc.length > 10); // Filter out empty lines or very short strings

    if (!suggestedDescriptions || suggestedDescriptions.length === 0) {
      console.warn("Gemini returned no valid description suggestions for:", {
        title,
      });
      return res.status(200).json({ success: true, suggestions: [] }); // Return empty array
    }

    return res
      .status(200)
      .json({ success: true, suggestions: suggestedDescriptions });
  } catch (error) {
    console.error("Error suggesting descriptions:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error generating description suggestions.",
      error: error.message,
    });
  }
}
