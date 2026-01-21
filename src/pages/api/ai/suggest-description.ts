// Converted to TypeScript - migrated
// src/pages/api/ai/suggest-description.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { callGemini } from "@/lib/gemini";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  const isAdmin =
    session?.user?.role === "admin" ||
    session?.user?.isAdmin === true ||
    session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  if (!session || !isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { title, content } = req.body;

    if (!title && !content) {
      return res.status(400).json({
        error:
          "Please provide at least a title or content snippet to suggest descriptions.",
      });
    }

    // Construct the prompt for Gemini
    // Focus on SEO and preview suitability
    const prompt = `
      Act as Karthik Nishanth, a skilled technical writer who crafts compelling meta descriptions that both rank well in search engines and drive clicks. Your meta descriptions should:

      Context:
      Title: ${title || "N/A"}
      Content Snippet: ${content ? content.substring(0, 800) + "..." : "N/A"}

      Guidelines for effective meta descriptions:
      - Length: Between 120 and 155 characters (critical for search snippet display)
      - Clarity: Clearly communicate what the reader will learn/gain
      - Appeal: Spark curiosity or address a specific pain point
      - Keywords: Include primary keywords naturally (don't keyword stuff)
      - Voice: Match the tone of the blog post (technical but accessible)
      - Value: Promise specific, actionable takeaways
      - Uniqueness: Sound like it was written by a human expert, not AI

      Your audience consists of:
      - Developers seeking to improve their skills
      - Engineering leads evaluating technologies
      - Students learning web development
      - Business stakeholders making tech decisions

      Meta descriptions should:
      - Start with a benefit or intriguing statement
      - Include a specific number when relevant (e.g., "5 techniques", "3 mistakes")
      - Use active voice and strong verbs
      - Create a sense of urgency or relevance when appropriate
      - Avoid generic phrases like "Learn more" or "Find out how"

      Examples of effective meta descriptions:
      "Master React performance with these 5 proven techniques that boosted our app speed by 60%"
      "Avoid these 3 common database design mistakes that cost startups millions in scaling issues"
      "The one Next.js feature you're missing that could cut your build times in half"

      Output format:
      - Provide exactly 3 meta descriptions
      - Each description on a new line
      - No numbering, labels, explanations, or any other text
      - Each description must be between 120-155 characters

      Suggested Descriptions (each on a new line):
    `;

    // Configure Gemini call
    const generationConfig = {
      temperature: 0.6, // Allow for some creativity
      maxOutputTokens: 500, // Enough for a few descriptions
    };

    // Call the Gemini utility function
    const suggestionsString = await callGemini(prompt, generationConfig);

    // Process the response string into an array (split by newline)
    const suggestedDescriptions = suggestionsString
      .split("\n")
      .map((desc) => desc.trim()) // Trim whitespace
      .filter((desc) => desc && desc.length > 10); // Filter out empty lines or very short strings

    if (!suggestedDescriptions || suggestedDescriptions.length === 0) {
      console.warn("Gemini returned no valid description suggestions for:", {
        title,
      });
      return res.status(200).json({ success: true, suggestions: [] }); // Return empty array
    }

    return res
      .status(200)
      .json({ success: true, suggestions: suggestedDescriptions });
  } catch (error) {
    console.error("Error suggesting descriptions:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error generating description suggestions.",
      error: error.message,
    });
  }
}

