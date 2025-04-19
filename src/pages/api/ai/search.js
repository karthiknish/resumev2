import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import { callGemini } from "@/lib/gemini"; // Use the correct exported function name
import logger from "@/utils/logger";

// Basic structure for the AI search endpoint
export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} Not Allowed` });
  }

  const { query } = req.query;

  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return res.status(400).json({
      message: "Search query is required and must be a non-empty string.",
    });
  }

  logger.info(`AI Search initiated for query: "${query}"`);

  try {
    await dbConnect();

    // 1. Fetch potential content (start with blog posts)
    // Consider fetching only relevant fields (title, description, maybe content snippet)
    // Add filtering/limiting for performance if needed
    const posts = await Blog.find(
      { published: true },
      "title description slug content"
    ).lean(); // Fetch necessary fields

    if (!posts || posts.length === 0) {
      logger.warn("No blog posts found for AI search context.");
      return res.status(200).json({ results: [] }); // Return empty if no content
    }

    // 2. Format content for Gemini prompt
    const contentForPrompt = posts.map((post) => ({
      id: post.slug, // Use slug as a unique identifier
      title: post.title,
      description: post.description,
      // Optional: Include a snippet of content if helpful and within token limits
      // contentSnippet: post.content.substring(0, 200) + '...'
    }));

    // 3. Create the prompt for Gemini
    // TODO: Refine this prompt for better results
    const prompt = `
      User Query: "${query}"

      Available Blog Posts:
      ${JSON.stringify(contentForPrompt, null, 2)}

      Based on the user query, please rank the provided blog posts by relevance.
      Return ONLY a JSON array of the blog post "id"s (which are slugs) in order of relevance, from most relevant to least relevant.
      Example response format: ["relevant-post-slug", "another-relevant-slug", "less-relevant-slug"]
      If no posts are relevant, return an empty array [].
    `;

    // 4. Call Gemini API
    // TODO: Implement error handling and potentially parse the response more robustly
    logger.info("Sending request to Gemini for AI search ranking...");
    const geminiResponse = await callGemini(prompt); // Use the correct function name
    logger.info("Received response from Gemini.");

    // 5. Parse Gemini response (expecting a JSON array of slugs)
    let rankedSlugs = [];
    try {
      // Attempt to parse the text response as JSON
      // Need to handle potential variations in Gemini's output format
      const cleanedResponse = geminiResponse
        .replace(/```json\n?|\n?```/g, "")
        .trim(); // Clean potential markdown code blocks
      rankedSlugs = JSON.parse(cleanedResponse);
      if (!Array.isArray(rankedSlugs)) {
        throw new Error("Gemini response was not a valid JSON array.");
      }
      logger.info(`Gemini ranked slugs: ${JSON.stringify(rankedSlugs)}`);
    } catch (parseError) {
      logger.error(
        `Error parsing Gemini response: ${parseError.message}. Raw response: ${geminiResponse}`
      );
      // Fallback or error handling: Maybe return unranked posts or an error?
      // For now, return empty results on parse failure
      return res
        .status(500)
        .json({ message: "Failed to parse AI ranking response." });
    }

    // 6. Fetch full details for ranked posts (maintaining order)
    // Use the ranked slugs to fetch the posts in the correct order
    const rankedPosts = [];
    if (rankedSlugs.length > 0) {
      const postsMap = new Map(posts.map((p) => [p.slug, p]));
      for (const slug of rankedSlugs) {
        const post = postsMap.get(slug);
        if (post) {
          // Select only the fields needed for the search results display
          rankedPosts.push({
            _id: post._id, // Keep _id if needed by frontend
            title: post.title,
            slug: post.slug,
            description: post.description,
            // Add other fields like bannerImage if displayed in results
          });
        } else {
          logger.warn(
            `Gemini returned slug "${slug}" which was not found in the initial fetch.`
          );
        }
      }
    }

    logger.info(
      `Returning ${rankedPosts.length} ranked results for query "${query}"`
    );
    return res.status(200).json({ results: rankedPosts });
  } catch (error) {
    logger.error(`Error in AI search API: ${error.message}`, {
      stack: error.stack,
    });
    return res
      .status(500)
      .json({ message: "Internal Server Error during AI search." });
  }
}
