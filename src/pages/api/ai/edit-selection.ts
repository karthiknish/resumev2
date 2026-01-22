// Converted to TypeScript - migrated
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { callGemini } from "@/lib/gemini";
import { NextApiRequest, NextApiResponse } from "next";

const ACTION_PROMPTS: Record<string, { prompt: string; temperature: number; maxOutputTokens: number }> = {
  rewrite: {
    prompt:
      "Rewrite the snippet to improve clarity and flow while keeping the original meaning, level of detail, and any inline formatting such as numbers or HTML tags.",
    temperature: 0.55,
    maxOutputTokens: 600,
  },
  simplify: {
    prompt:
      "Simplify the snippet so it is more direct and approachable for readers who might be new to the topic, without removing essential details or accuracy.",
    temperature: 0.5,
    maxOutputTokens: 450,
  },
  expand: {
    prompt:
      "Expand the snippet by adding depth, helpful context, and one concrete example. Keep the result within two short paragraphs and stay aligned with the existing tone.",
    temperature: 0.7,
    maxOutputTokens: 800,
  },
  shorten: {
    prompt:
      "Condense the snippet to roughly half its current length while preserving the key message and any critical data or references.",
    temperature: 0.45,
    maxOutputTokens: 400,
  },
  summarize: {
    prompt:
      "Summarize the snippet into two or three tight bullet points that capture the core ideas. Begin each bullet with '- ' and keep the language active and specific.",
    temperature: 0.5,
    maxOutputTokens: 350,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  const isAdmin =
    (session?.user as { role?: string; isAdmin?: boolean })?.role === "admin" ||
    (session?.user as { role?: string; isAdmin?: boolean })?.isAdmin === true ||
    session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  if (!session || !isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { mode, text, context } = (req.body || {}) as { mode: string; text: string; context?: string };

    if (typeof mode !== "string" || !(mode in ACTION_PROMPTS)) {
      return res.status(400).json({ message: "Unsupported AI edit mode." });
    }

    if (typeof text !== "string" || !text.trim()) {
      return res
        .status(400)
        .json({ message: "Selection text is required for AI editing." });
    }

    const action = ACTION_PROMPTS[mode];
    const trimmedText = text.trim();
    const truncatedText = trimmedText.length > 6000
      ? `${trimmedText.slice(0, 6000)}...`
      : trimmedText;
    const surroundingContext =
      typeof context === "string" ? context.trim().slice(-1200) : "";

    const contextSection = surroundingContext
      ? `Context from the rest of the article (use for tone and direction, do not copy verbatim):\n${surroundingContext}\n\n`
      : "";

    const prompt = `You are acting as the editorial voice of karthiknish.com, a modern web development blog written by Karthik Nishanth. The tone is expert yet friendly, with clear explanations and a focus on practicality. Keep contractions, avoid filler, and make sure the output reads like it was written by a human developer.\n\n${contextSection}Original snippet (between <<< and >>>):\n<<<\n${truncatedText}\n>>>\n\nTask: ${action.prompt}\n\nGuidelines:\n- Preserve any important numbers, terminology, HTML entities, and inline tags if present.\n- Do not include markdown code fences or explanations.\n- Return only the transformed text ready to drop back into the editor.`;

    const generationConfig = {
      temperature: action.temperature ?? 0.55,
      maxOutputTokens: action.maxOutputTokens ?? 600,
    };

    const rawResult = await callGemini(prompt, generationConfig);

    if (!rawResult) {
      throw new Error("AI did not return any content.");
    }

    const cleaned = rawResult
      .replace(/^```(?:html|markdown)?\n?|```$/g, "")
      .trim();

    if (!cleaned) {
      throw new Error("AI returned an empty response after cleaning.");
    }

    return res.status(200).json({ success: true, replacement: cleaned });
  } catch (error: unknown) {
    console.error("AI edit-selection error:", error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Error processing AI edit request",
    });
  }
}

