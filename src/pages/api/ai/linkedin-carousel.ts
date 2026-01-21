import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

const IMAGE_MODEL = "gemini-3-pro-image-preview";
const TEXT_MODEL = "gemini-3-flash-preview";

interface StylePreset {
  name: string;
  background: string;
  accent: string;
  textColor: string;
  secondaryText: string;
  style: string;
}

interface AspectRatio {
  ratio: string;
  dimensions: string;
  description: string;
}

interface Slide {
  slideNumber: number;
  heading: string;
  body: string;
  hasNumber: boolean;
}

interface SlideRequest {
  topic: string;
  slideCount?: number;
  slideContents?: Slide[] | null;
  style?: string;
  aspectRatio?: string;
}

interface GeneratedImage {
  slideNumber: number;
  imageData: string;
  mimeType: string;
  error?: string;
}

const STYLE_PRESETS: Record<string, StylePreset> = {
  dark_pro: {
    name: "Dark Pro",
    background: "deep charcoal black (#0a0a0a) with subtle gradient to dark slate (#1a1a2e)",
    accent: "vibrant electric blue (#3b82f6)",
    textColor: "crisp white (#ffffff)",
    secondaryText: "light gray (#a1a1aa)",
    style: "sleek, modern, tech-forward",
  },
  light_pro: {
    name: "Light Pro",
    background: "clean white (#ffffff) with subtle warm undertones",
    accent: "deep blue (#1e40af)",
    textColor: "near-black (#0f172a)",
    secondaryText: "gray (#64748b)",
    style: "clean, professional, minimalist",
  },
  gradient: {
    name: "Gradient",
    background: "rich gradient from deep purple (#4c1d95) to deep blue (#1e3a8a)",
    accent: "bright cyan (#22d3ee)",
    textColor: "white (#ffffff)",
    secondaryText: "light purple (#c4b5fd)",
    style: "bold, creative, eye-catching",
  },
};

const ASPECT_RATIOS: Record<string, AspectRatio> = {
  portrait: { ratio: "4:5", dimensions: "1080x1350 pixels", description: "optimal for LinkedIn mobile" },
  square: { ratio: "1:1", dimensions: "1080x1080 pixels", description: "universal format" },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const host = req.headers.host || "";
  const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");

  const session = await getServerSession(req, res, authOptions);

  if (!session && !isLocalhost) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const isAdmin =
    isLocalhost ||
    (session as any)?.user?.role === "admin" ||
    (session as any)?.user?.isAdmin === true ||
    (session as any)?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  if (!isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const {
      topic,
      slideCount = 5,
      slideContents = null,
      style = "dark_pro",
      aspectRatio = "portrait"
    } = req.body as SlideRequest;

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

    const selectedStyle = STYLE_PRESETS[style] || STYLE_PRESETS.dark_pro;
    const selectedAspectRatio = ASPECT_RATIOS[aspectRatio] || ASPECT_RATIOS.portrait;

    let slides = slideContents;
    if (!slides) {
      slides = await generateSlideContent(apiKey, topic.trim(), slideCount);
    }

    const images = await generateSlideImages(apiKey, slides, selectedStyle, selectedAspectRatio);

    return res.status(200).json({
      success: true,
      slides,
      images,
      metadata: {
        topic: topic.trim(),
        slideCount: slides.length,
        style: selectedStyle.name,
        aspectRatio: selectedAspectRatio.ratio,
        model: IMAGE_MODEL,
      },
    });
  } catch (error) {
    console.error("LinkedIn carousel generation error:", error);
    return res.status(500).json({
      success: false,
      message: (error as Error).message || "Error generating carousel",
    });
  }
}

