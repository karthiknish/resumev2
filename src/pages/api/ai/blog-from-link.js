// src/pages/api/ai/blog-from-link.js

import axios from "axios";
import unfluff from "unfluff";
import { callGemini } from "@/lib/gemini";

// Helper to parse structured AI response
const parseStructuredResponse = (responseText) => {
  const output = {
    title: "AI Generated Post", // Default title
    keywords: [],
    descriptions: [],
    categories: [],
    body: "",
  };

  const sections = {
    KEYWORDS: "keywords",
    DESCRIPTIONS: "descriptions",
    CATEGORIES: "categories",
    BODY: "body",
  };

  let currentSection = "body"; // Assume body content starts first if no delimiters found initially
  const lines = responseText.split('\n');

  lines.forEach(line => {
    const trimmedLine = line.trim();
    let sectionFound = false;
    for (const [key, sectionName] of Object.entries(sections)) {
      if (trimmedLine.startsWith(key + ":")) {
        currentSection = sectionName;
        const value = trimmedLine.substring(key.length + 1).trim();
        if (value) {
          // For list sections, split by comma or add directly if single item
          if (['keywords', 'categories'].includes(currentSection)) {
            output[currentSection].push(...value.split(',').map(s => s.trim()).filter(Boolean));
          } else if (currentSection === 'descriptions') {
            output[currentSection].push(value); // Each description on its own line
          } else if (currentSection === 'body') {
             // This case shouldn't happen if BODY is handled below, but as fallback
             output.body += value + '\n'; 
          }
        }
        sectionFound = true;
        break;
      }
    }

    // If no section delimiter found, append to the current section (likely body)
    if (!sectionFound) {
      if (currentSection === 'body') {
        output.body += line + '\n'; // Append the raw line including original spacing/newlines
      } else if (currentSection === 'descriptions') {
         // If still in descriptions, treat subsequent lines as part of the last description or new ones
         // For simplicity, let's just push subsequent non-empty lines as new descriptions
         if (trimmedLine) {
             output.descriptions.push(trimmedLine);
         }
      } 
      // Ignore lines if currentSection is keywords/categories without delimiter
    }
  });

  // Final cleanup
  output.body = output.body.trim();
  output.keywords = [...new Set(output.keywords)]; // Deduplicate
  output.categories = [...new Set(output.categories)]; // Deduplicate
  
   // Add fallback suggestions if arrays are empty
   if (output.keywords.length === 0) output.keywords = ["Generated"];
   if (output.descriptions.length === 0) output.descriptions = [output.body.substring(0, 160) + "..."];
   if (output.categories.length === 0) output.categories = ["General"];

  return output;
};

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
    const { title: originalTitle, text, author, date } = data;

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
You are an expert blogger, analyst, and content strategist writing for Karthik Nishanth's website. Your task is to read the source article content and generate a new, original blog post, along with metadata suggestions.

**Instructions for Blog Post:**
- Write in a tone and style consistent with the user's previous blog posts.${
      styleInstructions
        ? ` Specific style instructions: ${styleInstructions}`
        : ""
    }
- Analyze the source content, don't just summarize. Provide unique insights, critical evaluation, and practical takeaways.
- Structure the post logically (Introduction, Key Insights, Implications, Conclusion).
- Use standard HTML formatting (<h2>, <p>, <ul><li>, <strong>, etc.).
- Do not reference the source article directly.

**Instructions for Metadata:**
- Suggest 3-5 relevant keywords (comma-separated).
- Suggest 2-3 concise meta descriptions (120-155 chars each, suitable for SEO, each on a new line).
- Suggest 2-4 relevant categories (comma-separated).

**Source Article Metadata:**
- Title: ${originalTitle || "Untitled"}
${author ? `- Author: ${author}` : ""}
${date ? `- Date: ${date}` : ""}

**Source Article Content:**
---
${sanitizedText}
---

**OUTPUT FORMAT (Strictly follow this structure):**

KEYWORDS: [comma-separated keywords]
DESCRIPTIONS:
[suggested description 1]
[suggested description 2]
[suggested description 3]
CATEGORIES: [comma-separated categories]
BODY:
[full HTML blog post content starts here, without any wrapping \`\`\`html or other fences]
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

    // Parse the structured response
    const parsedData = parseStructuredResponse(aiResponse);

    // Clean the HTML Body
    const cleanedBody = parsedData.body
      .replace(/^\s*```(?:html)?\s*\n?|\s*\n?```\s*$/g, "") // Remove fences
      .trim();

    // Return parsed data
    return res.status(200).json({
      success: true,
      title: originalTitle || parsedData.title, // Use original extracted title, fallback to AI if needed
      content: cleanedBody,
      keywords: parsedData.keywords,
      descriptions: parsedData.descriptions,
      categories: parsedData.categories,
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
