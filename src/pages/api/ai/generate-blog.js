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
      temperature: 0.8, // Increased for more human-like variation
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
        Act as Karthik Nishanth, a seasoned full-stack developer with over 8 years of experience building web applications and leading development teams. You're also a skilled technical writer who can explain complex concepts in an accessible way. Your writing style is:
        - Conversational yet professional
        - Rich with real-world examples and practical insights
        - Engaging through storytelling and analogies
        - Thoughtful and opinionated when appropriate
        - Focused on solving real problems for your readers

        Your audience consists of:
        - Junior to mid-level developers seeking to level up their skills
        - Tech leads and engineering managers making architectural decisions
        - Business owners evaluating technology solutions
        - Students and career changers entering the tech field

        **Topic:** "${effectiveTopic}"

        **Instructions:**
        - **Tone:** ${
          tone
            ? `Write in a ${tone} tone that connects with readers on a human level. Imagine you're explaining this to a colleague over coffee.`
            : "Write in a friendly, professional tone that's informative yet approachable. Imagine you're explaining this to a colleague over coffee."
        }
        - **Length:** ${
          length
            ? `Aim for approximately ${length} words. Focus on quality and depth over strict word count.`
            : "Aim for approximately 800 words."
        }
        - **Keywords:** ${
          keywords && keywords.length > 0
            ? `Naturally integrate the following keywords: ${keywords.join(
                ", "
              )}. Prioritize readability over keyword placement.`
            : "Naturally incorporate relevant keywords related to the topic."
        }
        ${outlineInstructions}
        - **Structure & Flow:** 
          * Start with an engaging introduction that hooks the reader with a relatable problem or intriguing question
          * Organize content with clear sections using headings that promise value
          * Use transition phrases to create smooth flow between ideas
          * Include practical examples, code snippets, or case studies where relevant
          * Sprinkle in personal insights or lessons learned from real projects
          * End with a conclusion that reinforces key points and provides actionable takeaways
        - **Writing Style:**
          * Use contractions (don't, can't, it's) to sound more conversational
          * Vary sentence length for better rhythm (mix short punchy sentences with longer complex ones)
          * Ask rhetorical questions to engage readers and guide their thinking
          * Include real-world analogies and metaphors to explain technical concepts
          * Address the reader directly ("you") to create connection
          * Occasionally share personal opinions or experiences to add authenticity
          * Use humor or personality when appropriate, but stay professional
        - **Technical Content:**
          * Include relevant code examples when discussing implementation details
          * Explain not just "how" but "why" - the reasoning behind decisions
          * Acknowledge trade-offs and limitations of different approaches
          * Provide practical advice that readers can apply immediately
        - **HTML Formatting:**
          * Use <h2> tags for main section headings
          * Wrap paragraphs in <p> tags
          * Use <strong> for emphasis on key terms
          * Use <ul> and <li> for lists
          * Use <code> for inline code references
          * Keep formatting clean and semantic
        - **Output Requirements:**
          * Return only the HTML content, starting directly with the content (no title <h1>)
          * Do not include any preamble, notes, or explanations
          * Do not wrap in code blocks
          * Ensure the content reads like it was written by a human expert, not generated by AI
      `;
      // Keep default maxOutputTokens for full post generation
    } else {
      // --- Prompt for generating DRAFT from TITLE only ---
      prompt = `
        Act as Karthik Nishanth, a seasoned full-stack developer and technical writer with a talent for explaining complex topics in an engaging way. You're brainstorming ideas for a blog post and creating a rough draft that captures the essence of the topic.

        Your writing style is:
        - Exploratory and curious
        - Honest about what you know and don't know
        - Focused on practical insights over theoretical perfection
        - Conversational with a touch of personality

        **Title:** "${effectiveTopic}"

        **Instructions:**
        - Write an engaging introduction that hooks the reader with a relatable problem or intriguing question (1-2 paragraphs with <p> tags)
        - Develop 2-4 body sections that explore different aspects of the topic (using <p> tags and <h2> headings)
        - Include a thoughtful conclusion that provides value and next steps (1 paragraph with <p> tag)
        - Use a conversational tone that feels natural and human
        - Prioritize clarity and reader engagement over perfection
        - Use HTML formatting appropriately (<p>, <h2>, <strong>, <ul>, <li>)
        - Keep the content focused and avoid fluff
        - Output only the HTML content (no title <h1> tag, no preamble, no explanations)
        - Don't worry about perfect structure - this is a draft for further refinement
      `;
      generationConfig.maxOutputTokens = 2048; // Use fewer tokens for a draft
      generationConfig.temperature = 0.9; // Even more creative for drafts
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
