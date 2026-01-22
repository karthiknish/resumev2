// Converted to TypeScript - migrated
// src/pages/api/ai/suggest-topics.js
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { callGemini } from "@/lib/gemini"; // Import the utility function

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check for authenticated session
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Basic admin check
  const isAdmin =
    (session?.user as { role?: string; isAdmin?: boolean })?.role === "admin" ||
    (session?.user as { role?: string; isAdmin?: boolean })?.isAdmin === true ||
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

    // Construct the improved prompt for Gemini
    const prompt = `
      Act as a content strategist for a web development blog. Suggest 5 engaging and relevant blog post topics or titles suitable for an audience of developers, tech enthusiasts, and potential clients.
      Focus on current trends, practical tutorials, common challenges, insightful comparisons, or interesting technologies within web development (React, Next.js, Node.js, Cloud, etc.).
      Ensure the topics are specific enough to be covered well in a blog post.

      Format the output strictly as a numbered list, with each topic/title on a new line:
      1. [Topic/Title 1]
      2. [Topic/Title 2]
      3. [Topic/Title 3]
      4. [Topic/Title 4]
      5. [Topic/Title 5]

      Do not include any extra text, explanations, or markdown formatting. Just the numbered list of topics/titles.
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
  } catch (error: unknown) {
    console.error("Topic suggestion error:", error);
    const message = error instanceof Error ? error.message : "Error suggesting topics";
    return res.status(500).json({
      success: false,
      message,
    });
  }
}

