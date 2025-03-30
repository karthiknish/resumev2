import { callGemini } from "@/lib/gemini";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

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
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  // Admin check
  const isAdmin = await isAdminUser(req, res);
  if (!isAdmin) {
    return res
      .status(403)
      .json({ success: false, message: "Forbidden: Admin access required" });
  }

  const { topic, keywords, tone = "professional", numIdeas = 5 } = req.body;

  if (!topic && (!keywords || keywords.length === 0)) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide a topic or keywords." });
  }

  try {
    const prompt = `
            Generate ${numIdeas} distinct LinkedIn post ideas based on the following information. Each idea should be engaging and suitable for a professional audience on LinkedIn, aiming to showcase expertise and drive engagement for a Full Stack Developer & Cloud Specialist (Karthik Nishanth).

            **Core Topic/Goal:** ${topic || "General Tech/Freelancing Insights"}
            ${
              keywords && keywords.length > 0
                ? `**Keywords:** ${keywords.join(", ")}`
                : ""
            }
            **Desired Tone:** ${tone}

            **For each idea, provide:**
            1.  **Hook:** A compelling opening sentence or question (max 1-2 sentences).
            2.  **Core Message:** The main point or value proposition (2-4 sentences).
            3.  **Call to Action (Optional but Recommended):** A question to encourage comments, an invitation to connect, or a link suggestion (e.g., to a relevant blog post).
            4.  **Suggested Hashtags:** 3-5 relevant hashtags.

            **Example Areas of Expertise to Draw From (if applicable):**
            *   React, Next.js, Node.js, TypeScript
            *   AWS, Azure, Vercel, Cloud Architecture
            *   API Development, Database Design (MongoDB, PostgreSQL)
            *   Web Performance, SEO Fundamentals
            *   Freelancing, Technical Consulting

            **Output Format:**
            Provide the ideas as a JSON array, where each object has keys: "hook", "coreMessage", "callToAction", "hashtags".

            **Example Idea Structure:**
            {
                "hook": "Struggling with slow loading times on your Next.js app?",
                "coreMessage": "Web performance isn't just about speed; it's about user experience and conversions. I recently optimized a client's site, reducing load time by 60% using techniques like image optimization and code splitting.",
                "callToAction": "What are your biggest performance challenges? Share below! #webperf",
                "hashtags": ["#nextjs", "#webperf", "#fullstackdev", "#reactjs", "#optimization"]
            }

            Generate ${numIdeas} ideas now. Output *only* the JSON array.
        `;

    const generationConfig = {
      temperature: 0.8, // Slightly more creative for ideas
      maxOutputTokens: 2048, // Allow longer response for multiple ideas
    };

    // Ensure the response is treated as JSON
    const ideasJsonString = await callGemini(
      prompt,
      generationConfig,
      "application/json"
    );

    // Attempt to parse the JSON string
    try {
      const ideas = JSON.parse(ideasJsonString);
      if (!Array.isArray(ideas)) {
        throw new Error("API did not return a valid JSON array.");
      }
      res.status(200).json({ success: true, ideas: ideas });
    } catch (parseError) {
      console.error(
        "Failed to parse Gemini response as JSON:",
        ideasJsonString,
        parseError
      );
      // Attempt to extract JSON from potentially messy output
      const jsonMatch = ideasJsonString.match(/\[[\s\S]*\]/);
      if (jsonMatch && jsonMatch[0]) {
        try {
          const ideasFallback = JSON.parse(jsonMatch[0]);
          if (!Array.isArray(ideasFallback)) {
            throw new Error(
              "Fallback JSON extraction did not result in an array."
            );
          }
          console.warn("Successfully parsed JSON using fallback extraction.");
          res.status(200).json({ success: true, ideas: ideasFallback });
        } catch (fallbackParseError) {
          console.error(
            "Fallback JSON parsing also failed:",
            fallbackParseError
          );
          throw new Error("Failed to parse response from AI model.");
        }
      } else {
        throw new Error("Response from AI model was not valid JSON.");
      }
    }
  } catch (error) {
    console.error("Error calling Gemini for LinkedIn ideas:", error);
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Failed to generate LinkedIn post ideas.",
      });
  }
}
