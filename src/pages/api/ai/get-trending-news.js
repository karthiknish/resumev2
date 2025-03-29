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
    // Construct the improved prompt for Gemini
    const prompt = `
      Act as a tech news curator. Provide a list of 3-5 current (within the last few days) and significant trending news headlines or topics in the web development and general technology sector. Focus on topics relevant to developers and tech professionals (e.g., new framework releases, major updates, security news, AI advancements in tech).

      For each item:
      1. Provide a concise, informative headline.
      2. Provide a very brief (1-2 sentence) summary explaining the core news item.

      Format the output strictly as a numbered list, with the headline first, followed by the summary on the next line. Separate items with a blank line.

      Example:
      1. React Conf 2025 Key Announcements
      Highlights include the new concurrent features and server components updates.

      2. Major Browser Engine Update Impacts CSS
      A recent update affects how certain CSS properties are rendered, requiring developer attention.

      3. AI Code Assistant Market Heats Up
      New players challenge existing AI coding tools with advanced features.

      Do not include any extra text, explanations, or markdown formatting other than the numbering. Ensure the news is recent and relevant.
    `;

    // Use the utility function
    const generationConfig = {
      temperature: 0.5, // More factual for news headlines/summaries
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
