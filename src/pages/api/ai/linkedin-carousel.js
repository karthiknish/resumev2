// src/pages/api/ai/linkedin-carousel.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

// Design tokens from website
const DESIGN = {
  backgroundColor: "#0f172a", // Dark slate
  accentColor: "#3b82f6",     // Blue
  textColor: "#f8fafc",       // Light white
  headingFont: "Instrument Serif",
  bodyFont: "Inter",
  aspectRatio: "4:5",
};

export default async function handler(req, res) {
  // Localhost bypass for development testing
  const host = req.headers.host || "";
  const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");

  const session = await getServerSession(req, res, authOptions);

  if (!session && !isLocalhost) {
    return res.status(401).json({ message: "Unauthorized" });
  }

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
    const { topic, slideCount = 5, slideContents = null } = req.body;

    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return res.status(400).json({
        success: false,
        message: "Topic is required",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "GEMINI_API_KEY not configured",
      });
    }

    // Step 1: Generate slide content if not provided
    let slides = slideContents;
    if (!slides) {
      slides = await generateSlideContent(apiKey, topic.trim(), slideCount);
    }

    // Step 2: Generate images for each slide
    const images = await generateSlideImages(apiKey, slides);

    return res.status(200).json({
      success: true,
      slides,
      images,
      metadata: {
        topic: topic.trim(),
        slideCount: slides.length,
        design: DESIGN,
      },
    });
  } catch (error) {
    console.error("LinkedIn carousel generation error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error generating carousel",
    });
  }
}

// Generate slide content using Gemini text model
async function generateSlideContent(apiKey, topic, slideCount) {
  const prompt = `Create content for a ${slideCount}-slide LinkedIn carousel about: "${topic}"

Requirements:
- Slide 1: Cover slide with a catchy title and subtitle
- Slides 2-${slideCount - 1}: Main content slides with numbered tips/points
- Slide ${slideCount}: Closing slide with call-to-action

For each slide, provide:
- slideNumber: number
- heading: short bold heading (max 10 words)
- body: supporting text (max 50 words)
- hasNumber: boolean (true if it's a numbered tip)

Return ONLY valid JSON array, no markdown, no explanation:
[{"slideNumber": 1, "heading": "...", "body": "...", "hasNumber": false}, ...]`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Failed to generate slide content");
  }

  const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textContent) {
    throw new Error("No content generated");
  }

  // Parse JSON from response
  const jsonMatch = textContent.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error("Could not parse slide content JSON");
  }

  return JSON.parse(jsonMatch[0]);
}

// Generate image for a single slide
async function generateSlideImage(apiKey, slide, isFirstSlide = false) {
  const { slideNumber, heading, body, hasNumber } = slide;

  const numberPrefix = hasNumber ? `${slideNumber}. ` : "";
  const formattedHeading = `${numberPrefix}${heading}`;

  // Different prompt for cover slide vs content slides
  const coverSlidePrompt = `Create a stunning LinkedIn carousel COVER slide image:

VISUAL DESIGN:
- Dark charcoal/slate background (hex #1a1a1a or similar dark gray)
- 4:5 aspect ratio (portrait mode, 1080x1350px)
- Include a simple, friendly cartoon illustration at the bottom half
- Cartoon style: clean line art, light blue colored characters (like tech professionals, interview scenes, or relevant to the topic)
- Characters should be minimalist, modern vector-style illustrations

TEXT LAYOUT:
- Title: "${heading}"
  - Large, bold white text
  - Key phrases colored in bright blue (#3b82f6)
  - Position in top 40% of image
  
- Subtitle: "${body}"
  - Smaller white text in parentheses style
  - Below the main title
  
STYLE REFERENCE: Like a modern tech infographic with clean typography and friendly illustrations. Think Cultivated Culture or similar professional LinkedIn carousels.`;

  const contentSlidePrompt = `Create a professional LinkedIn carousel content slide image:

VISUAL DESIGN:
- Dark charcoal/slate background (hex #1a1a1a)
- 4:5 aspect ratio (portrait, 1080x1350px)
- Clean, minimal design with excellent typography
- Small subtle brand logo placeholder at bottom center

TEXT LAYOUT:
- Heading: "${formattedHeading}"
  - Large, bold white sans-serif font
  ${hasNumber ? `- The number "${slideNumber}." should be in bright blue (#3b82f6)` : ""}
  - Position in upper portion with left alignment
  - Leave breathing room at top edge
  
- Body text: "${body}"
  - Regular weight white text
  - Good line spacing and readability
  - Bullet points if the text has multiple items
  - Position below heading with comfortable spacing
  
TYPOGRAPHY:
- Clean, modern sans-serif font (like Inter or Helvetica)
- Strong visual hierarchy
- High contrast for readability
- Professional, not cluttered`;

  const prompt = isFirstSlide ? coverSlidePrompt : contentSlidePrompt;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"],
        },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Image generation error:", data);
    throw new Error(data.error?.message || "Failed to generate image");
  }

  // Extract image data
  const parts = data.candidates?.[0]?.content?.parts || [];
  for (const part of parts) {
    if (part.inlineData) {
      return {
        slideNumber,
        imageData: part.inlineData.data,
        mimeType: part.inlineData.mimeType || "image/png",
      };
    }
  }

  throw new Error(`No image generated for slide ${slideNumber}`);
}

// Generate all slide images
async function generateSlideImages(apiKey, slides) {
  const images = [];

  // Generate images sequentially to avoid rate limits
  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    const isFirstSlide = i === 0;
    try {
      const image = await generateSlideImage(apiKey, slide, isFirstSlide);
      images.push(image);
    } catch (error) {
      console.error(`Error generating slide ${slide.slideNumber}:`, error);
      images.push({
        slideNumber: slide.slideNumber,
        error: error.message,
      });
    }

    // Small delay between requests to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return images;
}
