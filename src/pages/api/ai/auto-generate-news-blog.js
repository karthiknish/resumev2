import dbConnect from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import { callGemini } from "@/lib/gemini";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]"; // Adjust path if needed
import axios from "axios"; // Import axios for fetching news
import ApiUsage from "@/models/ApiUsage"; // Import ApiUsage model

// Helper function to check admin status (copied from /api/contacts)
async function isAdminUser(req, res) {
  const session = await getServerSession(req, res, authOptions);
  // Allow access if role is admin, isAdmin is true, or email matches the admin email env var
  return (
    session?.user?.role === "admin" ||
    session?.user?.isAdmin === true ||
    session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
  );
}

// Helper function to get today's date in YYYY-MM-DD format
function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Helper function to generate a basic slug
const generateSlug = (title) => {
  if (!title) return `blog-${Date.now()}`;
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special chars except space/hyphen
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .substring(0, 75); // Limit length
};

// Function to parse the AI response (simple example, might need refinement)
const parseAIResponse = (responseText) => {
  const output = {
    title: null,
    slug: null,
    body: null,
    description: null,
    tags: [],
    category: "AI News", // Default category
  };

  // Simple parsing based on delimiters (adjust based on actual AI output)
  const titleMatch = responseText.match(/TITLE:(.*?)\n/);
  if (titleMatch && titleMatch[1]) output.title = titleMatch[1].trim();

  const slugMatch = responseText.match(/SLUG:(.*?)\n/);
  if (slugMatch && slugMatch[1]) output.slug = slugMatch[1].trim();

  const descriptionMatch = responseText.match(/DESCRIPTION:(.*?)\n/);
  if (descriptionMatch && descriptionMatch[1])
    output.description = descriptionMatch[1].trim();

  const tagsMatch = responseText.match(/TAGS:(.*?)\n/);
  if (tagsMatch && tagsMatch[1]) {
    output.tags = tagsMatch[1]
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
  }

  const bodyMatch = responseText.match(/BODY:\n([\s\S]*)/); // Match everything after BODY:
  if (bodyMatch && bodyMatch[1]) output.body = bodyMatch[1].trim();

  // Fallbacks if parsing fails
  if (!output.title) output.title = "AI Generated Blog Post";
  if (!output.slug) output.slug = generateSlug(output.title);
  if (!output.body) output.body = responseText; // Use full response if body parsing fails
  if (!output.description) output.description = output.body.substring(0, 160); // Generate basic description
  if (output.tags.length === 0) output.tags = ["AI", "Technology", "News"]; // Default tags

  return output;
};

