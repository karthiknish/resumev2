import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { callGemini } from "@/lib/gemini";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

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
    const { topic, outline, tone, length, keywords } = req.body;

    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return res.status(400).json({
        success: false,
        message: "Topic is required",
      });
    }

    let effectiveOutline = outline;

    if (!effectiveOutline || !effectiveOutline.headings || effectiveOutline.headings.length === 0) {
      const outlinePrompt = `
        Act as Karthik Nishanth, an experienced technical writer and educator who creates comprehensive, reader-focused content outlines.

        Generate a logical and comprehensive blog post outline for the topic: "${topic}".

        Your outline should include:
        1. An engaging and SEO-friendly Title that:
           - Accurately reflects the topic
           - Includes relevant keywords
           - Sparks curiosity or addresses a clear need
           - Is under 60 characters for optimal SEO

        2. 4-5 main section Headings that:
           - Cover the key aspects of the topic in a logical flow
           - Are descriptive and promise value to the reader
           - Use a mix of how-to, explanation, and insight-focused titles
           - Progress from basic concepts to advanced applications

        Format the output strictly as follows:
        Title: [Generated Title]
        Heading: [Generated Heading 1]
        Heading: [Generated Heading 2]
        Heading: [Generated Heading 3]
        Heading: [Generated Heading 4]
        Heading: [Generated Heading 5]

        Do not include any introduction, conclusion, or markdown formatting (#).
      `;

      const outlineText = await callGemini(outlinePrompt, {
        temperature: 0.6,
        maxOutputTokens: 500,
      });

      const lines = outlineText.split("\n");
      let title = topic;
      const headings = [];

      lines.forEach((line) => {
        const trimmedLine = line.trim();
        if (trimmedLine.toLowerCase().startsWith("title:")) {
          title = trimmedLine.substring(6).trim();
        } else if (trimmedLine.toLowerCase().startsWith("heading:")) {
          const heading = trimmedLine.substring(8).trim();
          if (heading) {
            headings.push(heading);
          }
        }
      });

      effectiveOutline = {
        title: title || topic,
        headings,
      };
    }

    if (!effectiveOutline.headings || effectiveOutline.headings.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate outline headings",
      });
    }

    const sections = [];

    for (let i = 0; i < effectiveOutline.headings.length; i++) {
      const heading = effectiveOutline.headings[i];
      const isIntroduction = i === 0;
      const isConclusion = i === effectiveOutline.headings.length - 1;

      let sectionPrompt;

      if (isIntroduction) {
        sectionPrompt = `
          Act as Karthik Nishanth, a seasoned full-stack developer and technical writer.

          Write an engaging introduction for a blog post about: "${effectiveOutline.title}"

          The main section headings will be:
          ${effectiveOutline.headings.join("\n          ")}

          Instructions for the introduction:
          - Hook the reader with a relatable problem or intriguing question
          - Briefly introduce what this post will cover
          - Make it personal and conversational
          - Build anticipation for what's coming next
          - Use a ${tone || "friendly, professional"} tone
          - Length: ${length ? Math.floor(parseInt(length) * 0.15) : 120} words

          Output only the HTML content wrapped in <p> tags (1-2 paragraphs).
          Do not include the section heading.
        `;
      } else if (isConclusion) {
        sectionPrompt = `
          Act as Karthik Nishanth, a seasoned full-stack developer and technical writer.

          Write a thoughtful conclusion for a blog post about: "${effectiveOutline.title}"

          The section covered was: "${heading}"

          Instructions for the conclusion:
          - Summarize the key takeaways without repeating everything
          - Provide actionable next steps for the reader
          - End with an inspiring or thought-provoking statement
          - Use a ${tone || "friendly, professional"} tone
          - Length: ${length ? Math.floor(parseInt(length) * 0.1) : 80} words
          ${keywords && keywords.length > 0 ? `- Naturally integrate keywords: ${keywords.join(", ")}` : ""}

          Output only the HTML content wrapped in <p> tags (1 paragraph).
          Do not include the section heading.
        `;
      } else {
        sectionPrompt = `
          Act as Karthik Nishanth, a seasoned full-stack developer and technical writer.

          Write a comprehensive section for a blog post about: "${effectiveOutline.title}"

          Section heading: "${heading}"

          Context:
          - Tone: ${tone || "friendly, professional"}
          - Length: ${length ? Math.floor(parseInt(length) / effectiveOutline.headings.length) : 150} words
          ${keywords && keywords.length > 0 ? `- Keywords: ${keywords.join(", ")}` : ""}

          Instructions:
          - Expand on the heading with detailed, informative content
          - Include practical examples or code snippets if relevant
          - Explain not just "how" but "why"
          - Use real-world analogies to explain complex concepts
          - Keep it engaging and conversational
          - Avoid fluff - focus on value

          Output only the HTML content with the following structure:
          <h2>${heading}</h2>
          <p>Your content here...</p>
          <p>Additional paragraphs as needed...</p>

          Do not include any preamble or explanations outside the HTML.
        `;
      }

      try {
        const sectionContent = await callGemini(sectionPrompt, {
          temperature: 0.7,
          maxOutputTokens: 2048,
        });

        const cleanedContent = sectionContent
          .replace(/^\s*```(?:html)?\s*\n?|\s*\n?```\s*$/g, "")
          .trim();

        sections.push({
          heading,
          content: cleanedContent,
          order: i + 1,
        });
      } catch (error) {
        console.error(`Error generating section ${i + 1}:`, error);
        sections.push({
          heading,
          content: `<p><em>[Section generation failed: ${error.message}]</em></p>`,
          order: i + 1,
          error: error.message,
        });
      }
    }

    const fullContent = sections
      .map((section) => section.content)
      .join("\n\n");

    return res.status(200).json({
      success: true,
      data: {
        title: effectiveOutline.title,
        outline: effectiveOutline,
        sections,
        fullContent,
      },
    });
  } catch (error) {
    console.error("Sectional generation error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error generating blog content",
    });
  }
}
