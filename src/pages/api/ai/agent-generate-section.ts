import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { callGemini } from "@/lib/gemini";

interface StyleConfig {
  tone?: string;
  audience?: string;
}

interface AgentGenerateSectionRequest {
  sectionId: string;
  sectionHeading: string;
  sectionPoints?: string[];
  blogTitle: string;
  styleConfig?: StyleConfig;
}

interface GeneratedSection {
  sectionId: string;
  heading: string;
  content: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const isAdmin =
    (session?.user as { role?: string; isAdmin?: boolean })?.role === "admin" ||
    (session?.user as { role?: string; isAdmin?: boolean })?.isAdmin === true ||
    session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  if (!isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { sectionId, sectionHeading, sectionPoints, blogTitle, styleConfig } = req.body as AgentGenerateSectionRequest;

    if (!sectionId || !sectionHeading || !blogTitle) {
      return res.status(400).json({ message: "Missing required fields: sectionId, sectionHeading, blogTitle" });
    }

    const tone = styleConfig?.tone || 'professional';
    const audience = styleConfig?.audience || 'developers';

    const toneInstructions: Record<string, string> = {
      professional: "Use a professional, polished tone with industry-standard terminology.",
      casual: "Use a relaxed, conversational tone with informal language and expressions.",
      friendly: "Use a warm, approachable tone that feels like a helpful friend giving advice.",
      authoritative: "Use an authoritative, expert tone that demonstrates deep knowledge and confidence.",
      humorous: "Use a playful tone with appropriate humor, wit, and light-hearted observations.",
      technical: "Use a highly technical tone with precise terminology and deep technical details."
    };

    const audienceInstructions: Record<string, string> = {
      developers: "Write for experienced developers who understand technical concepts and jargon.",
      beginners: "Write for beginners who are new to the topic. Explain concepts clearly without assuming prior knowledge.",
      executives: "Write for business executives and decision-makers. Focus on business value, ROI, and strategic implications.",
      general: "Write for a general audience. Avoid jargon and explain technical concepts in simple terms.",
      students: "Write for students who are learning. Include educational explanations and learning-friendly examples."
    };

    const pointsText = sectionPoints && sectionPoints.length > 0
      ? sectionPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')
      : '';

    const generationConfig = {
      temperature: 0.8,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 4096,
    };

    const prompt = `
      Act as Karthik Nishanth, a seasoned full-stack developer with over 8 years of experience building web applications. You're writing a blog post titled "${blogTitle}".

      **Your Task:**
      Write
      content for
      following section:

      **Section Heading:** ${sectionHeading}

      ${pointsText ? `**Key Points to Cover:**
${pointsText}
` : ''}

      **Style Guidelines:**
      - Tone: ${toneInstructions[tone] || toneInstructions.professional}
      - Audience: ${audienceInstructions[audience] || audienceInstructions.developers}

      **Writing Style:**
      - Use contractions (don't, can't, it's) to sound conversational
      - Vary sentence length for better rhythm
      - Ask rhetorical questions to engage readers
      - Include real-world analogies and metaphors
      - Address
      reader directly ("you")
      - Share personal insights to add authenticity

      **HTML Formatting Requirements:**
      - Start with a <h2> tag containing
      section heading: <h2>${sectionHeading}</h2>
      - Wrap paragraphs in <p> tags
      - Use <strong> for emphasis on key terms
      - Use <ul> and <li> for lists
      - Use <code> for inline code references
      - Use <pre><code> for code blocks when showing examples
      - Include practical examples or code snippets where relevant

      **Output Format:**
      Return your response as valid JSON with exactly this structure:
      {
        "sectionId": "${sectionId}",
        "heading": "${sectionHeading}",
        "content": "<h2>${sectionHeading}</h2><p>Your HTML content here...</p>"
      }

      Return ONLY
      JSON object, no additional text or markdown code blocks.
    `;

    console.log(`[Agent Section] Generating section: ${sectionHeading}`);
    const rawResponse = await callGemini(prompt, generationConfig);
    console.log("[Agent Section] Raw response received");

    let parsedResponse: GeneratedSection;
    try {
      const cleanedResponse = rawResponse
        .replace(/^```(?:json)?\s*\n?/i, "")
        .replace(/\n?```\s*$/i, "")
        .trim();

      parsedResponse = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("[Agent Section] Failed to parse response as JSON:", parseError);
      console.error("[Agent Section] Raw response:", rawResponse.substring(0, 500));

      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsedResponse = JSON.parse(jsonMatch[0]);
        } catch (e) {
          parsedResponse = {
            sectionId: sectionId,
            heading: sectionHeading,
            content: `<h2>${sectionHeading}</h2>
<p>${rawResponse.substring(0, 1000)}</p>`
          };
        }
      } else {
        parsedResponse = {
          sectionId: sectionId,
          heading: sectionHeading,
          content: `<h2>${sectionHeading}</h2>
<p>${rawResponse.substring(0, 1000)}</p>`
        };
      }
    }

    if (!parsedResponse.content) {
      throw new Error("AI response missing content");
    }

    console.log(`[Agent Section] Generated section content (${parsedResponse.content.length} chars)`);

    return res.status(200).json({
      success: true,
      data: parsedResponse,
    });
  } catch (error: unknown) {
    console.error("[Agent Section] Error:", error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Error generating section content",
    });
  }
}