export default async function handler(req, res) {
  // This endpoint is triggered automatically (e.g., by a cron job), so we use POST, but don't expect a body.
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  // --- Authentication Check ---
  // Check for Cron Secret first, then fall back to admin session check
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (authHeader === `Bearer ${cronSecret}`) {
    // Request is from Vercel Cron, proceed
    console.log("Authenticated via CRON_SECRET.");
  } else {
    // Not a cron job or secret doesn't match, check for admin session
    console.log(
      "CRON_SECRET mismatch or not present, checking admin session..."
    );
    const isAdmin = await isAdminUser(req, res);
    if (!isAdmin) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Forbidden: Authentication required (Admin or Cron Secret)",
        });
    }
    console.log("Authenticated via admin session.");
  }
  // --- End Admin Check ---

  try {
    await dbConnect(); // Ensure DB connection

    // --- Fetch News Content (using GNews logic) ---
    const gnewsApiKey = process.env.GNEWS_API_KEY;
    if (!gnewsApiKey) {
      throw new Error("GNEWS_API_KEY is not defined.");
    }

    const today = getTodayDateString();
    const apiName = "gnews"; // For usage tracking
    const dailyLimit = 100; // GNews free tier limit

    // Check Usage Limit
    const usage = await ApiUsage.findOne({ apiName, date: today });
    const currentCount = usage ? usage.count : 0;

    if (currentCount >= dailyLimit) {
      console.warn(
        `GNews API limit reached for ${today}. Count: ${currentCount}`
      );
      return res.status(429).json({
        success: false,
        message: `Daily GNews API limit (${dailyLimit}) reached. Cannot generate blog post.`,
      });
    }

    // GNews API parameters
    const query =
      '("AI" OR "Artificial Intelligence" OR "Machine Learning" OR "Large Language Model") AND (technology OR software OR development)'; // More focused AI query
    const lang = "en";
    const maxArticles = 1; // Fetch only the latest relevant article
    const sortBy = "publishedAt"; // Get the most recent
    const gnewsUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(
      query
    )}&lang=${lang}&max=${maxArticles}&sortby=${sortBy}&apikey=${gnewsApiKey}`;

    let newsArticle;
    try {
      const newsResponse = await axios.get(gnewsUrl);

      // Increment Usage Count AFTER successful call
      await ApiUsage.findOneAndUpdate(
        { apiName, date: today },
        { $inc: { count: 1 } },
        { upsert: true }
      );
      console.log(
        `GNews API count incremented for ${today}. New count approx: ${
          currentCount + 1
        }`
      );

      if (
        newsResponse.status !== 200 ||
        !newsResponse.data ||
        !newsResponse.data.articles ||
        newsResponse.data.articles.length === 0
      ) {
        console.warn(
          "GNews API did not return any relevant articles.",
          newsResponse.data
        );
        // Successfully checked, but no news - not a server error
        return res.status(200).json({
          success: true,
          message: "No relevant AI news found to generate a blog post.",
        });
      }
      newsArticle = newsResponse.data.articles[0]; // Get the first article
    } catch (newsError) {
      console.error(
        "GNews API fetching error:",
        newsError.response?.data || newsError.message
      );
      // Don't increment count if the API call itself failed
      throw new Error(
        `Failed to fetch news from GNews: ${
          newsError.response?.data?.errors?.join(", ") || newsError.message
        }`
      );
    }

    // Prepare news content for the prompt
    const newsInputForPrompt = `Headline: ${newsArticle.title}\nSummary: ${newsArticle.description}\nSource URL: ${newsArticle.url}`;
    // --- End Fetch News Content ---

    // --- Define the Prompt for Gemini ---
    const systemPrompt = `
    You are an expert tech blogger writing for Karthik Nishanth's website (karthiknish.com). Your task is to take the provided AI news content and write an engaging blog post about it.

    **WRITING TONE/STYLE:**
    *   **Overall Tone:** Positive and optimistic. Focus on the advancements, opportunities, and benefits presented by the AI news.
    *   **Audience:** Assume a developer audience. Use relevant technical terms naturally, but briefly explain complex concepts if necessary.
    *   **Perspective:** Write with a "developer intuition". Analyze the news from a practical standpoint – what does this mean for developers' workflows, toolchains, or the future of building software?
    *   **Structure:** Use standard HTML tags for formatting (e.g., `<h2>Heading</h2>`, `<p>Paragraph</p>`, `<ul><li>Item</li></ul>`, `<strong>bold</strong>`). Keep paragraphs concise.
    *   **Conclusion:** End with a forward-looking, solution-oriented conclusion. Summarize the key takeaway, discuss potential applications, how developers might use this, or what the next steps in this area might be. Avoid simply trailing off.
    *   Maintain a professional but engaging voice.

    **INPUT NEWS CONTENT:**
    ---
    ${newsInputForPrompt}
    ---

    **OUTPUT FORMAT:**
    Generate the blog post details strictly in the following format, using the specified delimiters. Do not add any extra text before or after this structure.

    TITLE: [Generate a concise and engaging blog post title based on the news]
    SLUG: [Generate a URL-friendly slug based on the title (lowercase, hyphens for spaces, no special chars)]
    DESCRIPTION: [Generate a brief (1-2 sentences, max 160 chars) meta description summarizing the post]
    TAGS: [Suggest 3-5 relevant comma-separated tags (e.g., AI, Machine Learning, Gemini, Tech News)]
    BODY:
    [Write the full blog post content here using appropriate HTML tags like `<h2>`, `<p>`, `<ul>`, `<li>`, `<strong>`, `<em>`, `<code>`, etc. Start with an introduction explaining the news, elaborate on the details and significance, add perspective/opinion, and conclude. Ensure the output is valid HTML within this BODY section.]
  `;

    // --- Generate Blog Post using Gemini ---
    console.log("Generating blog post draft for:", newsArticle.title);
    const generationConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048, // Increased token limit for blog posts
    };

    const aiResponseText = await callGemini(systemPrompt, generationConfig);

    if (!aiResponseText) {
      throw new Error("AI failed to generate a response.");
    }

    // --- Parse the AI Response ---
    const parsedData = parseAIResponse(aiResponseText);

    // --- Save as Draft Blog Post ---
    const newBlogPost = new Blog({
      title: parsedData.title,
      slug: parsedData.slug, // Consider checking for slug uniqueness if needed
      description: parsedData.description,
      tags: parsedData.tags,
      category: parsedData.category,
      body: parsedData.body, // HTML content
      isPublished: true, // <<< CHANGED: Publish automatically
      author: "AI Assistant", // Or assign to Karthik's user ID if available/desired
      // bannerImage: null, // Add logic for banner image later if needed
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newBlogPost.save();

    res.status(201).json({
      success: true,
      message: "AI blog post generated and published successfully.", // Updated message
      data: {
        _id: newBlogPost._id,
        title: newBlogPost.title,
        slug: newBlogPost.slug,
      },
    });
  } catch (error) {
    console.error("Error in auto-generate-news-blog API:", error);
    let errorMessage = "Failed to generate or save AI blog post draft.";
    if (error.message.includes("parsing")) {
      errorMessage =
        "AI response generated, but failed to parse the structure. Please check AI output format.";
    } else if (error.message.includes("AI failed")) {
      errorMessage = "The AI failed to generate a response. Please try again.";
    } else if (error.name === "ValidationError") {
      errorMessage = `Database validation failed: ${error.message}`;
    } else if (error.message.includes("GNews")) {
      errorMessage = `Failed to fetch news: ${error.message}`; // Pass through GNews specific errors
    }
    res
      .status(500)
      .json({ success: false, message: errorMessage, details: error.message });
  }
}
