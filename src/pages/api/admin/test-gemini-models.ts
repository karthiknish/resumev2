import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

interface RateLimitRecord {
  count: number;
  firstRequest: number;
}

async function isAdminUser(req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
  const session = await getServerSession(req, res, authOptions);
  return (
    (session?.user as { role?: string; isAdmin?: boolean })?.role === "admin" ||
    (session?.user as { role?: string; isAdmin?: boolean })?.isAdmin === true ||
    session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
  );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
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

  const modelToTest = req.query.model || "gemini-1.5-flash-latest";
  const modelDisplayName = modelToTest.includes("pro")
    ? "Gemini Pro"
    : modelToTest.includes("flash")
    ? "Gemini Flash"
    : "Gemini (Default)";

  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is not set.");
    }

    const testPrompt =
      "Briefly explain what a large language model is in one sentence.";
    const generationConfig = { temperature: 0.2, maxOutputTokens: 64 };
    const apiVersion = "v1beta";
    const geminiUrl = `https://generativelanguage.googleapis.com/${apiVersion}/models/${modelToTest}:generateContent`;

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: testPrompt }] }],
        generationConfig,
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data?.error?.message || "Gemini API request failed");
    }

    res.status(200).json({
      success: true,
      message: `${modelDisplayName} Operational`,
      model: modelToTest,
    });
  } catch (error: unknown) {
    console.error(`Error testing Gemini model (${modelDisplayName}):`, error);
    res.status(500).json({
      success: false,
      message: `Error testing ${modelDisplayName}: ${error instanceof Error ? error.message : "Unknown error"}`,
    });
  }
}
