import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  // Check for authenticated session
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Basic admin check (adjust based on your session structure)
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
    const { topic, tone, length, keywords } = req.body;

    if (!topic) {
      return res.status(400).json({ message: "Topic is required" });
    }

    // Construct the improved prompt for Gemini
    const prompt = `
      Act as an expert content writer and SEO specialist. Write a well-structured and engaging blog post about "${topic}".

      **Instructions:**
      - **Tone:** ${
        tone
          ? `Adopt a ${tone} tone.`
          : "Adopt a professional and informative tone."
      }
      - **Length:** ${
        length
          ? `Aim for a length of approximately ${length} words.`
          : "Aim for a length of approximately 800 words."
      }
      - **Keywords:** ${
        keywords && keywords.length > 0
          ? `Naturally integrate the following keywords throughout the text: ${keywords.join(
              ", "
            )}.`
          : "Optimize for relevant keywords related to the topic."
      }
      - **Structure:**
          1.  **Title:** Create an engaging and SEO-friendly title (output as a level 1 markdown heading: # Title).
          2.  **Introduction:** Write a brief introduction (1-2 paragraphs) that hooks the reader and states the post's purpose.
          3.  **Main Sections:** Include 3-5 main sections, each with a clear, descriptive subheading (output as level 2 markdown headings: ## Subheading). Break down complex ideas into smaller paragraphs (2-4 sentences each).
          4.  **Formatting:** Use markdown formatting effectively:
              *   Use bullet points (-) or numbered lists (1.) for lists.
              *   Use **bold text** for emphasis on key terms, concepts, or keywords.
          5.  **Conclusion:** Write a concluding summary (1-2 paragraphs) that recaps the main points and offers a final thought or call to action.
      - **Output:** Return the entire response, starting *directly* with the markdown title (# Title), as a single block of valid markdown text. Do not include any preamble, notes, or explanations before or after the markdown content.
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
          // Adjust generation config if needed, e.g., temperature for creativity
          generationConfig: {
            temperature: 0.7, // Slightly creative but still focused
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192, // Ensure enough tokens for longer posts
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error Response:", data); // Log error details
      throw new Error(
        data?.error?.message ||
          `Gemini API request failed with status ${response.status}`
      );
    }

    // Check if candidates exist and have content
    if (
      !data.candidates ||
      !data.candidates[0] ||
      !data.candidates[0].content ||
      !data.candidates[0].content.parts ||
      !data.candidates[0].content.parts[0]
    ) {
      console.error("Unexpected Gemini API response structure:", data);
      throw new Error("Invalid response structure from AI model.");
    }

    // Extract the generated text
    const generatedText = data.candidates[0].content.parts[0].text;

    // Parse the markdown to extract title and content
    // Improved regex to handle potential variations in title markdown
    const titleMatch =
      generatedText.match(/^#\s+(.+?)(\r?\n|$)/m) || // Matches '# Title'
      generatedText.match(/^(.+)(\r?\n=+)(\r?\n|$)/m) || // Matches Title\n===
      generatedText.match(/^(.+)(\r?\n-+)(\r?\n|$)/m); // Matches Title\n---

    let title = topic; // Default to original topic if no title found
    let content = generatedText;

    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].trim();
      // Remove the title line and the following newline(s) from the content
      content = generatedText.replace(titleMatch[0], "").trimStart();
    } else {
      // If no markdown title found, assume first line might be the title
      const lines = generatedText.split("\n");
      if (
        lines.length > 1 &&
        lines[0].trim().length > 0 &&
        lines[0].length < 100
      ) {
        // Heuristic: title is likely short
        title = lines[0].trim();
        content = lines.slice(1).join("\n").trimStart();
      }
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
