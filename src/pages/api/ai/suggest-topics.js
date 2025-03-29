// src/pages/api/ai/suggest-topics.js
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
    // Using POST even if no body needed, for consistency with other AI calls
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Optional: Could accept a 'theme' or 'category' in req.body later
    // const { theme } = req.body;

    // Construct the prompt for Gemini
    const prompt = `
      Suggest 5 engaging and relevant blog post topics suitable for a web development / tech blog.
      Consider current trends, common challenges, or interesting technologies.

      Format the output strictly as a numbered list, with each topic on a new line:
      1. [Topic 1]
      2. [Topic 2]
      3. [Topic 3]
      4. [Topic 4]
      5. [Topic 5]

      Do not include any extra text, explanations, or markdown formatting.
    `;

    // Use the utility function
    const generationConfig = {
      temperature: 0.8, // Higher temperature for more creative topic ideas
      maxOutputTokens: 500,
    };
    const suggestionsText = await callGemini(prompt, generationConfig);

    // Parse the numbered list
    const topicsArray = suggestionsText
      .split("\n")
      .map((line) => line.replace(/^\d+\.\s*/, "").trim()) // Remove numbering and trim
      .filter((topic) => topic.length > 0); // Filter out empty lines

    return res.status(200).json({
      success: true,
      topics: topicsArray,
    });
  } catch (error) {
    console.error("Topic suggestion error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error suggesting topics",
    });
  }
}
