// src/pages/api/ai/linkedin-carousel.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

// Nano Banana Pro - Google's advanced image generation model with superior text rendering
const IMAGE_MODEL = "gemini-3-pro-image-preview";
// Gemini 3 Flash - Latest fast text model for content generation
const TEXT_MODEL = "gemini-3-flash-preview";

// Style presets for carousel designs
const STYLE_PRESETS = {
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

// Aspect ratio configurations
const ASPECT_RATIOS = {
  portrait: { ratio: "4:5", dimensions: "1080x1350 pixels", description: "optimal for LinkedIn mobile" },
  square: { ratio: "1:1", dimensions: "1080x1080 pixels", description: "universal format" },
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
    const { 
      topic, 
      slideCount = 5, 
      slideContents = null,
      style = "dark_pro",
      aspectRatio = "portrait"
    } = req.body;

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

    // Validate style and aspect ratio
    const selectedStyle = STYLE_PRESETS[style] || STYLE_PRESETS.dark_pro;
    const selectedAspectRatio = ASPECT_RATIOS[aspectRatio] || ASPECT_RATIOS.portrait;

    // Step 1: Generate slide content if not provided
    let slides = slideContents;
    if (!slides) {
      slides = await generateSlideContent(apiKey, topic.trim(), slideCount);
    }

    // Step 2: Generate images for each slide using Nano Banana Pro
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

  // Parse JSON from response
  const jsonMatch = textContent.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error("Could not parse slide content JSON");
  }

  return JSON.parse(jsonMatch[0]);
}

// Generate image for a single slide using Nano Banana Pro
async function generateSlideImage(apiKey, slide, isFirstSlide, isLastSlide, style, aspectRatio, totalSlides) {
  const { slideNumber, heading, body, hasNumber } = slide;

  const numberPrefix = hasNumber ? `${slideNumber}. ` : "";
  const formattedHeading = `${numberPrefix}${heading}`;

  // Build design context from style preset
  const designContext = `
DESIGN STYLE: ${style.name} - ${style.style}
BACKGROUND: ${style.background}
ACCENT COLOR: ${style.accent}
TEXT COLOR: ${style.textColor}
SECONDARY TEXT: ${style.secondaryText}
ASPECT RATIO: ${aspectRatio.ratio} (${aspectRatio.dimensions})
`;

  // Cover slide prompt - optimized for LinkedIn engagement
  const coverSlidePrompt = `Generate a stunning LinkedIn carousel COVER slide that grabs attention.
${designContext}

CRITICAL TEXT RENDERING REQUIREMENTS:
- Render ALL text with PERFECT legibility - this is the most important requirement
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

  // Content slide prompt - clear hierarchy and readability
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

  // CTA/Closing slide prompt
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

  // Select appropriate prompt
  let prompt;
  if (isFirstSlide) {
    prompt = coverSlidePrompt;
  } else if (isLastSlide) {
    prompt = ctaSlidePrompt;
  } else {
    prompt = contentSlidePrompt;
  }

  // Use Nano Banana Pro for superior text rendering
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

// Generate all slide images using Nano Banana Pro
async function generateSlideImages(apiKey, slides, style, aspectRatio) {
  const images = [];
  const totalSlides = slides.length;

  // Generate images sequentially to avoid rate limits
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
        error: error.message,
      });
    }

    // Small delay between requests to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return images;
}
