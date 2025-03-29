// src/pages/api/ai/generate-blog.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { callGemini } from "@/lib/gemini"; // Import the utility function

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
    const { topic, tone, length, keywords, outline } = req.body; // Destructure outline

    if (!topic && !outline?.title) {
      // Need at least a topic or an outline title
      return res
        .status(400)
        .json({ message: "Topic or Outline Title is required" });
    }

    const effectiveTopic = outline?.title || topic; // Use outline title if available

    // Construct the improved prompt for Gemini
    const outlineInstructions = outline
      ? `
      **Use the following outline:**
      - **Title:** ${outline.title || effectiveTopic}
      - **Headings:**
        ${outline.headings.map((h) => `- ${h}`).join("\n        ")}
      Ensure the generated content follows this structure precisely, using the provided title and headings for the main sections. Expand on each heading with detailed, informative content.
    `
      : `
      - **Structure:**
          1.  **Title:** Create an engaging, clear, and SEO-friendly title for the topic "${effectiveTopic}" (output as a level 1 markdown heading: # Title).
          2.  **Introduction:** Write a compelling introduction (1-2 paragraphs) that hooks the reader, clearly states the post's purpose, and briefly outlines what will be covered.
          3.  **Main Sections:** Develop 3-5 logical main sections, each with a clear, descriptive subheading (output as level 2 markdown headings: ## Subheading). Elaborate on each point with sufficient detail, examples, or explanations. Break down complex ideas into smaller, digestible paragraphs (2-4 sentences each).
          4.  **Formatting:** Use markdown formatting effectively for readability:
              *   Use bullet points (-) or numbered lists (1.) for lists or sequential steps.
              *   Use **bold text** strategically for emphasis on key terms, concepts, or keywords.
              *   Use markdown code blocks (\`\`\`language\ncode\n\`\`\`) for any code examples, specifying the language where appropriate.
          5.  **Conclusion:** Write a concise concluding summary (1-2 paragraphs) that recaps the main points and offers a final thought, takeaway, or call to action. Do not introduce new information here.
    `;

    const prompt = `
      Act as an expert content writer, technical blogger, and SEO specialist. Your target audience is likely other developers, tech enthusiasts, or potential clients seeking web development services. Write a high-quality, well-structured, and engaging blog post about "${effectiveTopic}".

      **Instructions:**
      - **Tone:** ${
        tone
          ? `Adopt a ${tone} tone. Ensure clarity and accuracy.`
          : "Adopt a professional, informative, and slightly enthusiastic tone."
      }
      - **Length:** ${
        length
          ? `Aim for a length of approximately ${length} words. Focus on quality and depth over strict word count.`
          : "Aim for a length of approximately 800 words."
      }
      - **Keywords:** ${
        keywords && keywords.length > 0
          ? `Naturally and strategically integrate the following keywords throughout the text, focusing on readability: ${keywords.join(
              ", "
            )}. Avoid keyword stuffing.`
          : "Optimize for relevant keywords related to the topic naturally within the content."
      }
      ${outlineInstructions}
      - **Readability:** Ensure paragraphs are well-structured and sentences flow logically. Use transition words where appropriate.
      - **Output:** Return the entire response, starting *directly* with the markdown title (# Title), as a single block of valid, well-formatted markdown text. Do not include any preamble, notes, disclaimers, or explanations before or after the markdown content itself.
    `;

    // Use the utility function to call Gemini
    const generationConfig = {
      temperature: 0.7, // Balance creativity and focus
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192, // Ensure enough tokens for potentially longer posts
    };
    const generatedText = await callGemini(prompt, generationConfig);

    // Parse the markdown to extract title and content
    const titleMatch =
      generatedText.match(/^#\s+(.+?)(\r?\n|$)/m) || // Matches '# Title'
      generatedText.match(/^(.+)(\r?\n=+)(\r?\n|$)/m) || // Matches Title\n===
      generatedText.match(/^(.+)(\r?\n-+)(\r?\n|$)/m); // Matches Title\n---

    let title = effectiveTopic; // Default to effective topic if no title found
    let content = generatedText;

    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].trim();
      // Remove the title line and the following newline(s) from the content
      content = generatedText.replace(titleMatch[0], "").trimStart();
    } else {
      // If no markdown title found, assume first line might be the title (heuristic)
      const lines = generatedText.split("\n");
      if (
        lines.length > 1 &&
        lines[0].trim().length > 0 &&
        lines[0].length < 100 &&
        !lines[0].startsWith("##") // Avoid mistaking a subheading for the title
      ) {
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
