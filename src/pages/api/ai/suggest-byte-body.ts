// Converted to TypeScript - migrated
import { callGemini } from "@/lib/gemini";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";

async function isAdminUser(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  return (
    (session?.user as { role?: string; isAdmin?: boolean })?.role === "admin" ||
    (session?.user as { role?: string; isAdmin?: boolean })?.isAdmin === true ||
    session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
  );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  const isAdmin = await isAdminUser(req, res);
  if (!isAdmin) {
    return res
      .status(403)
      .json({ success: false, message: "Forbidden: Admin access required" });
  }

  const { headline = "", numSuggestions = 3 } = req.body as { headline?: string; numSuggestions?: number };

  if (!headline) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Headline context is required to suggest body text.",
      });
  }

  try {
    const prompt = `
            Generate ${numSuggestions} short body text options (max 500 characters each) for a 'Byte' (a short-form update or insight) based on the following headline: "${headline}"

            The target audience is potential clients, recruiters, and other developers on a tech portfolio website (karthiknish.com).
            The tone should generally be informative and professional, but can vary slightly based on the headline.
            Expand on the headline, provide a brief insight, ask a question, or share a quick update related to it.
            Focus on topics like: Web Development, Cloud (AWS/Azure), React, Node.js, Freelancing, Tech News, Quick Tips.

            Output Format: Provide the body text options as a JSON array of strings.
            Example: ["Just deployed a new feature using serverless functions on AWS Lambda! Reduced costs by 20%. #aws #serverless", "Exploring the latest updates in Next.js 15. The new compiler looks promising for performance gains. #nextjs #webdev"]
            Output *only* the JSON array.
        `;

    const generationConfig = {
      temperature: 0.7,
      maxOutputTokens: 1024, // Allow enough tokens for multiple suggestions
      responseMimeType: "application/json",
    };

    const bodyJsonString = await callGemini(
      prompt,
      generationConfig
    );

    try {
      const bodies = JSON.parse(bodyJsonString);
      if (!Array.isArray(bodies) || bodies.some((b) => typeof b !== "string")) {
        throw new Error(
          "API did not return a valid JSON array of strings for body."
        );
      }
      res
        .status(200)
        .json({ success: true, suggestions: bodies.slice(0, numSuggestions) });
    } catch (parseError) {
      console.error(
        "Failed to parse Gemini body response as JSON:",
        bodyJsonString,
        parseError
      );
      // Attempt fallback extraction for simple string arrays
      const jsonMatch = bodyJsonString.match(
        /\[\s*"[^"]*"(?:\s*,\s*"[^"]*")*\s*\]/
      );
      if (jsonMatch && jsonMatch[0]) {
        try {
          const bodiesFallback = JSON.parse(jsonMatch[0]);
          if (
            !Array.isArray(bodiesFallback) ||
            bodiesFallback.some((b) => typeof b !== "string")
          ) {
            throw new Error(
              "Fallback JSON extraction did not result in an array of strings."
            );
          }
          console.warn(
            "Successfully parsed body JSON using fallback extraction."
          );
          res
            .status(200)
            .json({
              success: true,
              suggestions: bodiesFallback.slice(0, numSuggestions),
            });
        } catch (fallbackParseError) {
          console.error(
            "Fallback body JSON parsing also failed:",
            fallbackParseError
          );
          throw new Error("Failed to parse body response from AI model.");
        }
      } else {
        // Fallback: treat lines as suggestions if no JSON array found
        const lines = bodyJsonString
          .split("\n")
          .map((l) => l.replace(/^- /, "").trim())
          .filter((l) => l && l.length < 500);
        if (lines.length > 0) {
          console.warn(
            "Could not parse JSON, using extracted lines as body suggestions."
          );
          res
            .status(200)
            .json({
              success: true,
              suggestions: lines.slice(0, numSuggestions),
            });
        } else {
          throw new Error(
            "Response from AI model was not valid JSON or extractable lines."
          );
        }
      }
    }
  } catch (error: unknown) {
    console.error("Error calling Gemini for byte body suggestions:", error);
    res
      .status(500)
      .json({
        success: false,
        message: error instanceof Error ? error.message : "Failed to generate body suggestions.",
      });
  }
}

