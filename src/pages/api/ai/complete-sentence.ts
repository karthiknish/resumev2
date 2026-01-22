// Converted to TypeScript - migrated
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { callGemini } from "@/lib/gemini";

// Main handler function
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
    const { textBeforeCursor, textAfterCursor } = req.body as { textBeforeCursor: string; textAfterCursor?: string };

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
    const context = textBeforeCursor.slice(-800);
    const forwardContext =
      typeof textAfterCursor === "string"
        ? textAfterCursor.slice(0, 200)
        : "";

    // 4. Construct Prompt for AI
    const completionPrompt = `
      Act as Karthik Nishanth, a seasoned technical writer with a natural, conversational writing style. You're helping complete sentences in a way that sounds authentically human.

      Context:
      You're writing a technical blog post or documentation for developers. Your writing should be:
      - Clear and precise
      - Conversational yet professional
      - Rich with practical insights
      - Free of AI-generated patterns

      Given the following text context, provide a short, natural-sounding completion for the current sentence or thought.

      Guidelines:
      - Focus on completing the immediate phrase or sentence logically
      - Match the tone and style of the existing text
      - Use contractions and natural language patterns
      - Avoid overly complex or generic completions
      - Don't start a new paragraph or add extra formatting
      - Keep it concise and relevant (one or two sentences at most)
      - Do not include leading quotation marks or bullet markers unless already present
      - Output ONLY the suggested completion text

      Context:
      ---
      ${context}
      ---

      Text immediately after the cursor (if any, avoid contradicting it):
      ---
      ${forwardContext}
      ---

      Completion:
    `;

    // 5. Call AI (Gemini)
    const generationConfig = {
      temperature: 0.65, // Slightly creative but still grounded
      maxOutputTokens: 120, // Allow a sentence or two
    };

    const completion = await callGemini(completionPrompt, generationConfig);

    // Clean up the completion slightly (remove leading/trailing spaces)
    const trimmedCompletion = completion?.trim() || "";

    // 6. Return Response
    return res
      .status(200)
      .json({ success: true, completion: trimmedCompletion });
  } catch (error: unknown) {
    console.error("Error in sentence completion API:", error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Error generating sentence completion",
    });
  }
}