async function generateSlideContent(apiKey: string, topic: string, slideCount: number): Promise<Slide[]> {
  const prompt = `Create content for a ${slideCount}-slide LinkedIn carousel about: "${topic}"\n\nRequirements:\n- Slide 1: Cover slide with a catchy title and subtitle\n- Slides 2-${slideCount - 1}: Main content slides with numbered tips/points\n- Slide ${slideCount}: Closing slide with call-to-action\n\nFor each slide, provide:\n- slideNumber: number\n- heading: short bold heading (max 10 words)\n- body: supporting text (max 50 words)\n- hasNumber: boolean (true if it's a numbered tip)\n\nReturn ONLY valid JSON array, no markdown, no explanation:\n[{"slideNumber": 1, "heading": "...", "body": "...", "hasNumber": false}, ...]`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${TEXT_MODEL}:generateContent?key=${apiKey}`,
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

  const jsonMatch = textContent.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error("Could not parse slide content JSON");
  }

  return JSON.parse(jsonMatch[0]);
}

async function generateSlideImage(
  apiKey: string,
  slide: Slide,
  isFirstSlide: boolean,
  isLastSlide: boolean,
  style: StylePreset,
  aspectRatio: AspectRatio,
  totalSlides: number
): Promise<GeneratedImage> {
  const { slideNumber, heading, body, hasNumber } = slide;

  const numberPrefix = hasNumber ? `${slideNumber}. ` : "";
  const formattedHeading = `${numberPrefix}${heading}`;

  const designContext = `
DESIGN STYLE: ${style.name} - ${style.style}
BACKGROUND: ${style.background}
ACCENT COLOR: ${style.accent}
TEXT COLOR: ${style.textColor}
SECONDARY TEXT: ${style.secondaryText}
ASPECT RATIO: ${aspectRatio.ratio} (${aspectRatio.dimensions})
  `;

  const coverSlidePrompt = `Generate a stunning LinkedIn carousel COVER slide that grabs attention.
${designContext}

CRITICAL TEXT RENDERING REQUIREMENTS:
- Render ALL text with PERFECT legibility - this is
  most important requirement
- Use large, bold sans-serif typography (similar to Inter, Helvetica Neue, or SF Pro)
- Headline font size equivalent to 48-60pt for maximum mobile readability
- Subtitle font size equivalent to 24-28pt
- Ensure extremely high contrast between text and background
- NO text overlapping with decorative elements

LAYOUT:
- Title: "${heading}"
  - Position in upper 40% of image
  - Bold weight, ${style.textColor}
  - Key action words can use ${style.accent} color
  
- Subtitle: "${body}"
  - Position below title with generous spacing (at least 40px gap)
  - Medium weight, ${style.secondaryText}

VISUAL ELEMENTS:
- Add subtle decorative elements that don't interfere with text
- Consider: abstract geometric shapes, soft gradients, or minimal icons
- Keep bottom 30% relatively clean for visual breathing room
- Add a small "Swipe →" indicator in bottom right corner

STYLE: Premium, modern LinkedIn carousel. Think professional tech company design standards.`;

  const contentSlidePrompt = `Generate a professional LinkedIn carousel CONTENT slide with perfect typography.
${designContext}

CRITICAL TEXT RENDERING REQUIREMENTS:
- ALL text must be PERFECTLY legible - prioritize readability above all else
- Use clean sans-serif font (Inter, Helvetica Neue, or SF Pro style)
- Heading: large bold text, minimum 36pt equivalent
- Body: regular weight, minimum 20pt equivalent for mobile readability
- Line height: 1.5x for body text
- Maximum 50 words visible on slide

LAYOUT:
- Heading: "${formattedHeading}"
  ${hasNumber ? `- The number "${slideNumber}" should be prominently displayed in ${style.accent} color` : ""}
  - Position in upper portion with left alignment
  - Leave 60px+ margin from top edge
  - Text color: ${style.textColor}
  
- Body: "${body}"
  - Position below heading with 30px+ comfortable spacing
  - Text color: ${style.secondaryText}
  - If multiple points, use bullet points or numbered list format
  - Left-aligned for easy scanning

VISUAL ELEMENTS:
- Minimal decorative elements - content is king
- Subtle accent line or shape using ${style.accent} color
- Clean margins: 60px on sides
- Slide number indicator: "${slideNumber}/${totalSlides}" in bottom corner (small, subtle)

STYLE: Clean, scannable, professional. Mobile-first design.`;

  const ctaSlidePrompt = `Generate a compelling LinkedIn carousel CLOSING/CTA slide.
${designContext}

CRITICAL TEXT RENDERING REQUIREMENTS:
- ALL text PERFECTLY legible - highest priority
- Bold, impactful typography
- CTA headline: 36-48pt equivalent
- Supporting text: 20-24pt equivalent

LAYOUT:
- Main CTA: "${heading}"
  - Centered, bold, prominent
  - ${style.textColor}
  
- Supporting text: "${body}"
  - Below main CTA
  - ${style.secondaryText}

VISUAL ELEMENTS:
- More dynamic than content slides
- Consider: arrow pointing right, engagement icons (like, comment, share)
- Add "Follow for more" or similar engagement prompt
- Subtle branding element in corner

STYLE: Memorable, action-oriented, professional.`;

  let prompt: string;
  if (isFirstSlide) {
    prompt = coverSlidePrompt;
  } else if (isLastSlide) {
    prompt = ctaSlidePrompt;
  } else {
    prompt = contentSlidePrompt;
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${IMAGE_MODEL}:generateContent?key=${apiKey}`,
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

async function generateSlideImages(
  apiKey: string,
  slides: Slide[],
  style: StylePreset,
  aspectRatio: AspectRatio
): Promise<GeneratedImage[]> {
  const images: GeneratedImage[] = [];
  const totalSlides = slides.length;

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    const isFirstSlide = i === 0;
    const isLastSlide = i === slides.length - 1;

    try {
      const image = await generateSlideImage(
        apiKey,
        slide,
        isFirstSlide,
        isLastSlide,
        style,
        aspectRatio,
        totalSlides
      );
      images.push(image);
    } catch (error) {
      console.error(`Error generating slide ${slide.slideNumber}:`, error);
      images.push({
        slideNumber: slide.slideNumber,
        error: (error as Error).message,
      } as GeneratedImage);
    }

    await new Promise<void>((resolve) => setTimeout(resolve, 500));
  }

  return images;
}
