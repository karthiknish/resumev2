// src/pages/api/ai/suggest-keywords.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { callGemini } from "@/lib/gemini"; // Import the utility function

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
    const { topic } = req.body;

    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return res.status(400).json({
        success: false,
        message: "Topic is required to suggest keywords.",
      });
    }

    // Construct the improved prompt for Gemini
    const prompt = `
      Act as an SEO specialist. For the blog post topic "${topic}", suggest 7-10 relevant SEO keywords and keyphrases.
      Include a mix of short-tail (e.g., "web development") and long-tail keywords (e.g., "best practices for Next.js SEO").
      Focus on terms that have reasonable search volume and relevance to the topic.

      Return the keywords strictly as a simple comma-separated list, with no extra text, explanations, numbering, or formatting.
      Example: keyword1, keyword phrase 2, keyword3, long tail keyword phrase 4
    `;

    // Use the utility function
    const generationConfig = {
      temperature: 0.5, // More focused for keyword suggestion
      maxOutputTokens: 250, // Allow slightly more tokens for longer phrases
    };
    const suggestedKeywordsText = await callGemini(prompt, generationConfig);

    // Split into an array, trim whitespace, and filter empty strings
    const keywordsArray = suggestedKeywordsText
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    return res.status(200).json({
      success: true,
      keywords: keywordsArray,
    });
  } catch (error) {
    console.error("Keyword suggestion error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error suggesting keywords",
    });
  }
}
