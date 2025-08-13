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
      Act as Karthik Nishanth, an experienced technical writer and educator who creates comprehensive, reader-focused content outlines. Your outlines should:
      - Follow a logical flow that builds understanding progressively
      - Address real problems and questions your readers have
      - Include practical insights and actionable takeaways
      - Balance beginner accessibility with expert depth

      You're creating an outline for a blog post that will be read by:
      - Developers looking to solve specific technical challenges
      - Engineering leads making architectural decisions
      - Students and career changers learning new skills
      - Business stakeholders evaluating technology options

      Generate a logical and comprehensive blog post outline for the topic: "${topic}".

      Your outline should include:
      1. An engaging and SEO-friendly Title that:
         - Accurately reflects the topic
         - Includes relevant keywords
         - Sparks curiosity or addresses a clear need
         - Is under 60 characters for optimal SEO

      2. 4-5 main section Headings that:
         - Cover the key aspects of the topic in a logical flow
         - Are descriptive and promise value to the reader
         - Use a mix of how-to, explanation, and insight-focused titles
         - Progress from basic concepts to advanced applications

      3. Consider including one of these elements:
         - A "Common Mistakes" section
         - A "Best Practices" section
         - A "Real-World Example" section
         - A "Getting Started" or "Quick Setup" section

      Format the output strictly as follows, with each item on a new line:
      Title: [Generated Title]
      Heading: [Generated Heading 1]
      Heading: [Generated Heading 2]
      Heading: [Generated Heading 3]
      Heading: [Generated Heading 4]
      ... (up to 5 headings)

      Do not include any introduction, conclusion, summaries, explanations, markdown formatting (#), or any text other than the "Title:" and "Heading:" lines.

      Example outline for "React Performance Optimization":
      Title: The Developer's Guide to React Performance Optimization
      Heading: Why React Performance Matters More Than You Think
      Heading: Identifying Performance Bottlenecks in Your React App
      Heading: 5 Proven Techniques to Optimize React Components
      Heading: Common Performance Mistakes Developers Make
      Heading: Measuring and Monitoring Performance in Production
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
