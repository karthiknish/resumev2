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

  logger.info(`AI Search initiated for query: "${query}"`);

  try {
    const posts = await runQuery(
      "blogs",
      [fieldFilter("isPublished", "EQUAL", true)]
    );

    if (!posts || posts.length === 0) {
      logger.warn("No blog posts found for AI search context.");
      return res.status(200).json({ results: [] });
    }

    const contentForPrompt = posts.map((post: any) => ({
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

    logger.info("Sending request to Gemini for AI search ranking...");

    const geminiResponse = await callGemini(prompt, {
      temperature: 0.4,
      maxOutputTokens: 1024,
    });

    logger.info("Received response from Gemini.");

    let rankedSlugs: string[] = [];
    try {
      const cleanedResponse = geminiResponse.replace(/```json\n?|\n?```/g, "").trim();
      rankedSlugs = JSON.parse(cleanedResponse);
      if (!Array.isArray(rankedSlugs)) {
        throw new Error("Gemini response was not a valid JSON array.");
      }
      logger.info(`Gemini ranked slugs: ${JSON.stringify(rankedSlugs)}`);
    } catch (parseError) {
      logger.error(`Error parsing Gemini response: ${parseError.message}. Raw response: ${geminiResponse.substring(0, 500)}`);
      return res.status(500).json({
        message: "Failed to parse AI ranking response.",
        details: parseError.message,
      });
    }

    const rankedPosts = [];
    if (rankedSlugs.length > 0) {
      const postsMap = new Map(posts.map((p: any) => [p.slug, p]));
      for (const slug of rankedSlugs) {
        const post = postsMap.get(slug);
        if (post) {
          rankedPosts.push({
            _id: post._id,
            title: post.title,
            slug: post.slug,
            description: post.description,
          });
        } else {
          logger.warn(`Gemini returned slug "${slug}" which was not found in the initial fetch.`);
        }
      }
    }

    logger.info(`Returning ${rankedPosts.length} ranked results for query "${query}"`);

    return res.status(200).json({ results: rankedPosts });
  } catch (error) {
    logger.error(`Error in AI search API: ${error.message}`, { stack: (error as Error).stack });
    return res.status(500).json({
      message: "Internal Server Error during AI search.",
      details: (error as Error).message,
    });
  }
}
