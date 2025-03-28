import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

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

    // Call Google's Gemini API
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.5, // Slightly more focused for keyword suggestion
            maxOutputTokens: 200,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini Keyword Suggestion API Error:", data);
      throw new Error(
        data?.error?.message ||
          `Gemini keyword suggestion request failed with status ${response.status}`
      );
    }

    if (
      !data.candidates ||
      !data.candidates[0] ||
      !data.candidates[0].content ||
      !data.candidates[0].content.parts ||
      !data.candidates[0].content.parts[0]
    ) {
      console.error(
        "Unexpected Gemini keyword suggestion response structure:",
        data
      );
      throw new Error(
        "Invalid response structure from AI keyword suggestion model."
      );
    }

    const suggestedKeywordsText =
      data.candidates[0].content.parts[0].text.trim();
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
