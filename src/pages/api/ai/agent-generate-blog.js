// src/pages/api/ai/agent-generate-blog.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { callGemini } from "@/lib/gemini";

/**
 * Fetches and extracts content from a URL
 * Supports various content types and handles fetching errors gracefully
 * @param {string} url - The URL to fetch content from
 * @returns {Promise<string>} - The extracted text content from the URL
 */
async function fetchUrlContent(url) {
  try {
    // Validate URL format
    let validUrl;
    try {
      validUrl = new URL(url);
    } catch (urlError) {
      throw new Error(`Invalid URL format: ${url}`);
    }

    // Only allow HTTP/HTTPS protocols
    if (!['http:', 'https:'].includes(validUrl.protocol)) {
      throw new Error('Only HTTP and HTTPS URLs are supported');
    }

    console.log(`[Agent Mode] Fetching URL: ${validUrl.href}`);

    // Configure fetch with timeout and user agent
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    const response = await fetch(validUrl.href, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BlogAgent/1.0; +https://karthiknishanth.com)',
      },
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || '';
    let content = '';

    // Handle different content types
    if (contentType.includes('application/json')) {
      const json = await response.json();
      content = JSON.stringify(json, null, 2);
    } else if (contentType.includes('text/')) {
      content = await response.text();
    } else {
      // For other types, try to get text anyway
      content = await response.text();
    }

    // Extract meaningful text from HTML
    if (contentType.includes('text/html')) {
      content = extractTextFromHtml(content);
    }

    // Clean up the content
    content = content
      .replace(/\s+/g, ' ')  // Normalize whitespace
      .replace(/\n{3,}/g, '\n\n')  // Remove excessive line breaks
      .trim();

    // Limit content length to avoid token limits
    const maxContentLength = 10000; // Approx 2500-3000 tokens
    if (content.length > maxContentLength) {
      content = content.substring(0, maxContentLength) + '\n\n[Content truncated...]';
    }

    console.log(`[Agent Mode] Successfully fetched ${content.length} characters from URL`);
    return content;

  } catch (error) {
    console.error(`[Agent Mode] Error fetching URL:`, error.message);
    throw error;
  }
}

/**
 * Extracts meaningful text content from HTML
 * Removes scripts, styles, and other non-content elements
 * @param {string} html - The HTML content
 * @returns {string} - The extracted text content
 */
