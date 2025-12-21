// src/pages/api/ai/agent-generate-blog.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { callGemini } from "@/lib/gemini";

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
    const { context } = req.body;

    if (!context?.trim()) {
      return res.status(400).json({ message: "Context is required" });
    }

    const generationConfig = {
      temperature: 0.8,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192,
    };

    const prompt = `
      Act as Karthik Nishanth, a seasoned full-stack developer with over 8 years of experience building web applications and leading development teams. You're also a skilled technical writer who can explain complex concepts in an accessible way.

      Based on the following context provided by the user, generate a complete blog post with a compelling title and rich content.

      **User Context:**
      ${context}

      **Your Task:**
      1. First, create an engaging, SEO-friendly title based on the context
      2. Then write a comprehensive blog post that:
         - Starts with an engaging introduction that hooks the reader
         - Has clear sections with H2 headings
         - Includes practical examples, code snippets, or case studies where relevant
         - Uses a conversational yet professional tone
         - Provides actionable takeaways
         - Is approximately 800-1200 words

      **Writing Style:**
      - Use contractions (don't, can't, it's) to sound conversational
      - Vary sentence length for better rhythm
      - Ask rhetorical questions to engage readers
      - Include real-world analogies and metaphors
      - Address the reader directly ("you")
      - Share personal insights or experiences to add authenticity

      **HTML Formatting:**
      - Use <h2> tags for main section headings
      - Wrap paragraphs in <p> tags
      - Use <strong> for emphasis on key terms
      - Use <ul> and <li> for lists
      - Use <code> for inline code references
      - Use <pre><code> for code blocks

      **Output Format:**
      Return your response as valid JSON with exactly this structure:
      {
        "title": "Your Generated Blog Title Here",
        "content": "<p>Your HTML content here...</p>"
      }

      Return ONLY the JSON object, no additional text or markdown code blocks.
    `;

    console.log("[Agent Mode] Generating blog from context...");
    const rawResponse = await callGemini(prompt, generationConfig);
    console.log("[Agent Mode] Raw response received");

    // Parse the JSON response
    let parsedResponse;
    try {
      // Clean potential markdown fences
      const cleanedResponse = rawResponse
        .replace(/^```(?:json)?\s*\n?/i, "")
        .replace(/\n?```\s*$/i, "")
        .trim();
      
      parsedResponse = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("[Agent Mode] Failed to parse response as JSON:", parseError);
      console.error("[Agent Mode] Raw response:", rawResponse.substring(0, 500));
      
      // Fallback: try to extract title and content manually
      const titleMatch = rawResponse.match(/"title"\s*:\s*"([^"]+)"/);
      const contentMatch = rawResponse.match(/"content"\s*:\s*"(.+)"\s*\}$/s);
      
      if (titleMatch && contentMatch) {
        parsedResponse = {
          title: titleMatch[1],
          content: contentMatch[1].replace(/\\n/g, "\n").replace(/\\"/g, '"'),
        };
      } else {
        throw new Error("Failed to parse AI response. Please try again.");
      }
    }

    if (!parsedResponse.title || !parsedResponse.content) {
      throw new Error("AI response missing title or content");
    }

    console.log(`[Agent Mode] Generated title: "${parsedResponse.title}"`);

    return res.status(200).json({
      success: true,
      data: {
        title: parsedResponse.title,
        content: parsedResponse.content,
      },
    });
  } catch (error) {
    console.error("[Agent Mode] Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error generating blog content",
    });
  }
}
