import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { callGemini } from "@/lib/gemini";

// Main handler function
export default async function handler(req, res) {
  // 1. Authentication
  const session = await getServerSession(req, res, authOptions);
  const isAdmin =
    session?.user?.role === "admin" ||
    session?.user?.isAdmin === true ||
    session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  if (!session || !isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }

  // 2. Method Check
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // 3. Get Input Context
  try {
    const { textBeforeCursor } = req.body;

    if (
      !textBeforeCursor ||
      typeof textBeforeCursor !== "string" ||
      !textBeforeCursor.trim()
    ) {
      return res
        .status(400)
        .json({ error: "Text context is required and must be non-empty." });
    }

    // Limit context length if necessary (e.g., last 500 chars)
    const context = textBeforeCursor.slice(-500);

    // 4. Construct Prompt for AI
    const completionPrompt = `
      You are an AI assistant helping a user write content.
      Given the following text context, provide a short, natural-sounding completion for the current sentence or thought.
      Focus on completing the immediate phrase or sentence logically.
      Do not start a new paragraph or add extra formatting.
      Output *only* the suggested completion text.

      Context:
      ---
      ${context}
      ---

      Completion:
    `;

    // 5. Call AI (Gemini)
    const generationConfig = {
      temperature: 0.6, // Slightly creative but still grounded
      maxOutputTokens: 50, // Keep completions relatively short
      stopSequences: ["\n", ".", "?", "!"], // Stop at sentence endings or newlines
    };

    const completion = await callGemini(completionPrompt, generationConfig);

    // Clean up the completion slightly (remove leading/trailing spaces)
    const trimmedCompletion = completion?.trim() || "";

    // 6. Return Response
    return res
      .status(200)
      .json({ success: true, completion: trimmedCompletion });
  } catch (error) {
    console.error("Error in sentence completion API:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error generating sentence completion",
    });
  }
}
