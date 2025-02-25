import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  // Check for authenticated session
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { topic, tone, length, keywords } = req.body;

    if (!topic) {
      return res.status(400).json({ message: "Topic is required" });
    }

    // Construct the prompt for Gemini
    const prompt = `
      Write a blog post about "${topic}".
      ${tone ? `The tone should be ${tone}.` : ""}
      ${
        length
          ? `The length should be approximately ${length} words.`
          : "The length should be approximately 800 words."
      }
      ${
        keywords
          ? `Include the following keywords: ${keywords.join(", ")}.`
          : ""
      }
      
      Format the blog post with:
      1. An engaging title
      2. A brief introduction
      3. 3-5 main sections with subheadings
      4. A conclusion
      
      Return the content in markdown format.
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
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to generate content");
    }

    // Extract the generated text
    const generatedText = data.candidates[0].content.parts[0].text;

    // Parse the markdown to extract title and content
    const titleMatch =
      generatedText.match(/^#\s+(.+)$/m) || generatedText.match(/^(.+)\n=+$/m);
    const title = titleMatch ? titleMatch[1].trim() : "Generated Blog Post";

    // Remove the title from the content to avoid duplication
    let content = generatedText;
    if (titleMatch) {
      content = content.replace(titleMatch[0], "").trim();
    }

    return res.status(200).json({
      success: true,
      data: {
        title,
        content,
      },
    });
  } catch (error) {
    console.error("AI generation error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error generating blog content",
    });
  }
}
