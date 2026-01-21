import { NextApiRequest, NextApiResponse } from "next";
import { createDocument, runQuery, fieldFilter, updateDocument } from "@/lib/firebase";
import { callGemini } from "@/lib/gemini";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import axios from "axios";

async function isAdminUser(req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
  const session = await getServerSession(req, res, authOptions);
  return (
    (session as any)?.user?.role === "admin" ||
    (session as any)?.user?.isAdmin === true ||
    (session as any)?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
  );
}

function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const generateSlug = (title: string): string => {
  if (!title) return `blog-${Date.now()}`;
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .substring(0, 75);
};

interface ParsedAIResponse {
  title: string | null;
  slug: string | null;
  body: string | null;
  description: string | null;
  tags: string[];
  category: string;
}

const parseAIResponse = (responseText: string): ParsedAIResponse => {
  const output: ParsedAIResponse = {
    title: null,
    slug: null,
    body: null,
    description: null,
    tags: [],
    category: "AI News",
  };

  const titleMatch = responseText.match(/TITLE:(.*?)\n/);
  if (titleMatch && titleMatch[1]) output.title = titleMatch[1].trim();

  const slugMatch = responseText.match(/SLUG:(.*?)\n/);
  if (slugMatch && slugMatch[1]) output.slug = slugMatch[1].trim();

  const descriptionMatch = responseText.match(/DESCRIPTION:(.*?)\n/);
  if (descriptionMatch && descriptionMatch[1]) output.description = descriptionMatch[1].trim();

  const tagsMatch = responseText.match(/TAGS:(.*?)\n/);
  if (tagsMatch && tagsMatch[1]) {
    output.tags = tagsMatch[1].split(",").map((tag) => tag.trim()).filter((tag) => tag);
  }

  const bodyMatch = responseText.match(/BODY:\n([\s\S]*)/);
  if (bodyMatch && bodyMatch[1]) output.body = bodyMatch[1].trim();

  if (!output.title) output.title = "AI Generated Blog Post";
  if (!output.slug) output.slug = generateSlug(output.title);
  if (!output.body) output.body = responseText;
  if (!output.description) output.description = responseText.substring(0, 160);
  if (output.tags.length === 0) output.tags = ["AI", "Technology", "News"];

  return output;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  const authHeader = req.headers.authorization;
  const cronSecret = process.env.CRON_SECRET;

  if (authHeader === `Bearer ${cronSecret}`) {
    console.log("Authenticated via CRON_SECRET.");
  } else {
    const isAdmin = await isAdminUser(req, res);
    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Authentication required (Admin or Cron Secret)",
      });
    }
    console.log("Authenticated via admin session.");
  }

  try {
    const gnewsApiKey = process.env.GNEWS_API_KEY;
    if (!gnewsApiKey) {
      throw new Error("GNEWS_API_KEY is not defined.");
    }

    const today = getTodayDateString();
    const apiName = "gnews";
    const dailyLimit = 100;

    const usageResults = await runQuery("apiUsage", [
      fieldFilter("apiName", "EQUAL", apiName),
      fieldFilter("date", "EQUAL", today),
    ]);

    const usage = usageResults.length > 0 ? usageResults[0] : null;
    const currentCount = usage ? (usage.count || 0) : 0;

    if (currentCount >= dailyLimit) {
      console.warn(`GNews API limit reached for ${today}. Count: ${currentCount}`);
      return res.status(429).json({
        success: false,
        message: `Daily GNews API limit (${dailyLimit}) reached. Cannot generate blog post.`,
      });
    }

    const query = '("AI" OR "Artificial Intelligence" OR "Machine Learning" OR "Large Language Model") AND (technology OR software OR development)';
    const lang = "en";
    const maxArticles = 1;
    const sortBy = "publishedAt";
    const gnewsUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=${lang}&max=${maxArticles}&sortby=${sortBy}&apikey=${gnewsApiKey}`;

    let newsArticle: any;
    try {
      const newsResponse = await axios.get(gnewsUrl);

      const docId = `${apiName}_${today}`;
      if (usage) {
        await updateDocument("apiUsage", usage._id, { count: currentCount + 1 });
      } else {
        await createDocument("apiUsage", docId, { apiName, date: today, count: 1 });
      }
      console.log(`GNews API count incremented for ${today}. New count: ${currentCount + 1}`);

      if (newsResponse.status !== 200 || !newsResponse.data?.articles?.length) {
        console.warn("GNews API did not return any relevant articles.", newsResponse.data);
        return res.status(200).json({
          success: true,
          message: "No relevant AI news found to generate a blog post.",
        });
      }
      newsArticle = newsResponse.data.articles[0];
    } catch (newsError: any) {
      console.error("GNews API fetching error:", newsError.response?.data || newsError.message);
      const errorDetails = newsError.response?.data?.errors?.join(", ") || newsError.message;
      throw new Error(`Failed to fetch news from GNews: ${errorDetails}`);
    }

    const newsInputForPrompt = `Headline: ${newsArticle.title}\nSummary: ${newsArticle.description}\nSource URL: ${newsArticle.url}`;

    const systemPrompt = `
    Act as Karthik Nishanth, a seasoned full-stack developer and technical content creator with a talent for explaining complex AI developments in practical, actionable terms. You're writing for karthiknish.com, a technical blog read by developers, engineering leads, and tech decision-makers.

    Your task is to take the provided AI news content and write an engaging blog post that:
    - Explains the development in accessible terms
    - Analyzes its practical implications for developers
    - Connects it to real-world applications and opportunities
    - Maintains an optimistic, forward-looking perspective

    **INPUT NEWS CONTENT:**
    ---
    ${newsInputForPrompt}
    ---

    **OUTPUT FORMAT:**
    Generate the blog post details strictly in the following format:

    TITLE: [Generate a concise and engaging blog post title based on the news]
    SLUG: [Generate a URL-friendly slug based on the title]
    DESCRIPTION: [Generate a brief meta description (max 160 chars)]
    TAGS: [Suggest 3-5 relevant comma-separated tags]
    BODY:
    [Write the full blog post content here using HTML tags]
    `;

    console.log("Generating blog post draft for:", newsArticle.title);
    const generationConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    };

    const aiResponseText = await callGemini(systemPrompt, generationConfig);

    if (!aiResponseText) {
      throw new Error("AI failed to generate a response.");
    }

    const parsedData = parseAIResponse(aiResponseText);

    if (parsedData.body) {
      parsedData.body = parsedData.body.replace(/^\s*```(?:html)?\s*\n?|\s*\n?```\s*$/g, "").trim();
    }

    const slug = parsedData.slug || generateSlug(parsedData.title);
    const newBlogPost = await createDocument("blogs", slug, {
      title: parsedData.title,
      slug: slug,
      description: parsedData.description,
      tags: parsedData.tags,
      category: parsedData.category,
      content: parsedData.body,
      isPublished: true,
      authorId: "AI Assistant",
      viewCount: 0,
      likes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "AI blog post generated and published successfully.",
      data: {
        _id: newBlogPost._id,
        title: newBlogPost.title,
        slug: newBlogPost.slug,
      },
    });
  } catch (error) {
    console.error("Error in auto-generate-news-blog API:", error);
    let errorMessage = "Failed to generate or save AI blog post draft.";
    if ((error as Error).message.includes("parsing")) {
      errorMessage = "AI response generated, but failed to parse structure.";
    } else if ((error as Error).message.includes("AI failed")) {
      errorMessage = "The AI failed to generate a response. Please try again.";
    } else if ((error as Error).message.includes("GNews")) {
      errorMessage = `Failed to fetch news: ${(error as Error).message}`;
    }
    res.status(500).json({ success: false, message: errorMessage, details: (error as Error).message });
  }
}
