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

    // Construct the prompt for Gemini
    const prompt = `
      Given the blog post topic "${topic}", suggest 5-10 relevant SEO keywords or keyphrases.
      Focus on terms that people might search for related to this topic.
      Return the keywords as a simple comma-separated list, with no extra text or explanation.
      Example: keyword1, keyword phrase 2, keyword3
    `;

    // Use the utility function
    const generationConfig = {
      temperature: 0.5, // Slightly more focused for keyword suggestion
      maxOutputTokens: 200,
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