function extractTextFromHtml(html) {
  // Remove script tags, style tags, and comments
  let text = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');

  // Extract text from common content elements
  const contentTags = ['article', 'main', 'div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'span'];
  const tagPattern = new RegExp(`<(${contentTags.join('|')})\\b[^>]*>([\\s\\S]*?)<\\/\\1>`, 'gi');
  const matches = [...text.matchAll(tagPattern)];

  if (matches.length > 0) {
    // Use matched content, preferring longer elements (likely to contain more content)
    text = matches
      .sort((a, b) => b[0].length - a[0].length)
      .slice(0, 20) // Take top 20 largest elements
      .map(m => m[2])
      .join(' ');
  }

  // Remove all remaining HTML tags
  text = text.replace(/<[^>]+>/g, ' ');

  // Decode HTML entities
  const entities = {
    '&nbsp;': ' ', '&amp;': '&', '&lt;': '<', '&gt;': '>',
    '&quot;': '"', '&apos;': "'", '&mdash;': '—', '&ndash;': '–',
    '&hellip;': '...', '&rsquo;': ''', '&lsquo;': ''',
    '&rdquo;': '"', '&ldquo;': '"',
  };
  for (const [entity, char] of Object.entries(entities)) {
    text = text.replace(new RegExp(entity, 'g'), char);
  }

  return text;
}

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
    const { context, url } = req.body;

    if (!context?.trim() && !url?.trim()) {
      return res.status(400).json({ message: "Context or URL is required" });
    }

    let enhancedContext = context || '';

    // If URL is provided, fetch its content and enhance the context
    if (url?.trim()) {
      try {
        const urlContent = await fetchUrlContent(url.trim());
        if (urlContent) {
          enhancedContext = enhancedContext.trim()
            ? `${enhancedContext.trim()}\n\n**Reference Content from URL:**\n${urlContent}`
            : `**Reference Content from URL:**\n${urlContent}`;
        }
      } catch (urlError) {
        console.error('[Agent Mode] URL fetch failed, proceeding with context only:', urlError.message);
        // Continue with just the context if URL fetch fails
        enhancedContext = enhancedContext.trim() || '';
      }
    }

    if (!enhancedContext?.trim()) {
      return res.status(400).json({ message: "Unable to generate content from the provided input" });
    }

    const generationConfig = {
      temperature: 0.8,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192,
    };

    const prompt = `
      Act as Karthik Nishanth, a seasoned full-stack developer with over 8 years of experience building web applications and leading development teams. You're also a skilled technical writer who can explain complex concepts in an accessible way.

      Based on the following context provided by the user, generate a complete blog post with a compelling title and rich content.

      **User Context:**
      ${enhancedContext}

      **Your Task:**
      1. First, create an engaging, SEO-friendly title based on the context
      2. Then write a comprehensive blog post that:
         - Starts with an engaging introduction that hooks the reader
         - Has clear sections with H2 headings
         - Includes practical examples, code snippets, or case studies where relevant
         - Uses a conversational yet professional tone
         - Provides actionable takeaways
         - Is approximately 800-1200 words

      **Writing Style:**
      - Use contractions (don't, can't, it's) to sound conversational
      - Vary sentence length for better rhythm
      - Ask rhetorical questions to engage readers
      - Include real-world analogies and metaphors
      - Address the reader directly ("you")
      - Share personal insights or experiences to add authenticity

      **HTML Formatting:**
      - Use <h2> tags for main section headings
      - Wrap paragraphs in <p> tags
      - Use <strong> for emphasis on key terms
      - Use <ul> and <li> for lists
      - Use <code> for inline code references
      - Use <pre><code> for code blocks

      **Output Format:**
      Return your response as valid JSON with exactly this structure:
      {
        "title": "Your Generated Blog Title Here",
        "content": "<p>Your HTML content here...</p>"
      }

      Return ONLY the JSON object, no additional text or markdown code blocks.
    `;

    console.log("[Agent Mode] Generating blog from context...");
    const rawResponse = await callGemini(prompt, generationConfig);
    console.log("[Agent Mode] Raw response received");

    // Parse the JSON response
    let parsedResponse;
    try {
      // Clean potential markdown fences
      const cleanedResponse = rawResponse
        .replace(/^```(?:json)?\s*\n?/i, "")
        .replace(/\n?```\s*$/i, "")
        .trim();
      
      parsedResponse = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("[Agent Mode] Failed to parse response as JSON:", parseError);
      console.error("[Agent Mode] Raw response:", rawResponse.substring(0, 500));
      
      // Fallback: try to extract title and content manually
      const titleMatch = rawResponse.match(/"title"\s*:\s*"([^"]+)"/);
      const contentMatch = rawResponse.match(/"content"\s*:\s*"(.+)"\s*\}$/s);
      
      if (titleMatch && contentMatch) {
        parsedResponse = {
          title: titleMatch[1],
          content: contentMatch[1].replace(/\\n/g, "\n").replace(/\\"/g, '"'),
        };
      } else {
        throw new Error("Failed to parse AI response. Please try again.");
      }
    }

    if (!parsedResponse.title || !parsedResponse.content) {
      throw new Error("AI response missing title or content");
    }

    console.log(`[Agent Mode] Generated title: "${parsedResponse.title}"`);

    return res.status(200).json({
      success: true,
      data: {
        title: parsedResponse.title,
        content: parsedResponse.content,
      },
    });
  } catch (error) {
    console.error("[Agent Mode] Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error generating blog content",
    });
  }
}
