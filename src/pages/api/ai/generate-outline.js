import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  // Check for authenticated session
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Basic admin check
  const isAdmin =
    session?.user?.role === "admin" ||
    session?.user?.isAdmin === true ||
    session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  if (!isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { topic } = req.body;

    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return res.status(400).json({
        success: false,
        message: "Topic is required to generate an outline.",
      });
    }

    // Construct the prompt for Gemini
    const prompt = `
      Generate a blog post outline for the topic: "${topic}".
      The outline should include:
      1. An engaging and SEO-friendly Title.
      2. 3-5 relevant main section Headings.

      Format the output strictly as follows, with each item on a new line:
      Title: [Generated Title]
      Heading: [Generated Heading 1]
      Heading: [Generated Heading 2]
      Heading: [Generated Heading 3]
      ... (up to 5 headings)

      Do not include any extra text, explanations, or markdown formatting like #.
    `;

    // Call Google's Gemini API
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.6, // Balanced temperature for creative but relevant outline
            maxOutputTokens: 500,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini Outline API Error:", data);
      throw new Error(
        data?.error?.message ||
          `Gemini outline request failed with status ${response.status}`
      );
    }

    if (
      !data.candidates ||
      !data.candidates[0] ||
      !data.candidates[0].content ||
      !data.candidates[0].content.parts ||
      !data.candidates[0].content.parts[0]
    ) {
      console.error("Unexpected Gemini outline response structure:", data);
      throw new Error("Invalid response structure from AI outline model.");
    }

    const outlineText = data.candidates[0].content.parts[0].text.trim();

    // Parse the structured text
    const lines = outlineText.split("\n");
    let title = topic; // Default title
    const headings = [];

    lines.forEach((line) => {
      if (line.toLowerCase().startsWith("title:")) {
        title = line.substring(6).trim();
      } else if (line.toLowerCase().startsWith("heading:")) {
        headings.push(line.substring(8).trim());
      }
    });

    if (headings.length === 0) {
      // Fallback if parsing fails - maybe the model didn't follow instructions
      console.warn(
        "Could not parse headings from outline response:",
        outlineText
      );
      // Attempt a simpler split or return an error/default
    }

    return res.status(200).json({
      success: true,
      outline: {
        title: title || topic, // Ensure title is never empty
        headings: headings,
      },
    });
  } catch (error) {
    console.error("Outline generation error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error generating outline",
    });
  }
}
