// src/pages/api/ai/agent-generate-blog.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { callGemini } from "@/lib/gemini";
import formidable from "formidable";
import fs from "fs/promises";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

// Disable Next.js body parser for this route to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Parse uploaded file and extract text content
 * @param {Object} file - The uploaded file object from formidable
 * @returns {Promise<string>} - The extracted text content
 */
async function parseFileContent(file) {
  try {
    const fileBuffer = await fs.readFile(file.filepath);
    const fileType = file.mimetype;
    let content = '';

    console.log(`[Agent Mode] Parsing file: ${file.originalFilename}, type: ${fileType}`);

    switch (true) {
      case fileType === 'application/pdf':
        const pdfData = await pdfParse(fileBuffer);
        content = pdfData.text;
        console.log(`[Agent Mode] Extracted ${content.length} characters from PDF`);
        break;

      case fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        const docxResult = await mammoth.extractRawText({ buffer: fileBuffer });
        content = docxResult.value;
        console.log(`[Agent Mode] Extracted ${content.length} characters from DOCX`);
        break;

      case fileType === 'text/plain':
      case file.originalFilename?.toLowerCase().endsWith('.txt'):
        content = fileBuffer.toString('utf-8');
        console.log(`[Agent Mode] Extracted ${content.length} characters from TXT`);
        break;

      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }

    // Clean up the content
    content = content
      .replace(/\s+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    // Limit content length
    const maxContentLength = 15000;
    if (content.length > maxContentLength) {
      content = content.substring(0, maxContentLength) + '\n\n[File content truncated...]';
      console.log(`[Agent Mode] File content truncated to ${maxContentLength} characters`);
    }

    return content;
  } catch (error) {
    console.error('[Agent Mode] Error parsing file:', error);
    throw new Error(`Failed to parse file: ${error.message}`);
  }
}

/**
 * Fetches and extracts content from a URL
 * Supports various content types and handles fetching errors gracefully
 * @param {string} url - The URL to fetch content from
 * @returns {Promise<string>} - The extracted text content from the URL
 */
async function fetchUrlContent(url) {
  try {
    let validUrl;
    try {
      validUrl = new URL(url);
    } catch (urlError) {
      throw new Error(`Invalid URL format: ${url}`);
    }

    if (!['http:', 'https:'].includes(validUrl.protocol)) {
      throw new Error('Only HTTP and HTTPS URLs are supported');
    }

    console.log(`[Agent Mode] Fetching URL: ${validUrl.href}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

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

    if (contentType.includes('application/json')) {
      const json = await response.json();
      content = JSON.stringify(json, null, 2);
    } else if (contentType.includes('text/')) {
      content = await response.text();
    } else {
      content = await response.text();
    }

    if (contentType.includes('text/html')) {
      content = extractTextFromHtml(content);
    }

    content = content
      .replace(/\s+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    const maxContentLength = 10000;
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
  let text = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');

  const contentTags = ['article', 'main', 'div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'span'];
  const tagPattern = new RegExp(`<(${contentTags.join('|')})\\b[^>]*>([\\s\\S]*?)<\\/\\1>`, 'gi');
  const matches = [...text.matchAll(tagPattern)];

  if (matches.length > 0) {
    text = matches
      .sort((a, b) => b[0].length - a[0].length)
      .slice(0, 20)
      .map(m => m[2])
      .join(' ');
  }

  text = text.replace(/<[^>]+>/g, ' ');

  const entities = {
    '&nbsp;': ' ', '&amp;': '&', '&lt;': '<', '&gt;': '>',
    '&quot;': '"', '&apos;': "'", '&mdash;': '—', '&ndash;': '–',
    '&hellip;': '...', '&rsquo;': "'", '&lsquo;': "'",
    '&rdquo;': '"', '&ldquo;': '"',
  };
  for (const [entity, char] of Object.entries(entities)) {
    text = text.replace(new RegExp(entity, 'g'), char);
  }

  return text;
}

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
    let context = '';
    let url = '';
    let fileContent = '';
    let styleConfig = {
      tone: 'professional',
      audience: 'developers',
      length: 'medium'
    };

    const contentType = req.headers['content-type'];

    if (contentType && contentType.includes('multipart/form-data')) {
      const form = formidable({
        maxFileSize: 10 * 1024 * 1024,
        keepExtensions: true,
      });

      const [fields, files] = await form.parse(req);

      context = fields.context?.[0] || '';
      url = fields.url?.[0] || '';

      // Parse styleConfig from JSON string
      if (fields.styleConfig && fields.styleConfig[0]) {
        try {
          styleConfig = JSON.parse(fields.styleConfig[0]);
        } catch (e) {
          console.error('[Agent Mode] Failed to parse styleConfig:', e);
        }
      }

      if (files.file && files.file.length > 0) {
        const uploadedFile = files.file[0];

        const allowedTypes = [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain'
        ];

        if (!allowedTypes.includes(uploadedFile.mimetype) && !uploadedFile.originalFilename?.toLowerCase().endsWith('.txt')) {
          await fs.unlink(uploadedFile.filepath).catch(() => {});
          return res.status(400).json({
            message: "Invalid file type. Only PDF, DOCX, and TXT files are supported."
          });
        }

        fileContent = await parseFileContent(uploadedFile);

        await fs.unlink(uploadedFile.filepath).catch(() => {});
      }
    } else {
      const body = req.body;
      context = body?.context || '';
      url = body?.url || '';
      if (body?.styleConfig) {
        styleConfig = {
          tone: body.styleConfig.tone || 'professional',
          audience: body.styleConfig.audience || 'developers',
          length: body.styleConfig.length || 'medium'
        };
      }
    }

    let enhancedContext = context || '';

    if (fileContent) {
      enhancedContext = enhancedContext.trim()
        ? `${enhancedContext.trim()}\n\n**Uploaded File Content:**\n${fileContent}`
        : `**Uploaded File Content:**\n${fileContent}`;
    }

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
      }
    }

    if (!enhancedContext?.trim()) {
      return res.status(400).json({ message: "Unable to generate content from the provided input" });
    }

    // Style configuration helpers
    const toneInstructions = {
      professional: "Use a professional, polished tone with industry-standard terminology.",
      casual: "Use a relaxed, conversational tone with informal language and expressions.",
      friendly: "Use a warm, approachable tone that feels like a helpful friend giving advice.",
      authoritative: "Use an authoritative, expert tone that demonstrates deep knowledge and confidence.",
      humorous: "Use a playful tone with appropriate humor, wit, and light-hearted observations.",
      technical: "Use a highly technical tone with precise terminology and deep technical details."
    };

    const audienceInstructions = {
      developers: "Write for experienced developers who understand technical concepts and jargon.",
      beginners: "Write for beginners who are new to the topic. Explain concepts clearly without assuming prior knowledge.",
      executives: "Write for business executives and decision-makers. Focus on business value, ROI, and strategic implications.",
      general: "Write for a general audience. Avoid jargon and explain technical concepts in simple terms.",
      students: "Write for students who are learning. Include educational explanations and learning-friendly examples."
    };

    const lengthInstructions = {
      short: "Aim for approximately 500 words. Be concise and focus on the most important points.",
      medium: "Aim for approximately 1000 words. Provide a balanced, comprehensive coverage of the topic.",
      long: "Aim for approximately 2000 words. Go deep into the topic with extensive examples, details, and nuances."
    };

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

      **Style Configuration:**
      - **Tone:** ${styleConfig.tone}
      - **Audience:** ${styleConfig.audience}
      - **Length:** ${styleConfig.length}

      **Style Guidelines:**
      - Tone: ${toneInstructions[styleConfig.tone] || toneInstructions.professional}
      - Audience: ${audienceInstructions[styleConfig.audience] || audienceInstructions.developers}
      - Length: ${lengthInstructions[styleConfig.length] || lengthInstructions.medium}

      **Your Task:**
      1. First, create an engaging, SEO-friendly title based on the context
      2. Then write a comprehensive blog post that:
         - Starts with an engaging introduction that hooks the reader
         - Has clear sections with H2 headings
         - Includes practical examples, code snippets, or case studies where relevant
         - Provides actionable takeaways
         - Follows the specified tone, audience, and length guidelines

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

    let parsedResponse;
    try {
      const cleanedResponse = rawResponse
        .replace(/^```(?:json)?\s*\n?/i, "")
        .replace(/\n?```\s*$/i, "")
        .trim();
      
      parsedResponse = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("[Agent Mode] Failed to parse response as JSON:", parseError);
      console.error("[Agent Mode] Raw response:", rawResponse.substring(0, 500));
      
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
