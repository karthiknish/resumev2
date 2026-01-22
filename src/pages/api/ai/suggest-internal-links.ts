import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { callGemini } from "@/lib/gemini";
import { getFirestore } from "@/lib/firebaseAdmin";

const COLLECTION = "blogs";

async function isAdminUser(req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
  const session = await getServerSession(req, res, authOptions);
  return (
    (session?.user as { role?: string; isAdmin?: boolean })?.role === "admin" ||
    (session?.user as { role?: string; isAdmin?: boolean })?.isAdmin === true ||
    session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
  );
}

interface PostData {
  _id: string;
  id: string;
  title: string;
  slug: string;
  description?: string;
  category?: string;
  tags?: string[];
  imageUrl?: string;
  createdAt?: string | Date;
}

interface PostSummary {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string;
}

interface LinkSuggestion {
  id: number;
  title: string;
  slug: string;
  relevanceReason: string;
  anchorText: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated" });
  }
  const isAdmin = await isAdminUser(req, res);
  if (!isAdmin) {
    return res.status(403).json({ success: false, message: "Not authorized" });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  const { title, contentSnippet, currentSlug } = req.body as { title?: string; contentSnippet?: string; currentSlug?: string };

  if (!title && !contentSnippet) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Title or content snippet is required.",
      });
  }

  try {
    const db = getFirestore();

    const snapshot = await db.collection(COLLECTION)
      .where("isPublished", "==", true)
      .orderBy("createdAt", "desc")
      .limit(60)
      .get();

    let publishedPosts = snapshot.docs.map(doc => ({
      _id: doc.id,
      id: doc.id,
      ...doc.data()
    })) as PostData[];

    if (currentSlug) {
      publishedPosts = publishedPosts.filter(p => p.slug !== currentSlug);
    }
    
    publishedPosts = publishedPosts.slice(0, 50);

    if (publishedPosts.length === 0) {
      return res.status(200).json({
        success: true,
        suggestions: [],
        message: "No published posts found to suggest.",
      });
    }

    const postsSummary: PostSummary[] = publishedPosts.map((post, index) => ({
      id: index + 1,
      title: post.title,
      slug: post.slug,
      description: post.description?.substring(0, 150) || "",
      category: post.category || "Uncategorized",
      tags: post.tags?.join(", ") || "",
    }));

    const prompt = `
      Act as an SEO expert and content strategist. Your goal is to suggest
      most relevant internal blog posts to link to from
      current article.

      You're analyzing content for karthiknish.com, a technical blog focused on web development, software architecture, and career growth in tech.

      Current Article Context:
      Title: "${title || "Untitled Post"}"
      Content Snippet: "${(contentSnippet || "").substring(0, 800)}..."

      Available Blog Posts to Link To:
      ${postsSummary
        .map(
          (post) =>
            `${post.id}. Title: "${post.title}" | Slug: "${post.slug}" | Category: "${post.category}" | Tags: "${post.tags}" | Description: "${post.description}"`
        )
        .join("\n")}

      Guidelines for selecting internal links:
      1. **Relevance**: Choose posts that are topically related to
      current content
      2. **Context**: Consider where readers would want additional information
      3. **SEO Value**: Prioritize linking to posts that would help search engines understand site structure
      4. **User Journey**: Think about
      reader's path - what would they naturally want to read next?
      5. **Diversity**: Include posts from different relevant categories if applicable
      6. **Quality**: Link to comprehensive, valuable content
      7. **Match Count**: Select exactly 3-6 most relevant posts

      Output Format:
      Provide a JSON array of objects, each containing:
      - id: The post ID from
      list above (number)
      - title: The post title to display (string)
      - slug: The post slug for linking (string)
      - relevanceReason: Brief explanation of why this link is relevant (string, max 50 chars)
      - anchorText: Suggested anchor text for
      link (string, max 30 chars)

      Example output:
      [
        {"id": 5, "title": "React Performance Tips", "slug": "react-performance-tips", "relevanceReason": "Deep dive on optimization", "anchorText": "performance techniques"},
        {"id": 12, "title": "Next.js Data Fetching", "slug": "nextjs-data-fetching", "relevanceReason": "Related server-side rendering", "anchorText": "data fetching patterns"}
      ]

      Output ONLY
      JSON array with no additional text, explanations, or formatting.
    `;

    const generationConfig = {
      temperature: 0.4,
      maxOutputTokens: 1024,
    };

    const linksJsonString = await callGemini(
      prompt,
      generationConfig
    );

    try {
      let cleaned = linksJsonString.trim();
      if (cleaned.startsWith("```json")) {
        cleaned = cleaned.slice(7);
      }
      if (cleaned.startsWith("```")) {
        cleaned = cleaned.slice(3);
      }
      if (cleaned.endsWith("```")) {
        cleaned = cleaned.slice(0, -3);
      }
      cleaned = cleaned.trim();

      let suggestions = JSON.parse(cleaned) as LinkSuggestion[];

      if (!Array.isArray(suggestions)) {
        throw new Error(
          "API did not return a valid JSON array for link suggestions."
        );
      }

      const validatedSuggestions = suggestions
        .filter((s) => s && typeof s === "object" && s.id && s.slug)
        .map((s) => {
          const postData = publishedPosts.find((p) => p.slug === s.slug);
          if (!postData) return null;

          return {
            _id: postData._id,
            title: postData.title,
            slug: postData.slug,
            description: postData.description,
            category: postData.category,
            imageUrl: postData.imageUrl,
            createdAt: postData.createdAt,
            relevanceReason: s.relevanceReason || "Related content",
            anchorText: s.anchorText || postData.title,
          };
        })
        .filter(Boolean);

      res
        .status(200)
        .json({ success: true, suggestions: validatedSuggestions });
    } catch (parseError) {
      console.error(
        "Failed to parse Gemini internal links response as JSON:",
        linksJsonString,
        parseError
      );

      const currentContent = `${title || ""} ${contentSnippet || ""}`.toLowerCase();
      const fallbackSuggestions = publishedPosts
        .filter((post) => {
          const postTags = (post.tags || []).map((t: string) => t.toLowerCase());
          const postCategory = post.category?.toLowerCase() || "";
          const hasMatchingTag = postTags.some((tag: string) =>
            currentContent.includes(tag)
          );
          const hasMatchingCategory =
            postCategory && currentContent.includes(postCategory);
          return hasMatchingTag || hasMatchingCategory;
        })
        .slice(0, 5)
        .map((post) => ({
          _id: post._id,
          title: post.title,
          slug: post.slug,
          description: post.description,
          category: post.category,
          imageUrl: post.imageUrl,
          createdAt: post.createdAt,
          relevanceReason: "Related by tags or category",
          anchorText: post.title,
        }));

      console.warn(
        "Could not parse AI response, using tag-based fallback suggestions."
      );
      res
        .status(200)
        .json({ success: true, suggestions: fallbackSuggestions });
    }
  } catch (error: unknown) {
    console.error("Error calling Gemini for internal link suggestions:", error);
    res
      .status(500)
      .json({
        success: false,
        message: error instanceof Error ? error.message : "Failed to generate internal link suggestions.",
      });
  }
}
