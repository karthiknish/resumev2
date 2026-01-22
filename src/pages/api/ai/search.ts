import { NextApiRequest, NextApiResponse } from "next";
import { runQuery, fieldFilter } from "@/lib/firebase";
import { callGemini } from "@/lib/gemini";
import logger from "@/utils/logger";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const { query } = req.query;

  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return res.status(400).json({
      message: "Search query is required and must be a non-empty string.",
    });
  }

  logger.info("AI Search", `Initiated for query: "${query}"`, { query });

  try {
    interface BlogPreview {
      slug: string;
      title: string;
      description?: string;
      id?: string;
      _id?: string;
    }

    const posts = await runQuery<BlogPreview>(
      "blogs",
      [fieldFilter("isPublished", "EQUAL", true)]
    );

    if (!posts || posts.length === 0) {
      logger.warn("AI Search", "No blog posts found for context.", { postsLength: 0 });
      return res.status(200).json({ results: [] });
    }

    const contentForPrompt = posts.map((post) => ({
      id: post.slug,
      title: post.title,
      description: post.description,
    }));

    const prompt = `
      User Query: "${query}"

      Available Blog Posts:
      ${JSON.stringify(contentForPrompt, null, 2)}

      Based on the user query, please rank the provided blog posts by relevance.
      Return ONLY a JSON array of the blog post "id"s (which are slugs) in order of relevance, from most relevant to least relevant.
      Example response format: ["relevant-post-slug", "another-relevant-slug", "less-relevant-slug"]
      If no posts are relevant, return an empty array [].
    `;

    logger.info("AI Search", "Sending request to Gemini for ranking...", { promptLength: prompt.length });

    const geminiResponse = await callGemini(prompt, {
      temperature: 0.4,
      maxOutputTokens: 1024,
    });

    logger.info("AI Search", "Received response from Gemini.", { responseLength: geminiResponse?.length });

    let rankedSlugs: string[] = [];
    try {
      const cleanedResponse = geminiResponse.replace(/```json\n?|\n?```/g, "").trim();
      rankedSlugs = JSON.parse(cleanedResponse);
      if (!Array.isArray(rankedSlugs)) {
        throw new Error("Gemini response was not a valid JSON array.");
      }
      logger.info("AI Search", `Gemini ranked slugs: ${JSON.stringify(rankedSlugs)}`, { count: rankedSlugs.length });
    } catch (parseError: unknown) {
      logger.error("AI Search", `Error parsing Gemini response: ${parseError instanceof Error ? parseError.message : String(parseError)}`, { rawResponse: geminiResponse.substring(0, 500) });
      return res.status(500).json({
        message: "Failed to parse AI ranking response.",
        details: parseError instanceof Error ? parseError.message : String(parseError),
      });
    }

    const rankedPosts: { id: string; title: string; slug: string; description?: string }[] = [];
    if (rankedSlugs.length > 0) {
      const postsMap = new Map(posts.map((p) => [p.slug, p]));
      for (const slug of rankedSlugs) {
        const post = postsMap.get(slug);
        if (post) {
          rankedPosts.push({
            id: post.id ?? post._id ?? post.slug,
            title: post.title,
            slug: post.slug,
            description: post.description,
          });
        } else {
          logger.warn("AI Search", `Gemini returned slug "${slug}" which was not found.`, { slug });
        }
      }
    }

    logger.info("AI Search", `Returning ${rankedPosts.length} ranked results for query "${query}"`, { count: rankedPosts.length });

    return res.status(200).json({ results: rankedPosts });
  } catch (error: unknown) {
    logger.error("AI Search", `Error in AI search API: ${error instanceof Error ? error.message : String(error)}`, { stack: error instanceof Error ? error.stack : undefined });
    return res.status(500).json({
      message: "Internal Server Error during AI search.",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
