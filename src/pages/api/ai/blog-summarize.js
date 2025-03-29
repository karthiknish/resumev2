// src/pages/api/ai/blog-summarize.js
import { callGemini } from "@/lib/gemini"; // Import the utility function
// Note: No need for getServerSession/authOptions here if it's intended to be public or called server-side after auth check

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { content, title } = req.body;

    if (!content || typeof content !== "string" || !content.trim()) {
      return res.status(400).json({
        error: "Blog content is required and must be a non-empty string",
      });
    }

    // Create an improved prompt for blog summarization
    const summarizationPrompt = `
      Act as a skilled content summarizer. Create a concise and engaging summary of the following blog post${
        title ? ` titled "${title}"` : ""
      }.

      **Instructions:**
      1.  **Length:** The summary should be approximately 150-200 words.
      2.  **Core Content:** Capture the main points, key arguments, and essential takeaways of the original post accurately.
      3.  **Clarity for Audio:** Write in simple, clear language suitable for reading aloud as an audio summary. Avoid complex jargon where possible or explain it briefly. Use shorter sentences and clear transitions.
      4.  **Engagement:** Maintain an informative and slightly engaging tone, similar to a brief news report or abstract.
      5.  **Format:** Output the summary as a single block of text (1-2 paragraphs). Do not include headings, bullet points, or any markdown formatting. Do not add introductory or concluding phrases like "This blog post discusses..." or "In summary...". Just provide the summary text itself.

      **Blog Content to Summarize:**
      ---
      ${content}
      ---
    `;
    // Define specific generation config for summarization
    const generationConfig = {
      temperature: 0.3, // Lower temperature for factual summary
      maxOutputTokens: 512, // Limit summary length
    };

    // Call the utility function
    const summaryText = await callGemini(summarizationPrompt, generationConfig);

    // Return the summary to the client
    return res.status(200).json({ summary: summaryText });
  } catch (error) {
    console.error("Error handling blog summarization:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
}
