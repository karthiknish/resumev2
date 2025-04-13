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
      Based on the following blog post title and content snippet, suggest 5-7 relevant keywords or tags suitable for SEO and categorization.
      Focus on specific technologies, concepts, and the main topic. Avoid overly generic terms unless highly relevant.

      Title: "${title || "Untitled Post"}"
      Content Snippet: "${(contentSnippet || "").substring(0, 500)}..."

      Output Format: Provide the keywords/tags as a JSON array of strings. Example: ["react", "nextjs", "server components", "web development", "tutorial"]
      Output *only* the JSON array.
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
