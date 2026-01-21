// Converted to TypeScript - migrated
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { callGemini } from "@/lib/gemini";

// Helper function to check admin status
async function isAdminUser(req, res) {
  const session = await getServerSession(req, res, authOptions);
  return (
    session?.user?.role === "admin" ||
    session?.user?.isAdmin === true ||
    session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
  );
}

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated" });
  }
  const isAdmin = await isAdminUser(req, res);
  if (!isAdmin) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  const { title, contentSnippet } = req.body;

  if (!title && !contentSnippet) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Title or content snippet is required.",
      });
  }

  try {
    const prompt = `
      Act as Karthik Nishanth, a seasoned full-stack developer and technical content creator who understands both SEO and developer needs. Your goal is to suggest highly relevant keywords that will:
      - Help the blog post rank well in search engines
      - Attract the right audience (developers, tech leads, engineering managers)
      - Accurately represent the content's focus
      - Include both broad and specific terms

      You're analyzing a blog post for karthiknish.com, a technical blog focused on web development, software architecture, and career growth in tech.

      Context:
      Title: "${title || "Untitled Post"}"
      Content Snippet: "${(contentSnippet || "").substring(0, 500)}..."

      Guidelines for keyword selection:
      1. Include primary technology names (e.g., "React", "Next.js", "Node.js")
      2. Add specific concepts or patterns (e.g., "Server Components", "State Management")
      3. Consider problem-solving terms (e.g., "Performance Optimization", "Debugging")
      4. Include broader category terms (e.g., "Web Development", "Frontend", "Backend")
      5. Add audience-focused terms when relevant (e.g., "Tutorial", "Best Practices", "Guide")
      6. Think about search intent - what would someone type to find this content?
      7. Avoid overly generic terms unless they're highly relevant
      8. Prioritize terms that are actually mentioned in the content

      Output Format: 
      Provide exactly 6-8 keywords as a clean JSON array of strings.
      Example: ["react", "nextjs", "server components", "web development", "performance optimization", "tutorial", "frontend", "best practices"]
      
      Output ONLY the JSON array with no additional text, explanations, or formatting.
    `;

    const generationConfig = {
      temperature: 0.6,
      maxOutputTokens: 256,
    };

    const keywordsJsonString = await callGemini(
      prompt,
      generationConfig,
      "application/json"
    );

    try {
      // Remove code block markers if present
      let cleaned = keywordsJsonString.trim();
      if (cleaned.startsWith("```json")) {
        cleaned = cleaned.slice(7);
      }
      if (cleaned.startsWith("```")) {
        cleaned = cleaned.slice(3);
      }
      if (cleaned.endsWith("```")) {
        cleaned = cleaned.slice(0, -3);
      }
      cleaned = cleaned.trim();

      let keywords = JSON.parse(cleaned);
      if (
        !Array.isArray(keywords) ||
        keywords.some((k) => typeof k !== "string")
      ) {
        throw new Error(
          "API did not return a valid JSON array of strings for keywords."
        );
      }
      // Filter out invalid suggestions (code block markers, empty, whitespace)
      keywords = keywords.filter(
        (k) =>
          k &&
          typeof k === "string" &&
          !k.trim().startsWith("```") &&
          k.trim() !== "" &&
          k.trim() !== "[" &&
          k.trim() !== "]"
      );
      res.status(200).json({ success: true, suggestions: keywords });
    } catch (parseError) {
      console.error(
        "Failed to parse Gemini keyword response as JSON:",
        keywordsJsonString,
        parseError
      );
      // Fallback: Try to extract comma-separated values or lines if JSON fails
      const lines = keywordsJsonString
        .split(/[\n,]/)
        .map((k) =>
          k
            .trim()
            .replace(/^["'-]/, "")
            .replace(/["'-]$/, "")
        )
        .filter((k) => k && k.length < 50);
      if (lines.length > 0) {
        console.warn(
          "Could not parse JSON, using extracted lines/CSV as keyword suggestions."
        );
        // Filter out invalid suggestions (code block markers, empty, whitespace)
        const filteredLines = lines.filter(
          (k) =>
            k &&
            typeof k === "string" &&
            !k.trim().startsWith("```") &&
            k.trim() !== "" &&
            k.trim() !== "[" &&
            k.trim() !== "]"
        );
        res
          .status(200)
          .json({ success: true, suggestions: filteredLines.slice(0, 7) }); // Limit fallback results
      } else {
        throw new Error(
          "Response from AI model was not valid JSON or extractable keywords."
        );
      }
    }
  } catch (error) {
    console.error("Error calling Gemini for keyword suggestions:", error);
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Failed to generate keyword suggestions.",
      });
  }
}

