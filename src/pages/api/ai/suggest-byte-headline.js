import { callGemini } from "@/lib/gemini";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

async function isAdminUser(req, res) {
  const session = await getServerSession(req, res, authOptions);
  return (
    session?.user?.role === "admin" ||
    session?.user?.isAdmin === true ||
    session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
  );
}

export default async function handler(req, res) {
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

  const { context = "", numSuggestions = 3 } = req.body; // Context could be the body text

  try {
    const prompt = `
            Generate ${numSuggestions} short, catchy, and informative headlines suitable for a 'Byte' (a short-form update or insight, max 200 chars) for a tech portfolio website (karthiknish.com).
            The target audience is potential clients, recruiters, and other developers.
            ${
              context
                ? `The headline should relate to the following context/body: "${context.substring(
                    0,
                    300
                  )}..."`
                : "Generate general tech/web development related headlines."
            }

            Keep headlines concise (ideally under 100 characters, max 200).
            Focus on topics like: Web Development, Cloud (AWS/Azure), React, Node.js, Freelancing, Tech News, Quick Tips.

            Output Format: Provide the headlines as a JSON array of strings. Example: ["New React Tip!", "AWS Cost Savings", "Freelancing Update"]
            Output *only* the JSON array.
        `;

    const generationConfig = {
      temperature: 0.75,
      maxOutputTokens: 512,
    };

    const headlinesJsonString = await callGemini(
      prompt,
      generationConfig,
      "application/json"
    );

    try {
      const headlines = JSON.parse(headlinesJsonString);
      if (
        !Array.isArray(headlines) ||
        headlines.some((h) => typeof h !== "string")
      ) {
        throw new Error("API did not return a valid JSON array of strings.");
      }
      res
        .status(200)
        .json({
          success: true,
          suggestions: headlines.slice(0, numSuggestions),
        }); // Ensure correct number
    } catch (parseError) {
      console.error(
        "Failed to parse Gemini headline response as JSON:",
        headlinesJsonString,
        parseError
      );
      // Attempt fallback extraction
      const jsonMatch = headlinesJsonString.match(
        /\[\s*"[^"]*"(?:\s*,\s*"[^"]*")*\s*\]/
      );
      if (jsonMatch && jsonMatch[0]) {
        try {
          const headlinesFallback = JSON.parse(jsonMatch[0]);
          if (
            !Array.isArray(headlinesFallback) ||
            headlinesFallback.some((h) => typeof h !== "string")
          ) {
            throw new Error(
              "Fallback JSON extraction did not result in an array of strings."
            );
          }
          console.warn(
            "Successfully parsed headline JSON using fallback extraction."
          );
          res
            .status(200)
            .json({
              success: true,
              suggestions: headlinesFallback.slice(0, numSuggestions),
            });
        } catch (fallbackParseError) {
          console.error(
            "Fallback headline JSON parsing also failed:",
            fallbackParseError
          );
          throw new Error("Failed to parse headline response from AI model.");
        }
      } else {
        // If no JSON array found, try to extract simple lines as fallback
        const lines = headlinesJsonString
          .split("\n")
          .map((l) => l.replace(/^- /, "").trim())
          .filter((l) => l && l.length < 200);
        if (lines.length > 0) {
          console.warn(
            "Could not parse JSON, using extracted lines as headline suggestions."
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
  } catch (error) {
    console.error("Error calling Gemini for byte headline suggestions:", error);
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Failed to generate headline suggestions.",
      });
  }
}
