// src/pages/api/ai/blog-from-link.js

import axios from "axios";
import unfluff from "unfluff";
import { callGemini } from "@/lib/gemini";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { url, styleInstructions } = req.body;

  if (!url || typeof url !== "string" || !/^https?:\/\//.test(url)) {
    return res.status(400).json({ error: "A valid article URL is required." });
  }

  try {
    // Fetch the article HTML
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; BlogBot/1.0; +https://karthiknish.com/)",
      },
      timeout: 15000,
      maxContentLength: 2 * 1024 * 1024, // 2MB
    });

    // Extract main content using unfluff
    const data = unfluff(response.data);
    const { title, text, author, date } = data;

    // Require at least 200 non-whitespace characters
    if (!text || text.replace(/\s/g, "").length < 200) {
      return res.status(422).json({
        error: "Could not extract sufficient article content from the URL.",
      });
    }

    // Sanitize extracted text to remove potentially problematic non-printable characters
    // Allow common whitespace (\n, \r, \t) and printable ASCII (space through ~)
    const sanitizedText = text.replace(/[^\n\r\t\x20-\x7E]/g, "");

    // Check sanitized text again
    if (!sanitizedText || sanitizedText.replace(/\s/g, "").length < 100) {
      // Check sanitized length
      return res.status(422).json({
        error: "Could not extract sufficient valid content after sanitization.",
      });
    }

    // Compose prompt for AI model using sanitized text
    const prompt = `
You are an expert blogger, analyst, and thought leader writing for Karthik Nishanth's website. Your task is to read the following article and create a new, original, and highly insightful blog post in the user's style.

**Instructions:**
- Do NOT copy or paraphrase sentences directly; instead, use the article as inspiration for structure, facts, and flow.
- Write in a tone and style consistent with the user's previous blog posts.
- Go beyond summarization: deeply analyze the article's content, context, and implications.
- Critically evaluate the arguments, evidence, and perspectives presented in the article.
- Synthesize information from the article with your own knowledge, experience, and unique perspective.
- Highlight the broader significance, potential impact, and real-world applications of the topic.
- Identify any gaps, biases, or limitations in the original article and address them in your post.
- Provide actionable takeaways, recommendations, or next steps for readers.
- Use HTML formatting (headings <h2>, paragraphs <p>, lists <ul><li>, bold <strong>, etc.) where appropriate.
- Do not reference the original article or its author.
- Output only the HTML blog post content. Do not include any preamble or extra text. **Do not wrap the output in \`\`\`html ... \`\`\` or any other code blocks.**
${styleInstructions ? `- Style instructions: ${styleInstructions}` : ""}

**Metadata:**
- Article Title: ${title || "Untitled"}
${author ? `- Author: ${author}` : ""}
${date ? `- Date: ${date}` : ""}

**Source Article Content:**
${sanitizedText}
`;

    // Explicitly trim the final prompt before sending
    const finalPrompt = prompt.trim();

    // Final check if the trimmed prompt is empty (should be redundant with callGemini check, but safe)
    if (!finalPrompt) {
      return res.status(422).json({
        error: "Generated prompt became empty after processing.",
      });
    }

    // Call the AI model (Gemini, OpenAI, etc.) - callGemini handles prompt validation internally too
    const aiResponse = await callGemini(
      finalPrompt, // Pass the trimmed prompt string as the first argument
      {
        // Pass config overrides as the second argument
        maxOutputTokens: 4096,
        temperature: 0.7,
      }
    );

    // callGemini returns the text string directly, or throws an error.
    // Check if the returned string is empty (it shouldn't be based on callGemini logic, but good practice).
    if (!aiResponse) {
      return res
        .status(500)
        .json({ error: "AI model returned empty content." });
    }

    // Clean potential markdown code block fences
    let content = aiResponse.trim();
    if (content.startsWith("```html")) {
      content = content.slice(7);
      if (content.endsWith("```")) {
        content = content.slice(0, -3);
      }
    } else if (content.startsWith("```")) {
      // Handle generic ```
      content = content.slice(3);
      if (content.endsWith("```")) {
        content = content.slice(0, -3);
      }
    }
    content = content.trim(); // Trim again

    return res.status(200).json({
      success: true,
      title: title || "",
      content: content, // Use the cleaned content
    });
  } catch (error) {
    console.error("Error in blog-from-link:", error);
    // Check if the error is the specific "Prompt cannot be empty" from callGemini
    if (error.message === "Prompt cannot be empty.") {
      return res.status(422).json({
        error: "Failed to generate a valid prompt from the article content.",
      });
    }
    return res.status(500).json({
      error:
        error.response?.data?.error ||
        error.message ||
        "Failed to process the article URL.",
    });
  }
}
