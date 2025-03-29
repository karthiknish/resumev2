// src/pages/api/ai/get-trending-news.js
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
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  if (req.method !== "POST") {
    // Using POST for consistency, though no body needed yet
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Construct the prompt for Gemini
    const prompt = `
      Provide a list of 3-5 current trending news headlines or topics in the web development and technology sector.
      For each item, provide a very brief (1-2 sentence) summary.
      Format the output strictly as a numbered list, with the headline/topic first, followed by the summary on the next line. Separate items with a blank line.

      Example:
      1. New JavaScript Framework Released
      A new framework focusing on performance has gained traction among developers.

      2. AI Integration in Code Editors
      Major code editors are adding AI-powered features for code completion and debugging.

      3. Serverless Architecture Adoption Grows
      More companies are moving towards serverless solutions for scalability and cost savings.

      Do not include any extra text, explanations, or markdown formatting other than the numbering.
    `;

    // Use the utility function
    const generationConfig = {
      temperature: 0.6, // Slightly more factual for news
      maxOutputTokens: 1000,
    };
    const newsText = await callGemini(prompt, generationConfig);

    // Parse the structured text into an array of objects
    const newsItems = [];
    const lines = newsText.split("\n");
    let currentItem = null;

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.match(/^\d+\.\s*/)) {
        // Starts with number and dot (headline)
        if (currentItem) {
          newsItems.push(currentItem); // Push previous item if exists
        }
        currentItem = {
          headline: trimmedLine.replace(/^\d+\.\s*/, "").trim(),
          summary: "",
        };
      } else if (currentItem && trimmedLine.length > 0) {
        // Summary line
        // Append to summary, handle multi-line summaries if necessary
        currentItem.summary =
          (currentItem.summary ? currentItem.summary + " " : "") + trimmedLine;
      } else if (!trimmedLine && currentItem) {
        // Blank line signifies end of current item's summary potentially
        if (currentItem.headline && currentItem.summary) {
          newsItems.push(currentItem);
          currentItem = null;
        }
      }
    }
    if (currentItem && currentItem.headline && currentItem.summary) {
      // Add the last item
      newsItems.push(currentItem);
    }

    return res.status(200).json({
      success: true,
      news: newsItems,
    });
  } catch (error) {
    console.error("Trending news fetch error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error fetching trending news",
    });
  }
}
