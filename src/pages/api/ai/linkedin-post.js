// src/pages/api/ai/linkedin-post.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { callGemini } from "@/lib/gemini";

const POST_TYPES = {
  insight: "Share a professional insight or observation",
  story: "Tell a personal story with a lesson",
  tutorial: "Provide a quick how-to or tip",
  opinion: "Express a thought-provoking opinion",
  celebration: "Celebrate an achievement or milestone",
};

const TONES = {
  professional: "Professional and polished",
  casual: "Casual and conversational",
  thoughtful: "Thoughtful and reflective",
  inspiring: "Inspiring and motivational",
  educational: "Educational and informative",
};

export default async function handler(req, res) {
  // Localhost bypass for development testing
  const host = req.headers.host || "";
  const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");
  
  // Check for authenticated session (skip in dev if localhost)
  const session = await getServerSession(req, res, authOptions);
  
  if (!session && !isLocalhost) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Basic admin check (bypass on localhost for testing)
  const isAdmin =
    isLocalhost ||
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
    const {
      topic,
      postType = "insight",
      tone = "professional",
      length = "medium",
      includeHashtags = true,
      includeCta = true,
      context = "",
    } = req.body;

    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return res.status(400).json({
        success: false,
        message: "Topic is required",
      });
    }

    const lengthGuide = {
      short: "Keep it concise - around 100-150 words. Punchy and impactful.",
      medium: "Aim for 200-300 words. Well-developed but scannable.",
      long: "Write 400-600 words. Comprehensive with clear sections and line breaks.",
    };

    const prompt = `
You are Karthik Nishanth, a full-stack developer with 8+ years of experience building web applications. You're known for your authentic, engaging presence on LinkedIn where you share insights about:
- Web development (React, Next.js, Node.js)
- Cloud architecture and DevOps
- Building products and startups
- Career growth in tech
- AI/ML integration in applications

**Your LinkedIn Writing Style:**
- You write like you're talking to a friend, not a corporate audience
- You use short paragraphs and line breaks for readability
- You start with a hook that grabs attention (a bold statement, question, or personal anecdote)
- You share real experiences and lessons learned, not generic advice
- You're not afraid to be vulnerable or admit mistakes
- You use occasional emojis naturally (not excessively)
- You ask questions to invite engagement
- You avoid corporate buzzwords and jargon
- You sometimes use humor to make points memorable

**Post Type:** ${POST_TYPES[postType] || POST_TYPES.insight}
**Tone:** ${TONES[tone] || TONES.professional}
**Length:** ${lengthGuide[length] || lengthGuide.medium}

**Topic/Theme:** "${topic.trim()}"
${context ? `**Additional Context:** ${context}` : ""}

**Instructions:**
1. Write an engaging LinkedIn post about this topic
2. Start with a strong hook (first line should grab attention)
3. Use short paragraphs with line breaks between them
4. Include a personal angle or story when possible
5. End with a question or call-to-action to encourage engagement
${includeHashtags ? "6. Add 3-5 relevant hashtags at the end" : "6. Do NOT include hashtags"}
${includeCta ? "7. Include a soft call-to-action (question, invitation to share, etc.)" : ""}

**Output Format:**
Return ONLY the LinkedIn post text. No explanations, no "Here's the post:", just the actual post content ready to copy-paste.
Use line breaks (double newlines) between paragraphs for proper LinkedIn formatting.
`;

    const generationConfig = {
      temperature: 0.85,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    };

    const generatedPost = await callGemini(prompt, generationConfig);

    // Clean up the response
    let cleanedPost = generatedPost
      .trim()
      .replace(/^["']|["']$/g, "") // Remove surrounding quotes if any
      .replace(/^Here's.*?:\s*/i, "") // Remove preamble
      .replace(/^LinkedIn Post:\s*/i, ""); // Remove "LinkedIn Post:" prefix

    // Extract hashtags if present
    const hashtagMatch = cleanedPost.match(/(#\w+\s*)+$/);
    const hashtags = hashtagMatch
      ? hashtagMatch[0]
          .trim()
          .split(/\s+/)
          .filter((h) => h.startsWith("#"))
      : [];

    return res.status(200).json({
      success: true,
      post: cleanedPost,
      hashtags,
      metadata: {
        postType,
        tone,
        length,
        topic: topic.trim(),
      },
    });
  } catch (error) {
    console.error("LinkedIn post generation error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error generating LinkedIn post",
    });
  }
}
