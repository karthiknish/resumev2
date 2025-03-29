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
      return res
        .status(400)
        .json({
          error: "Blog content is required and must be a non-empty string",
        });
    }

    // Create a prompt for blog summarization
    const summarizationPrompt = `
Please create a concise summary of the following blog post titled "${
      title || "Blog Post"
    }". 
The summary should:
1. Be approximately 150-200 words
2. Capture the main points and key takeaways
3. Be suitable for reading aloud as audio content
4. Use simple, clear language that works well for speech

Here is the blog content to summarize:
${content}
`;
    // Define specific generation config for summarization
    const generationConfig = {
      temperature: 0.2, // Lower temperature for more factual output
      maxOutputTokens: 512, // Limit summary length
    };

    // Call the utility function
    const summaryText = await callGemini(summarizationPrompt, generationConfig);

    // Return the summary to the client
    // Note: The callGemini function throws an error if all models fail,
    // so we don't need the complex error handling loop here.
    // Safety blocks might still need specific handling if the utility doesn't cover them.
    // For now, assuming callGemini returns the text or throws.
    return res.status(200).json({ summary: summaryText });
  } catch (error) {
    console.error("Error handling blog summarization:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
}
