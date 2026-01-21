// Converted to TypeScript - migrated
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
      Act as a world-class copywriter and SEO expert who specializes in creating compelling headlines for technical content. Your goal is to craft titles that:
      - Immediately grab attention and curiosity
      - Clearly communicate the article's value
      - Include relevant keywords for search visibility
      - Feel human-written, not formulaic
      - Appeal to developers, tech leads, and business decision-makers

      You're helping Karthik Nishanth, a full-stack developer with expertise in modern web technologies, improve his blog titles to increase engagement and search visibility.

      Given the following current title (and optional content snippet), generate 5 alternative titles that are more engaging, clear, and optimized for search engines.

      Current Title: ${currentTitle}
      Content Snippet (Optional): ${
        contentSnippet ? contentSnippet.substring(0, 500) + "..." : "N/A"
      }

      Guidelines for effective titles:
      - Use power words that evoke emotion or curiosity (e.g., "Ultimate Guide", "Secrets", "Mistakes", "Proven", "Essential")
      - Include numbers when appropriate (e.g., "7 Tips", "3 Common Mistakes")
      - Address the reader directly when possible (e.g., "You're Making This Mistake")
      - Promise specific, valuable outcomes (e.g., "Boost Performance by 50%")
      - Keep under 60 characters for optimal SEO, but prioritize clarity over strict character limits
      - Avoid clickbait - be honest about what the article delivers
      - Consider different approaches: How-to, List, Question, Statement, Controversial opinion

      Output format:
      - Provide exactly 5 titles
      - Each title on a new line
      - No numbering, labels, explanations, or any other text
      - Titles should vary in approach (how-to, list, question, statement, etc.)

      Example titles:
      "The Ultimate Guide to React Performance Optimization"
      "7 Common Database Design Mistakes Developers Make"
      "Why Your Next.js App is Slower Than It Should Be"
      "Building Scalable APIs: 5 Principles You Need to Know"
      "The One Thing You're Missing in Your Technical Interview Prep"

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

