// Converted to TypeScript - migrated
// src/pages/api/ai/suggest-categories.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { callGemini } from "@/lib/gemini"; // Assuming callGemini is in this path

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
      return res
        .status(400)
        .json({
          error:
            "Please provide at least a title or content to suggest categories.",
        });
    }

    // Construct the prompt for Gemini
    const prompt = `
      Analyze the following blog post title and content (content is optional, prioritize title if both provided).
      Suggest 3-5 relevant, concise, single-word or two-word categories for this blog post.
      Format the output as a simple comma-separated list (e.g., "Web Development, JavaScript, React, Tutorial").
      Do not add any introductory text, explanations, or labels. Just the comma-separated list.

      Title: ${title || "N/A"}
      Content Snippet (Optional): ${
        content ? content.substring(0, 500) + "..." : "N/A"
      }

      Suggested Categories (comma-separated):
    `;

    // Configure Gemini call (low temperature for more predictable category names)
    const generationConfig = {
      temperature: 0.3,
      maxOutputTokens: 100,
    };

    // Call the Gemini utility function
    const suggestionsString = await callGemini(prompt, generationConfig);

    // Process the response string into an array
    const suggestedCategories = suggestionsString
      .split(",")
      .map((cat) => cat.trim())
      .filter((cat) => cat); // Remove empty strings

    if (!suggestedCategories || suggestedCategories.length === 0) {
      console.warn("Gemini returned no valid category suggestions for:", {
        title,
      });
      return res.status(200).json({ success: true, suggestions: [] }); // Return empty array if no suggestions
    }

    return res
      .status(200)
      .json({ success: true, suggestions: suggestedCategories });
  } catch (error) {
    console.error("Error suggesting categories:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
  }
}

