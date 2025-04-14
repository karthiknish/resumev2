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
    const { topic, tone, length, keywords, outline } = req.body;

    // Determine the primary topic/title source
    const effectiveTopic = outline?.title || topic;

    if (!effectiveTopic) {
      // Need at least a topic or an outline title
      return res
        .status(400)
        .json({ message: "Topic or Outline Title is required" });
    }

    let prompt;
    let generationConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192, // Default max tokens
    };

    // Construct prompt based on whether an outline is provided
    if (outline && outline.headings && outline.headings.length > 0) {
      // --- Prompt for generating from OUTLINE ---
      const outlineInstructions = `
      **Use the following outline:**
      - **Title:** ${outline.title || effectiveTopic}
      - **Headings:**
        ${outline.headings.map((h) => `- ${h}`).join("\n        ")}
      Ensure the generated content follows this structure precisely, using the provided title and headings for the main sections. Expand on each heading with detailed, informative content.
      `;

      prompt = `
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
        - **Readability:** Ensure paragraphs are well-structured and sentences flow logically. Use transition words where appropriate. Use HTML formatting effectively (<h2>, <p>, <strong>, <ul>, <li>, etc.).
        - **Output:** Return the entire response, starting directly with the HTML title (<h1>Title</h1>), as a single block of valid, well-formatted HTML. Do not include any preamble, notes, disclaimers, or explanations before or after the HTML content itself. Do not wrap the output in code blocks.
      `;
      // Keep default maxOutputTokens for full post generation
    } else {
      // --- Prompt for generating DRAFT from TITLE only ---
      prompt = `
        Act as a content writer. Generate a draft blog post in simple HTML format based only on the provided title.

        **Title:** "${effectiveTopic}"

        **Instructions:**
        - Create a reasonable introduction (1-2 paragraphs using <p> tags).
        - Develop 2-4 body paragraphs discussing potential aspects related to the title (using <p> tags).
        - Write a brief conclusion (1 paragraph using <p> tags).
        - Use basic HTML formatting (paragraphs <p>, maybe one or two <h2> subheadings if appropriate). Keep it relatively simple.
        - Focus on generating coherent text relevant to the title.
        - Output only the generated HTML content (starting with <p> or <h2>). Do not include the title itself (like <h1>Title</h1>) in the output. Do not add any preamble, notes, or explanations. Do not wrap the output in code blocks.
      `;
      generationConfig.maxOutputTokens = 2048; // Use fewer tokens for a draft
    }

    // Call the utility function to call Gemini
    console.log(
      "Generating blog content with prompt:",
      prompt.substring(0, 200) + "..."
    ); // Log start of prompt
    const generatedText = await callGemini(prompt, generationConfig);
    console.log(
      "Generated text received (first 200 chars):",
      generatedText.substring(0, 200) + "..."
    );

    let title = effectiveTopic; // Start with the provided title/topic
    let rawContent = generatedText.trim();

    // Clean potential markdown code block fences
    let content = rawContent
      .replace(/^\s*```(?:html)?\s*\n?|\s*\n?```\s*$/g, "")
      .trim();

    // If generated from outline, the AI might have included the title again
    if (outline) {
      // Match HTML H1 tag
      const titleMatch = content.match(/^<h1>\s*(.+?)\s*<\/h1>(\r?\n|$)/im);
      if (titleMatch && titleMatch[1]) {
        // If AI included a title matching the outline/topic, remove it from content
        if (
          titleMatch[1].trim().toLowerCase() === effectiveTopic.toLowerCase()
        ) {
          console.log("AI included HTML title, removing it from content.");
          content = content.replace(titleMatch[0], "").trimStart();
        } else {
          // If AI generated a different title, maybe use it? For now, stick to effectiveTopic.
          console.log(
            "AI generated a different title, keeping original effectiveTopic."
          );
          // Optionally: title = titleMatch[1].trim(); // Uncomment to use AI's title
        }
      }
    }
    // If generated *only* from title, the entire response is the content.

    return res.status(200).json({
      success: true,
      data: {
        title: title, // Return the title used for generation
        content: content, // Return the generated content
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
