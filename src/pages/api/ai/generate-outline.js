// src/pages/api/ai/generate-outline.js
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
        message: "Topic is required to generate an outline.",
      });
    }

    // Construct the improved prompt for Gemini
    const prompt = `
      Act as an expert blog post outliner. Generate a logical and comprehensive blog post outline for the topic: "${topic}".
      The outline should include:
      1. An engaging and SEO-friendly Title that accurately reflects the topic.
      2. 3-5 relevant main section Headings that cover the key aspects of the topic in a logical flow. Headings should be descriptive and clear.

      Format the output strictly as follows, with each item on a new line:
      Title: [Generated Title]
      Heading: [Generated Heading 1]
      Heading: [Generated Heading 2]
      Heading: [Generated Heading 3]
      ... (up to 5 headings)

      Do not include any introduction, conclusion, summaries, explanations, markdown formatting (#), or any text other than the "Title:" and "Heading:" lines.
    `;

    // Use the utility function
    const generationConfig = {
      temperature: 0.6, // Balanced temperature for creative but relevant outline
      maxOutputTokens: 500,
    };
    const outlineText = await callGemini(prompt, generationConfig);

    // Parse the structured text
    const lines = outlineText.split("\n");
    let title = topic; // Default title
    const headings = [];

    lines.forEach((line) => {
      const trimmedLine = line.trim(); // Trim each line
      if (trimmedLine.toLowerCase().startsWith("title:")) {
        title = trimmedLine.substring(6).trim();
      } else if (trimmedLine.toLowerCase().startsWith("heading:")) {
        const heading = trimmedLine.substring(8).trim();
        if (heading) {
          // Ensure heading is not empty after trimming
          headings.push(heading);
        }
      }
    });

    if (headings.length === 0) {
      // Fallback if parsing fails - maybe the model didn't follow instructions
      console.warn(
        "Could not parse headings from outline response:",
        outlineText
      );
      // Attempt a simpler split or return an error/default
      // For now, just return empty headings
    }

    return res.status(200).json({
      success: true,
      outline: {
        title: title || topic, // Ensure title is never empty
        headings: headings,
      },
    });
  } catch (error) {
    console.error("Outline generation error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error generating outline",
    });
  }
}
