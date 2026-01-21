import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { callGemini } from "@/lib/gemini";
import formidable from "formidable";
import fs from "fs/promises";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

interface FormidableFile {
  filepath: string;
  originalFilename: string;
  mimetype: string;
  size: number;
}

interface FormidableFiles {
  file?: FormidableFile[];
}

interface FormidableFields {
  context?: string[];
  url?: string[];
  styleConfig?: string[];
}

interface StyleConfig {
  tone: string;
  audience: string;
  length: string;
}

interface OutlineSection {
  id: string;
  heading: string;
  points: string[];
}

interface OutlineResponse {
  title: string;
  sections: OutlineSection[];
}

interface ParsedResponse {
  title: string;
  sections: OutlineSection[];
}

export const config = {
  api: {
    bodyParser: false,
  },
};

async function parseFileContent(file: FormidableFile): Promise<string> {
  try {
    const fileBuffer = await fs.readFile(file.filepath);
    const fileType = file.mimetype;
    let content = '';

    console.log(`[Agent Outline] Parsing file: ${file.originalFilename}, type: ${fileType}`);

    switch (true) {
      case fileType === 'application/pdf':
        const pdfData = await pdfParse(fileBuffer);
        content = pdfData.text;
        break;

      case fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        const docxResult = await mammoth.extractRawText({ buffer: fileBuffer });
        content = docxResult.value;
        break;

      case fileType === 'text/plain':
      case file.originalFilename?.toLowerCase().endsWith('.txt'):
        content = fileBuffer.toString('utf-8');
        break;

      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }

    content = content
      .replace(/\s+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    const maxContentLength = 15000;
    if (content.length > maxContentLength) {
      content = content.substring(0, maxContentLength) + '\n\n[File content truncated...]';
    }

    return content;
  } catch (error) {
    console.error('[Agent Outline] Error parsing file:', error);
    throw new Error(`Failed to parse file: ${(error as Error).message}`);
  }
}

async function fetchUrlContent(url: string): Promise<string> {
  try {
    let validUrl: URL;
    try {
      validUrl = new URL(url);
    } catch (urlError) {
      throw new Error(`Invalid URL format: ${url}`);
    }

    if (!['http:', 'https:'].includes(validUrl.protocol)) {
      throw new Error('Only HTTP and HTTPS URLs are supported');
    }

    console.log(`[Agent Outline] Fetching URL: ${validUrl.href}`);

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

    console.log(`[Agent Outline] Successfully fetched ${content.length} characters from URL`);
    return content;

  } catch (error) {
    console.error(`[Agent Outline] Error fetching URL:`, (error as Error).message);
    throw error;
  }
}

function extractTextFromHtml(html: string): string {
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

  const entities: Record<string, string> = {
    '&nbsp;': ' ', '&amp;': '&', '&lt;': '<', '&gt;': '>',
    '&quot;': '"', '&apos;': "'", '&mdash;': '—', '&ndash;': '–',
    '&hellip;': '...', '&rsquo;': "'", '&lsquo;': "'",
    '&rdquo;': '"', '&ldquo;': '"',
  };

  const entityPatterns = Object.entries(entities).map(([entity, char]) => ({
    pattern: new RegExp(entity, 'g'),
    char
  }));

  for (const { pattern, char } of entityPatterns) {
    text = text.replace(pattern, char);
  }

  return text;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
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
    let styleConfig: StyleConfig = {
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

      const [fields, files] = await form.parse(req) as [FormidableFields, FormidableFiles];

      context = fields.context?.[0] || '';
      url = fields.url?.[0] || '';

      if (fields.styleConfig && fields.styleConfig[0]) {
        try {
          styleConfig = JSON.parse(fields.styleConfig[0]);
        } catch (e) {
          console.error('[Agent Outline] Failed to parse styleConfig:', e);
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
      const body = req.body as { context?: string; url?: string; styleConfig?: StyleConfig };
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
        console.error('[Agent Outline] URL fetch failed, proceeding with context only:', (urlError as Error).message);
      }
    }

    if (!enhancedContext?.trim()) {
      return res.status(400).json({ message: "Unable to generate outline from the provided input" });
    }

    const generationConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 4096,
    };

    const prompt = `
      Act as Karthik Nishanth, a seasoned full-stack developer and technical writer. Based on the following context provided by the user, generate a comprehensive blog post outline.

      **User Context:**
      ${enhancedContext}

      **Style Configuration:**
      - **Tone:** ${styleConfig.tone}
      - **Audience:** ${styleConfig.audience}
      - **Length:** ${styleConfig.length}

      **Your Task:**
      Create a detailed blog post outline with:
      1. An engaging, SEO-friendly title
      2. A brief introduction section (2-3 bullet points)
      3. 4-6 main sections with H2 headings, each with 3-5 bullet points describing content
      4. A conclusion section (2-3 bullet points)

      **Output Format:**
      Return your response as valid JSON with exactly this structure:
      {
        "title": "Your Generated Blog Title Here",
        "sections": [
          {
            "id": "introduction",
            "heading": "Introduction",
            "points": ["First key point to cover", "Second key point", "Third key point"]
          },
          {
            "id": "section-1",
            "heading": "Section H2 Heading",
            "points": ["First key point", "Second key point", "Third key point", "Fourth key point"]
          }
        ]
      }

      The sections array should include:
      - An "introduction" section with id "introduction"
      - 4-6 main content sections with unique ids (section-1, section-2, etc.)
      - A "conclusion" section with id "conclusion"

      Return ONLY the JSON object, no additional text or markdown code blocks.
    `;

    console.log("[Agent Outline] Generating outline from context...");
    const rawResponse = await callGemini(prompt, generationConfig);
    console.log("[Agent Outline] Raw response received");

    let parsedResponse: ParsedResponse;
    try {
      const cleanedResponse = rawResponse
        .replace(/^```(?:json)?\s*\n?/i, "")
        .replace(/\n?```\s*$/i, "")
        .trim();

      parsedResponse = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("[Agent Outline] Failed to parse response as JSON:", parseError);
      console.error("[Agent Outline] Raw response:", rawResponse.substring(0, 500));

      const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          parsedResponse = JSON.parse(jsonMatch[0]);
        } catch (e) {
          throw new Error("Failed to parse AI response. Please try again.");
        }
      } else {
        throw new Error("Failed to parse AI response. Please try again.");
      }
    }

    if (!parsedResponse.title || !parsedResponse.sections || !Array.isArray(parsedResponse.sections)) {
      throw new Error("AI response missing required fields");
    }

    console.log(`[Agent Outline] Generated outline with ${parsedResponse.sections.length} sections`);

    return res.status(200).json({
      success: true,
      data: {
        title: parsedResponse.title,
        sections: parsedResponse.sections,
      },
    });
  } catch (error) {
    console.error("[Agent Outline] Error:", error);
    return res.status(500).json({
      success: false,
      message: (error as Error).message || "Error generating outline",
    });
  }
}
